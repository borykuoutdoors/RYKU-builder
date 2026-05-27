/* ============================================
   BŌRYKU / RYKU — MONTHLY BUILD CONTEST
   ============================================ */

const BORIKU_CONTEST = (function () {

  /* ---- CURRENT CONTEST MONTH ---- */
  const NOW        = new Date();
  const MONTH_KEY  = `${NOW.getFullYear()}-${String(NOW.getMonth() + 1).padStart(2, '0')}`;
  const MONTH_LABEL = NOW.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

  /* End of current month */
  const MONTH_END = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 0, 23, 59, 59);

  /* ---- MOCK CONTEST ENTRIES ---- */
  const MOCK_ENTRIES = [
    {
      id: 'ce-001',
      buildName: 'DUST PROTOCOL',
      ownerName: 'Marcus R.',
      ownerAvatar: 'M',
      socialHandle: '@marcusbuilds',
      vehicle: '2021 Toyota Tacoma TRD Pro',
      vehicleMake: 'Toyota', vehicleModel: 'Tacoma', vehicleYear: 2021, vehicleTrim: 'TRD Pro',
      description: 'Built for the long haul. Every part chosen for function, not show. This rig has 14,000 miles of desert and mountain terrain since the build completed.',
      modifications: ['2" ICON Stage 5 Coilovers', 'Prinsu Full Cab Roof Rack', 'iKamper Skycamp 3.0 RTT', 'ARB Summit Front Bumper', 'CBI Rock Sliders', 'Method 305 NV 17x8.5', 'BFG KO2 285/70R17'],
      totalCost: 19800,
      votes: 847,
      status: 'featured',
      contestMonth: MONTH_KEY,
      createdAt: new Date(NOW.getFullYear(), NOW.getMonth(), 3).toISOString(),
      accentColor: '#FF551F'
    },
    {
      id: 'ce-002',
      buildName: 'ARCTIC SIEGE',
      ownerName: 'Taylor S.',
      ownerAvatar: 'T',
      socialHandle: '@tsoverland',
      vehicle: '2022 Toyota 4Runner TRD Off-Road',
      vehicleMake: 'Toyota', vehicleModel: '4Runner', vehicleYear: 2022, vehicleTrim: 'TRD Off-Road',
      description: 'Winter-ready overland build designed for the Pacific Northwest. Everything waterproofed, everything heat-wrapped. Sleeps comfortably at -20°F.',
      modifications: ['Old Man Emu Dakar 2.5" BP-51', 'Front Runner Slimline II Rack', 'ARB Simpson III RTT', 'ARB Summit Bumper + Rear Deluxe Bar', 'Fuel D595 Beadlock 17"', 'Toyo Open Country AT 285/70R17', 'ARB Zero 63qt Fridge'],
      totalCost: 28400,
      votes: 712,
      status: 'approved',
      contestMonth: MONTH_KEY,
      createdAt: new Date(NOW.getFullYear(), NOW.getMonth(), 5).toISOString(),
      accentColor: '#3B82F6'
    },
    {
      id: 'ce-003',
      buildName: 'RED CANYON RIG',
      ownerName: 'Jordan M.',
      ownerAvatar: 'J',
      socialHandle: '@jmoffroad',
      vehicle: '2022 Jeep Wrangler Rubicon JL',
      vehicleMake: 'Jeep', vehicleModel: 'Wrangler JL', vehicleYear: 2022, vehicleTrim: 'Rubicon',
      description: 'Pure rock crawler. No highway miles. This Rubicon lives on technical trails in Moab and Sedona. Built to be pushed hard and recovered easy.',
      modifications: ['Fox 2.5 Performance Series 2" Lift', 'Gobi Stealth Roof Rack', 'Warn Zeon 10-S Winch', 'Warn Ascent Front Bumper', 'KMC XD811 Rockstar 17"', 'Toyo Open Country MT 35x12.5R17', 'Baja Designs LP9 Pro Pods'],
      totalCost: 16200,
      votes: 634,
      status: 'approved',
      contestMonth: MONTH_KEY,
      createdAt: new Date(NOW.getFullYear(), NOW.getMonth(), 7).toISOString(),
      accentColor: '#EF4444'
    },
    {
      id: 'ce-004',
      buildName: 'STEALTH MODE',
      ownerName: 'Riley K.',
      ownerAvatar: 'R',
      socialHandle: '@rkoverlandco',
      vehicle: '2023 Ford Bronco Badlands',
      vehicleMake: 'Ford', vehicleModel: 'Bronco', vehicleYear: 2023, vehicleTrim: 'Badlands',
      description: 'All-black stealth build. No chrome. No shine. Matte everything. The kind of rig that shows up on the trail and disappears into the treeline.',
      modifications: ['Fox Factory Series 3" Lift', 'Rigid Industries E-Series 20" Light Bar', 'Baja Designs LP9 Pods', 'DECKED Bed Drawer System', 'Method Race Wheels 305 NV', 'Falken Wildpeak AT3W 285/70R17'],
      totalCost: 14900,
      votes: 589,
      status: 'approved',
      contestMonth: MONTH_KEY,
      createdAt: new Date(NOW.getFullYear(), NOW.getMonth(), 9).toISOString(),
      accentColor: '#8B5CF6'
    },
    {
      id: 'ce-005',
      buildName: 'TERRA NOVA',
      ownerName: 'Casey B.',
      ownerAvatar: 'C',
      socialHandle: '@caseybuildsit',
      vehicle: '2020 Toyota Tundra TRD Pro',
      vehicleMake: 'Toyota', vehicleModel: 'Tundra', vehicleYear: 2020, vehicleTrim: 'TRD Pro',
      description: 'Overland truck built for family adventures. Three kids, two dogs, 400 miles of trail per weekend. Comfort meets capability.',
      modifications: ['Bilstein 5100 2" Lift', 'Front Runner Slimline II Rack', 'Roofnest Condor Overland RTT', 'ARB Base Rack System', 'Method 701 Trail Wheels', 'BFG KO2 275/70R18', 'Garmin inReach Mini 2'],
      totalCost: 12600,
      votes: 447,
      status: 'approved',
      contestMonth: MONTH_KEY,
      createdAt: new Date(NOW.getFullYear(), NOW.getMonth(), 11).toISOString(),
      accentColor: '#22C55E'
    },
    {
      id: 'ce-006',
      buildName: 'IRON GHOST',
      ownerName: 'Alex W.',
      ownerAvatar: 'A',
      socialHandle: '@awoffroad',
      vehicle: '2021 Jeep Gladiator Rubicon',
      vehicleMake: 'Jeep', vehicleModel: 'Gladiator', vehicleYear: 2021, vehicleTrim: 'Rubicon',
      description: 'Built on a budget, performs like it cost twice as much. Smart parts selection and a lot of DIY install work. Proof that you don\'t need to spend $40k to build a serious rig.',
      modifications: ['Bilstein 5100 2" Lift', 'CBI Baja Tube Bumper', 'CBI Rock Sliders', 'MAXTRAX MKII 4-Pack', 'KMC XD811 Wheels', 'Cooper AT3 285/70R17'],
      totalCost: 7800,
      votes: 398,
      status: 'approved',
      contestMonth: MONTH_KEY,
      createdAt: new Date(NOW.getFullYear(), NOW.getMonth(), 14).toISOString(),
      accentColor: '#F59E0B'
    }
  ];

  /* ---- PRIZES ---- */
  const PRIZES = [
    {
      tier: 1,
      label: '1st Place',
      prize: 'ARB Summit Front Bumper',
      value: '$2,150',
      icon: '🥇',
      color: '#F59E0B'
    },
    {
      tier: 2,
      label: '2nd Place',
      prize: 'Baja Designs LP9 Pro Pods',
      value: '$890',
      icon: '🥈',
      color: '#9CA3AF'
    },
    {
      tier: 3,
      label: '3rd Place',
      prize: 'MAXTRAX MKII Recovery Boards',
      value: '$449',
      icon: '🥉',
      color: '#B45309'
    }
  ];

  /* ---- VOTE COUNTS (persisted in localStorage) ---- */
  const VOTES_STORE_KEY = 'boriku_contest_votes_' + MONTH_KEY;

  function _getVoteCounts() {
    try { return JSON.parse(localStorage.getItem(VOTES_STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function _saveVoteCounts(counts) {
    localStorage.setItem(VOTES_STORE_KEY, JSON.stringify(counts));
  }

  /* ---- PUBLIC API ---- */
  return {

    MONTH_LABEL,
    MONTH_END,
    PRIZES,

    /* Get all entries for current month, sorted by votes */
    getEntries(sortBy = 'votes') {
      const counts = _getVoteCounts();
      const entries = MOCK_ENTRIES.map(e => ({
        ...e,
        votes: (counts[e.id] !== undefined ? counts[e.id] : e.votes)
      }));

      /* Merge user-submitted entries from localStorage */
      const userEntries = this.getUserSubmissions();
      const allEntries = [...entries, ...userEntries];

      if (sortBy === 'votes')   return [...allEntries].sort((a, b) => b.votes - a.votes);
      if (sortBy === 'newest')  return [...allEntries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return allEntries;
    },

    getEntryById(id) {
      return this.getEntries().find(e => e.id === id) || null;
    },

    getTopThree() {
      return this.getEntries('votes').slice(0, 3);
    },

    /* supabase.from('contest_entries').insert({...}) */
    submitEntry(data) {
      const entries = this.getUserSubmissions();
      const entry = {
        id: 'ce_user_' + Date.now(),
        ...data,
        votes: 0,
        status: 'pending',
        contestMonth: MONTH_KEY,
        createdAt: new Date().toISOString()
      };
      entries.unshift(entry);
      localStorage.setItem('boriku_user_entries', JSON.stringify(entries));
      return entry;
    },

    getUserSubmissions() {
      try { return JSON.parse(localStorage.getItem('boriku_user_entries')) || []; }
      catch (e) { return []; }
    },

    /* supabase.from('contest_votes').insert / delete */
    toggleVote(entryId) {
      if (!BORIKU_AUTH.isLoggedIn()) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return { voted: false, count: 0 };
      }
      const counts  = _getVoteCounts();
      const hasVoted = BORIKU_AUTH.hasVoted(entryId);
      const entry = MOCK_ENTRIES.find(e => e.id === entryId);
      const base  = entry ? entry.votes : 0;

      if (hasVoted) {
        BORIKU_AUTH.removeVote(entryId);
        counts[entryId] = Math.max(0, (counts[entryId] || base) - 1);
      } else {
        BORIKU_AUTH.castVote(entryId);
        counts[entryId] = (counts[entryId] || base) + 1;
      }
      _saveVoteCounts(counts);
      return { voted: !hasVoted, count: counts[entryId] };
    },

    /* Countdown timer string */
    getCountdown() {
      const diff = MONTH_END - new Date();
      if (diff <= 0) return 'Voting Closed';
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      return `${d}d ${h}h ${m}m`;
    },

    startCountdownTimer(elementId) {
      const el = document.getElementById(elementId);
      if (!el) return;
      const tick = () => { el.textContent = this.getCountdown(); };
      tick();
      return setInterval(tick, 60000);
    }
  };
})();
