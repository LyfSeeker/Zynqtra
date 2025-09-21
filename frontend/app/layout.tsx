import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Rajdhani, Orbitron, JetBrains_Mono } from "next/font/google"
import ClientLayout from "./client-layout"
import "./globals.css"

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-orbitron",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

export const metadata: Metadata = {
  title: "ZYNQTRA - Web3 Networking Platform",
  description: "Connect, Build, and Grow in the Decentralized World with ZYNQTRA. Join events, earn badges, and build meaningful connections in the Web3 ecosystem.",
  keywords: ["web3", "networking", "blockchain", "events", "connections", "arbitrum", "defi", "nft"],
  authors: [{ name: "ZYNQTRA Team" }],
  icons: {
    icon: [
      { url: "/zynqtralogobg.png", sizes: "32x32", type: "image/png" },
      { url: "/zynqtralogobg.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/zynqtralogobg.png",
    apple: [
      { url: "/zynqtralogobg.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "ZYNQTRA - Web3 Networking Platform",
    description: "Connect, Build, and Grow in the Decentralized World",
    url: "https://zynqtra.com",
    siteName: "ZYNQTRA",
    images: [
      {
        url: "/zynqtralogobg.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYNQTRA - Web3 Networking Platform",
    description: "Connect, Build, and Grow in the Decentralized World",
    images: ["/zynqtralogobg.png"],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${interSans.variable} ${jetBrainsMono.variable} ${orbitron.variable} ${inter.variable} ${poppins.variable} ${rajdhani.variable}`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
