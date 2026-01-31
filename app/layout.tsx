import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Noto_Sans_Ethiopic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/language-context'
import { PageTransitionWrapper } from '@/components/page-transition-wrapper'
import { ScrollToTop } from '@/components/scroll-to-top'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"] });
const _notoEthiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'Kefko Travel Agency - Your Next Trip Starts Here',
  description: 'Kefko Travel Agency offers expert travel services including flight booking, hotel reservations, tour packages, visa assistance, and travel insurance. Based in Addis Ababa, Ethiopia.',
  keywords: ['travel agency', 'flights', 'hotels', 'tours', 'visa', 'Ethiopia', 'Addis Ababa', 'Dubai', 'travel packages'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
          <ScrollToTop />
        </LanguageProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
