import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ZYNQTRA - Web3 Networking Platform",
  description: "Connect, Build, and Grow in the Decentralized World with ZYNQTRA",
  keywords: ["web3", "networking", "blockchain", "events", "connections", "arbitrum"],
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
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1",
}