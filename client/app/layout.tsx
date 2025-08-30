import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'OptiH2 India - Green Hydrogen Infrastructure Optimization',
  description: 'Advanced platform for visualizing, optimizing, and managing hydrogen infrastructure networks across India. Accelerate the transition to sustainable energy with AI-powered optimization tools.',
  keywords: 'hydrogen, infrastructure, optimization, renewable energy, sustainability, green energy, AI optimization, India, National Hydrogen Mission',
  authors: [{ name: 'OptiH2 India Team' }],
  creator: 'OptiH2 India',
  publisher: 'OptiH2 India',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://optih2india.com'),
  openGraph: {
    title: 'OptiH2 India - Green Hydrogen Infrastructure Optimization',
    description: 'Advanced platform for visualizing, optimizing, and managing hydrogen infrastructure networks across India.',
    url: 'https://optih2india.com',
    siteName: 'OptiH2 India',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OptiH2 India Platform Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OptiH2 India - Green Hydrogen Infrastructure Optimization',
    description: 'Advanced platform for visualizing, optimizing, and managing hydrogen infrastructure networks across India.',
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
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
