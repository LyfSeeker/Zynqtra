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
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
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
