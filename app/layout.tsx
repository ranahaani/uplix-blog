import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Uplix Blog | AI-Powered Insights',
  description: 'Discover cutting-edge articles about AI, technology, and digital transformation powered by Uplix',
  keywords: ['AI', 'technology', 'blog', 'Uplix', 'digital transformation'],
  authors: [{ name: 'Uplix' }],
  openGraph: {
    title: 'Uplix Blog | AI-Powered Insights',
    description: 'Discover cutting-edge articles about AI, technology, and digital transformation',
    siteName: 'Uplix Blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uplix Blog | AI-Powered Insights',
    description: 'Discover cutting-edge articles about AI, technology, and digital transformation',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
