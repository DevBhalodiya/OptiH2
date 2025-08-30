import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'OptiH2 - Green Hydrogen Infrastructure Optimization',
  description: 'Advanced platform for visualizing, optimizing, and managing hydrogen infrastructure networks. Accelerate the transition to sustainable energy with AI-powered optimization tools.',
  keywords: 'hydrogen, infrastructure, optimization, renewable energy, sustainability, green energy, AI optimization',
  authors: [{ name: 'OptiH2 Team' }],
  creator: 'OptiH2',
  publisher: 'OptiH2',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://optih2.com'),
  openGraph: {
    title: 'OptiH2 - Green Hydrogen Infrastructure Optimization',
    description: 'Advanced platform for visualizing, optimizing, and managing hydrogen infrastructure networks.',
    url: 'https://optih2.com',
    siteName: 'OptiH2',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OptiH2 Platform Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OptiH2 - Green Hydrogen Infrastructure Optimization',
    description: 'Advanced platform for visualizing, optimizing, and managing hydrogen infrastructure networks.',
    images: ['/og-image.png'],
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
