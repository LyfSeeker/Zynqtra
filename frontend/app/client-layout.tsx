"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { WalletProvider, useWallet } from "@/contexts/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import { ProfileSetupModal } from "@/components/profile-setup-modal"

function ProfileSetupWrapper() {
  const { showProfileSetup, setShowProfileSetup } = useWallet()

  return <ProfileSetupModal isOpen={showProfileSetup} onClose={() => setShowProfileSetup(false)} />
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <WalletProvider>
      <Suspense fallback={null}>{children}</Suspense>
      <ProfileSetupWrapper />
      <Toaster />
      <Analytics />
    </WalletProvider>
  )
}
