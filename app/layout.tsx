import { Sora, DM_Sans } from 'next/font/google'
import './globals.css'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'
import Navbar from '@/components/Navbar'
import { PreorderProvider } from '@/context/PreorderContext'
import PreorderDrawer from '@/components/PreorderDrawer'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata = {
  title: 'MediSync — Future-ready health & safety',
  description:
    'Smart medication reminders, real-time fall detection, and family sharing — all in one unified health platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        <PreorderProvider>
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          {children}
          <PreorderDrawer />
        </PreorderProvider>
      </body>
    </html>
  )
}
