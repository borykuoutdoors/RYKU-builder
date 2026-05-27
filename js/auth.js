/* ============================================
   BŌRYKU / RYKU — AUTH SYSTEM
   Structured for Supabase Auth (mock layer)
   ============================================

   SUPABASE SETUP (when ready to go live):
   ─────────────────────────────────────────
   import { createClient } from '@supabase/supabase-js'
   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

   DATABASE SCHEMA:
   ─────────────────────────────────────────
   profiles (
     id           UUID PK → auth.users.id
     username     TEXT UNIQUE
     full_name    TEXT
     avatar_url   TEXT
     bio          TEXT
     vehicle_make TEXT, vehicle_model TEXT, vehicle_year INT
     social_handle TEXT
     plan         TEXT DEFAULT 'free'   -- free | pro
     created_at   TIMESTAMPTZ DEFAULT NOW()
   )

   saved_builds (
     id           UUID DEFAULT gen_random_uuid() PK
     user_id      UUID → profiles.id
     build_name   TEXT
     vehicle_id   TEXT
     vehicle_year INT
     vehicle_trim TEXT
     mission      TEXT
     budget       INT
     parts        JSONB
     total_cost   INT
     notes        TEXT
     created_at   TIMESTAMPTZ DEFAULT NOW()
     updated_at   TIMESTAMPTZ DEFAULT NOW()
   )

   contest_entries (
     id             UUID DEFAULT gen_random_uuid() PK
     user_id        UUID → profiles.id
     build_name     TEXT NOT NULL
     vehicle_make   TEXT, vehicle_model TEXT, vehicle_year INT, vehicle_trim TEXT
     description    TEXT
     modifications  JSONB
     products_used  JSONB
     photos         JSONB
     total_cost     INT
     social_handle  TEXT
     contest_month  TEXT  -- '2024-06'
     votes          INT DEFAULT 0
     status         TEXT DEFAULT 'pending'  -- pending|approved|featured|winner
     prize_tier     INT  -- 1 | 2 | 3
     created_at     TIMESTAMPTZ DEFAULT NOW()
   )

   contest_votes (
     id          UUID DEFAULT gen_random_uuid() PK
     user_id     UUID → profiles.id
     entry_id    UUID → contest_entries.id
     created_at  TIMESTAMPTZ DEFAULT NOW()
     UNIQUE(user_id, entry_id)
   )
   ============================================ */

