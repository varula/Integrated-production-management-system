import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FactoryProvider } from '@/lib/factory-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FactoryTrack Pro — Denim Production Management',
  description: 'Integrated production management system for denim pant factories under Armana Group',
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
