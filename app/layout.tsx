import type { Metadata } from "next"
import localFont from "next/font/local"
import { cn } from "@/app/lib/utils"
import "./globals.css"
import LayoutProvider from "./providers/LayoutProvider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://trexgame.com'),
  title: {
    default: "TrexGame - Web3 Gaming Reimagined",
    template: "%s | TrexGame"
  },
  description: "Join the thrilling adventure of endless running and NFT evolution in TrexGame.",
  keywords: ["web3 game", "NFT game", "blockchain gaming", "play to earn", "crypto gaming"],
  authors: [{ name: "TrexGame Team" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trexgame.com',
    title: 'TrexGame - Web3 Gaming Reimagined',
    description: 'Join the thrilling adventure of endless running and NFT evolution in TrexGame.',
    siteName: 'TrexGame',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrexGame - Web3 Gaming Reimagined',
    description: 'Join the thrilling adventure of endless running and NFT evolution in TrexGame.',
    creator: '@trexgame',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        'scroll-smooth',
        'selection:bg-orange-500/20 selection:text-orange-500'
      )}
    >
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'font-sans antialiased',
          'min-h-screen',
          'relative',
          'bg-background text-foreground'
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <LayoutProvider>{children}</LayoutProvider>
          </div>
        </div>
      </body>
    </html>
  )
}