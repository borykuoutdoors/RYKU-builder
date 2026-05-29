import type { Metadata, Viewport } from 'next'
import { Saira_Condensed, Chakra_Petch, Stardos_Stencil, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/nav/Navbar'
import StatusBar from '@/components/nav/StatusBar'
import SiteFooter from '@/components/nav/SiteFooter'
import BotWidget from '@/components/bot/BotWidget'

const saira = Saira_Condensed({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const chakra = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-tactical',
  display: 'swap',
})

const stardos = Stardos_Stencil({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-stencil',
  display: 'swap',
})

const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  weight: ['400', '500', '700'],
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
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${saira.variable} ${chakra.variable} ${stardos.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-h)' }}>
          {children}
        </main>
        <SiteFooter />
        <StatusBar />
        <BotWidget />
      </body>
    </html>
  )
}

