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

export default function AboutPage() {
  return (
    <div>

      {/* ── HERO ── */}
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,85,31,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,.022) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40%', height: '60%', background: 'radial-gradient(ellipse at bottom left, rgba(255,85,31,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: -80, right: -80, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,255,255,0.025) 0%, transparent 65%)', pointerEvents: 'none' }} />

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
          <Link href="/contact" className="btn btn-ghost">Get in Touch</Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '24px 16px', background: 'rgba(8,10,20,0.72)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: 'var(--orange)', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section style={{ padding: '100px 24px 120px' }}>
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
              <div key={m.name} style={{ background: 'rgba(8,10,20,0.72)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 24, textAlign: 'center', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{m.emoji}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--text-3)', textTransform: 'uppercase' }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
