import type { Metadata } from 'next'
import { Bebas_Neue, Rajdhani, Share_Tech_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/nav/Navbar'
import StatusBar from '@/components/nav/StatusBar'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BŌRYKU — Control the Chaos',
  description: 'Premium overland vehicle build platform. Configure, plan, and execute your tactical overland build.',
  keywords: ['overland', 'off-road', 'build planner', 'tactical', 'vehicle build', '4x4'],
  openGraph: {
    title: 'BŌRYKU — Control the Chaos',
    description: 'Premium overland vehicle build platform.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <body>
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-h)', paddingBottom: 'var(--status-h)' }}>
          {children}
        </main>
        <StatusBar />
      </body>
    </html>
  )
}
