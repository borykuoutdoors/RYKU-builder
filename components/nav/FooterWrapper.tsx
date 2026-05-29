'use client'

import { usePathname } from 'next/navigation'
import SiteFooter from './SiteFooter'

const SUPPRESS_FOOTER = ['/build', '/builds', '/gear', '/installers', '/garage']

export default function FooterWrapper() {
  const pathname = usePathname()
  const hidden = SUPPRESS_FOOTER.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )
  if (hidden) return null
  return <SiteFooter />
}
