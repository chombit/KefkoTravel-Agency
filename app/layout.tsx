import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Noto_Sans_Ethiopic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/language-context'
import { PageTransitionWrapper } from '@/components/page-transition-wrapper'
import { ScrollToTop } from '@/components/scroll-to-top'
import { StructuredData } from '@/components/structured-data'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"], 
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  display: 'swap',
  variable: '--font-playfair'
});

const notoEthiopic = Noto_Sans_Ethiopic({ 
  subsets: ["ethiopic"], 
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  variable: '--font-noto-ethiopic'
});

export const metadata: Metadata = {
  title: {
    default: 'Kefko Travel Agency - Your Next Trip Starts Here',
    template: '%s | Kefko Travel Agency'
  },
  description: 'Kefko Travel Agency offers expert travel services including flight booking, hotel reservations, tour packages, visa assistance, and travel insurance. Based in Addis Ababa, Ethiopia.',
  keywords: ['travel agency', 'flights', 'hotels', 'tours', 'visa', 'Ethiopia', 'Addis Ababa', 'Dubai', 'travel packages', 'holiday packages', 'business travel'],
  authors: [{ name: 'Kefko Travel Agency' }],
  creator: 'Kefko Travel Agency',
  publisher: 'Kefko Travel Agency',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kefkotravelagency.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'am-ET': '/am',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kefkotravelagency.com',
    title: 'Kefko Travel Agency - Your Next Trip Starts Here',
    description: 'Expert travel services including flight booking, hotel reservations, tour packages, visa assistance, and travel insurance. Based in Addis Ababa, Ethiopia.',
    siteName: 'Kefko Travel Agency',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kefko Travel Agency - Your Next Trip Starts Here',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kefko Travel Agency - Your Next Trip Starts Here',
    description: 'Expert travel services including flight booking, hotel reservations, tour packages, visa assistance, and travel insurance.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${notoEthiopic.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <StructuredData />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
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
