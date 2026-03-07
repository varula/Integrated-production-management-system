import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FactoryProvider } from '@/lib/factory-context'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FactoryTrack Pro — Denim Production Management',
  description: 'Integrated denim pant production management system for smart garment factories',
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
        </FactoryProvider>
      </body>
    </html>
  )
}