const BORIKU_AUTH = (function () {

  /* ---- STATE ---- */
  let _user = null;
  const SESSION_KEY  = 'boriku_session';
  const BUILDS_KEY   = id => 'boriku_builds_' + id;
  const VOTES_KEY    = id => 'boriku_votes_' + id;
  const PROFILE_KEY  = id => 'boriku_profile_' + id;

  /* ---- HELPERS ---- */
  function _save(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (user?.id) localStorage.setItem(PROFILE_KEY(user.id), JSON.stringify(user));
  }

  function _avatarLetter(name) {
    return (name || '?').trim().charAt(0).toUpperCase();
  }

  function _buildUser(overrides) {
    return {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: '',
      fullName: '',
      avatar: '?',
      joinedAt: new Date().toISOString(),
      plan: 'free',
      bio: '',
      socialHandle: '',
      vehicle: null,
      ...overrides
    };
  }

  /* ---- PUBLIC API ---- */
  const api = {

    get currentUser() { return _user; },

    /* init — call on every page load */
    init() {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        try { _user = JSON.parse(raw); } catch (e) { _user = null; }
      }
      this.updateNavUI();
      this._handleAuthRedirect();
    },

    /* ---- AUTH ACTIONS ---- */

    /* supabase.auth.signUp({ email, password, options:{ data:{ full_name } } }) */
    async signUp(email, password, fullName) {
      if (!email || !password || !fullName) return { error: 'All fields required.' };
      const existing = this._findUserByEmail(email);
      if (existing) return { error: 'An account with that email already exists.' };

      const user = _buildUser({
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        avatar: _avatarLetter(fullName)
      });

      _save(user);
      _user = user;
      this.updateNavUI();
      return { user, error: null };
    },

    /* supabase.auth.signInWithPassword({ email, password }) */
    async signIn(email, password) {
      if (!email || !password) return { error: 'Email and password required.' };
      let user = this._findUserByEmail(email);
      if (!user) {
        /* first-time sign-in creates a demo session (replace with real Supabase check) */
        user = _buildUser({
          email: email.trim().toLowerCase(),
          fullName: email.split('@')[0],
          avatar: _avatarLetter(email)
        });
        _save(user);
      } else {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
      _user = user;
      this.updateNavUI();
      return { user, error: null };
    },

    /* supabase.auth.signOut() */
    signOut() {
      localStorage.removeItem(SESSION_KEY);
      _user = null;
      this.updateNavUI();
      window.location.href = 'index.html';
    },

    /* update profile fields */
    updateProfile(fields) {
      if (!_user) return;
      Object.assign(_user, fields);
      if (fields.fullName) _user.avatar = _avatarLetter(fields.fullName);
      _save(_user);
      this.updateNavUI();
    },

    isLoggedIn() { return !!_user; },

    /* Redirect to login if not authenticated */
    requireAuth() {
      if (!this.isLoggedIn()) {
        const back = encodeURIComponent(window.location.href);
        window.location.href = 'login.html?redirect=' + back;
        return false;
      }
      return true;
    },

    /* ---- BUILD STORAGE ---- */
    /* supabase.from('saved_builds').select('*').eq('user_id', user.id).order('created_at', {ascending:false}) */
    getSavedBuilds() {
      if (!_user) return [];
      try { return JSON.parse(localStorage.getItem(BUILDS_KEY(_user.id))) || []; }
      catch (e) { return []; }
    },

    /* supabase.from('saved_builds').insert({...}) */
    saveBuiltPlan(buildData) {
      if (!_user) return null;
      const builds = this.getSavedBuilds();
      const entry = {
        id: 'bld_' + Date.now(),
        userId: _user.id,
        savedAt: new Date().toISOString(),
        ...buildData
      };
      builds.unshift(entry);
      localStorage.setItem(BUILDS_KEY(_user.id), JSON.stringify(builds));
      return entry;
    },

    /* supabase.from('saved_builds').delete().eq('id', id) */
    deleteSavedBuild(buildId) {
      if (!_user) return;
      const builds = this.getSavedBuilds().filter(b => b.id !== buildId);
      localStorage.setItem(BUILDS_KEY(_user.id), JSON.stringify(builds));
    },

    /* ---- CONTEST VOTES ---- */
    getVotedEntries() {
      if (!_user) return [];
      try { return JSON.parse(localStorage.getItem(VOTES_KEY(_user.id))) || []; }
      catch (e) { return []; }
    },

    hasVoted(entryId) {
      return this.getVotedEntries().includes(entryId);
    },

    castVote(entryId) {
      if (!this.requireAuth()) return false;
      if (this.hasVoted(entryId)) { this.removeVote(entryId); return false; }
      const votes = this.getVotedEntries();
      votes.push(entryId);
      localStorage.setItem(VOTES_KEY(_user.id), JSON.stringify(votes));
      return true;
    },

    removeVote(entryId) {
      if (!_user) return;
      const votes = this.getVotedEntries().filter(v => v !== entryId);
      localStorage.setItem(VOTES_KEY(_user.id), JSON.stringify(votes));
    },

    /* ---- PRIVATE HELPERS ---- */
    _findUserByEmail(email) {
      const e = email.trim().toLowerCase();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('boriku_profile_')) continue;
        try {
          const u = JSON.parse(localStorage.getItem(key));
          if (u && u.email === e) return u;
        } catch (_) {}
      }
      return null;
    },

    _handleAuthRedirect() {
      const url = new URL(window.location.href);
      const redirect = url.searchParams.get('authed');
      if (redirect && this.isLoggedIn()) {
        window.location.href = decodeURIComponent(redirect);
      }
    },

    /* ---- NAV UI ---- */
    updateNavUI() {
      /* desktop + mobile auth areas */
      document.querySelectorAll('.nav-auth-area').forEach(area => {
        if (_user) {
          area.innerHTML = `
            <div class="nav-user-wrap">
              <button class="nav-user-btn" type="button">
                <div class="nav-user-avatar">${_user.avatar}</div>
                <span class="nav-user-name">${_user.fullName || _user.email.split('@')[0]}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="nav-user-dropdown">
                <a href="account.html" class="nav-dropdown-item">
                  <span>👤</span> My Profile
                </a>
                <a href="account.html#my-builds" class="nav-dropdown-item">
                  <span>🔧</span> My Builds
                </a>
                <a href="account.html#saved" class="nav-dropdown-item">
                  <span>♥</span> Saved Builds
                </a>
                <a href="contest.html" class="nav-dropdown-item">
                  <span>🏆</span> Build Contest
                </a>
                <a href="account.html#subscription" class="nav-dropdown-item">
                  <span>⭐</span> Subscription
                </a>
                <div class="nav-dropdown-divider"></div>
                <a href="account.html#settings" class="nav-dropdown-item">Settings</a>
                <button class="nav-dropdown-item nav-dropdown-danger" onclick="BORIKU_AUTH.signOut()">
                  Sign Out
                </button>
              </div>
            </div>`;
          /* attach toggle */
          const wrap = area.querySelector('.nav-user-wrap');
          const btn  = area.querySelector('.nav-user-btn');
          const drop = area.querySelector('.nav-user-dropdown');
          btn?.addEventListener('click', e => {
            e.stopPropagation();
            drop?.classList.toggle('open');
          });
          document.addEventListener('click', () => drop?.classList.remove('open'), { once: false });
        } else {
          area.innerHTML = `
            <a href="login.html" class="btn btn-ghost btn-sm" style="color:var(--text-2);">Log In</a>
            <a href="login.html?mode=signup" class="btn btn-secondary btn-sm">Create Account</a>`;
        }
      });

      /* mobile menu auth section */
      document.querySelectorAll('.mobile-auth-section').forEach(el => {
        if (_user) {
          el.innerHTML = `
            <div style="padding:12px 20px;border-top:1px solid var(--border);margin-top:8px;">
              <div style="font-size:0.6875rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px;">
                ${_user.fullName || _user.email}
              </div>
              <a href="account.html" class="nav-mobile-link">My Account</a>
              <a href="contest.html" class="nav-mobile-link">Build Contest</a>
              <button style="width:100%;text-align:left;padding:14px 20px;font-size:0.875rem;font-weight:700;color:var(--danger);background:none;border:none;cursor:pointer;border-radius:var(--r-lg);"
                      onclick="BORIKU_AUTH.signOut()">Sign Out</button>
            </div>`;
        } else {
          el.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:8px;padding:12px 0;border-top:1px solid var(--border);margin-top:8px;">
              <a href="login.html" class="btn btn-secondary">Log In</a>
              <a href="login.html?mode=signup" class="btn btn-primary">Create Account</a>
            </div>`;
        }
      });
    }
  };

  return api;
})();

/* Auto-init on DOMContentLoaded */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BORIKU_AUTH.init());
} else {
  BORIKU_AUTH.init();
}
