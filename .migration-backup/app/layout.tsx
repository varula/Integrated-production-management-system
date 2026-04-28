import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FactoryProvider } from '@/lib/factory-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SmartGarment - Apparel Production Management',
  description: 'End-to-end apparel production management system for smart garment factories',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <FactoryProvider>
          {children}
          <Analytics />
        </FactoryProvider>
      </body>
    </html>
  )
}
