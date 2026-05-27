import BuildPlanner from '@/components/build/BuildPlanner'

export default function BuildPage() {
  return (
    <div style={{ height: 'calc(100dvh - var(--nav-h) - var(--status-h))', overflow: 'hidden' }}>
      <BuildPlanner />
    </div>
  )
}
