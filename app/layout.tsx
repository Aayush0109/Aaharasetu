import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'AharaSetu - Ayurvedic Diet Management',
  description: 'Bridge of Nutrition: Connecting traditional Ayurvedic dietary principles with modern nutritional science for hospitals and practitioners.',
}

export const viewport: Viewport = {
  themeColor: '#2E8B57',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
