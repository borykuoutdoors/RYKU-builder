import Link from 'next/link'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

export const metadata = {
  title: 'About — BŌRYKU',
  description: 'The story behind the BŌRYKU platform. Built for serious overlanders.',
}

const STATS = [
  { value: '4,200+', label: 'Builds Configured' },
  { value: '55+',    label: 'Compatible Products' },
  { value: '10',     label: 'Vehicle Platforms' },
  { value: '6',      label: 'Installer Partners' },
]

const TEAM = [
  { name: 'RYKU COMMAND', role: 'Platform Architecture', emoji: '⚙️' },
  { name: 'FIELD OPS',    role: 'Product Compatibility', emoji: '🔩' },
  { name: 'INTEL DIV.',   role: 'Build Intelligence',    emoji: '🧭' },
  { name: 'SUPPLY CHAIN', role: 'Gear Partnerships',     emoji: '📦' },
]

const PLAN_FREE = [
  '3 build configurations',
  '1 saved build',
  'Basic gear catalog',
  'Installer search',
  'Quote export (.txt)',
]

const PLAN_PRO = [
  'Unlimited builds',
  'Cloud build sync',
  'Advanced recommendations',
  'Full installer access',
  'Build export (PDF)',
  'Supply drop entries',
  'Priority support',
  'Build comparison',
  'Send-to-installer flow',
]

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--dark)' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,85,31,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,.022) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40%', height: '60%', background: 'radial-gradient(ellipse at bottom left, rgba(255,85,31,0.06) 0%, transparent 70%)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>THE PLATFORM</SectionEyebrow>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(3rem,7vw,6rem)', letterSpacing: '0.04em', lineHeight: 0.9, marginBottom: 24, marginTop: 12 }}>
            BUILT FOR THE<br />
            <span style={{ color: 'var(--orange)' }}>SERIOUS</span><br />
            OVERLANDER
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-2)', maxWidth: 540, lineHeight: 1.7, marginBottom: 40 }}>
            BŌRYKU is a precision overland build platform. No guesswork. No generic parts lists.
            Every product is compatibility-verified against your exact vehicle platform,
            with real installer connections and intelligent mission-based recommendations.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/build" className="btn btn-primary">Start Your Build</Link>
            <Link href="/contact" className="btn btn-ghost">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--carbon)', border: '1px solid var(--border)', borderRadius: 4 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: 'var(--orange)', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section style={{ padding: '100px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', alignItems: 'center' }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <SectionEyebrow>OUR MISSION</SectionEyebrow>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem,4vw,3.5rem)', letterSpacing: '0.04em', marginBottom: 20, marginTop: 12 }}>
              CONTROL<br />THE CHAOS
            </h2>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>
              Overland builds are complicated. Compatibility questions, installer sourcing,
              budget management, and gear selection all compound into a decision-making nightmare.
            </p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>
              BŌRYKU eliminates the noise. Our platform is built on a single philosophy:
              every overlander deserves an intelligently configured rig, built to their exact mission,
              without the chaos of fragmented research.
            </p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
              We call it <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>Build Intelligence</span> — not AI,
              not automation. Just a precision system built by overlanders, for overlanders.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TEAM.map(m => (
              <div key={m.name} style={{ background: 'var(--carbon)', border: '1px solid var(--border)', borderRadius: 4, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{m.emoji}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--text-3)', textTransform: 'uppercase' }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section style={{ padding: '100px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionEyebrow>MEMBERSHIP</SectionEyebrow>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.04em', marginTop: 12 }}>JOIN THE RYKU NETWORK</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FREE */}
            <div style={{ background: 'var(--carbon)', border: '1px solid var(--border)', borderRadius: 4, padding: 32 }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: 4 }}>FREE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--text)', marginBottom: 24 }}>$0<span style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {PLAN_FREE.map(f => (
                  <li key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#4ade80' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/build" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Get Started Free</Link>
            </div>

            {/* PRO */}
            <div style={{ background: 'var(--carbon)', border: '1px solid var(--orange)', borderRadius: 4, padding: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--orange)', border: '1px solid var(--border)', padding: '3px 8px', textTransform: 'uppercase' }}>COMING SOON</div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: 4, color: 'var(--orange)' }}>PRO</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--text)', marginBottom: 24 }}>$12<span style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {PLAN_PRO.map(f => (
                  <li key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--orange)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }} disabled>
                Upgrade to PRO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <SectionEyebrow>READY TO BUILD</SectionEyebrow>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.5rem,5vw,4rem)', letterSpacing: '0.04em', marginBottom: 20, marginTop: 12 }}>
            CONFIGURE YOUR<br />ULTIMATE RIG
          </h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 40 }}>
            10 vehicle platforms. 55+ compatibility-verified products. Real installer network.
            Your mission. Your build. Your control.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/build" className="btn btn-primary btn-lg">Start Build Now</Link>
            <Link href="/gear" className="btn btn-outline btn-lg">Browse Gear</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
