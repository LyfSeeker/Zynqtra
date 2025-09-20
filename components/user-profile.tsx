"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QrCode, Camera, Users, Gamepad2, Settings, Share2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useWallet } from "@/contexts/wallet-context"
import Link from "next/link"

export function UserProfile() {
  const { userProfile } = useWallet()
  const [qrData, setQrData] = useState("")

  useEffect(() => {
    if (userProfile) {
      const qrPayload = {
        userId: userProfile.walletAddress,
        name: userProfile.name,
        interests: userProfile.interests,
        timestamp: Date.now(),
      }
      setQrData(JSON.stringify(qrPayload))
    }
  }, [userProfile])

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="glassmorphism bg-card/30 p-8 text-center">
          <p className="text-muted-foreground">Please connect your wallet to view your profile.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/professional-avatar.png" alt={userProfile.name} />
              <AvatarFallback>
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-foreground mb-2">{userProfile.name}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {userProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="bg-accent/20 text-accent">
                    {interest}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-6 justify-center md:justify-start text-sm text-muted-foreground">
                <span>{userProfile.totalPoints} Z Points</span>
                <span>{userProfile.connectionsCount || 0} Connections</span>
                <span>{userProfile.eventsAttended} Events</span>
              </div>
            </div>

            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="glassmorphism bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </Card>

        {/* QR Code Section */}
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5" />
              Your Connection QR Code
            </h2>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCodeSVG value={qrData} size={200} level="M" includeMargin={true} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share this QR code to instantly connect with other attendees
            </p>
            <Button variant="outline" className="glassmorphism bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share QR Code
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/qr-scanner">
            <Card className="glassmorphism bg-card/30 p-6 border-accent/20 hover:bg-card/50 transition-colors cursor-pointer">
              <div className="text-center">
                <Camera className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Open Camera</h3>
                <p className="text-sm text-muted-foreground">Scan QR codes to connect</p>
              </div>
            </Card>
          </Link>

          <Link href="/interest-matching">
            <Card className="glassmorphism bg-card/30 p-6 border-accent/20 hover:bg-card/50 transition-colors cursor-pointer">
              <div className="text-center">
                <Users className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Find Matches</h3>
                <p className="text-sm text-muted-foreground">Connect with similar interests</p>
              </div>
            </Card>
          </Link>

          <Link href="/mini-games">
            <Card className="glassmorphism bg-card/30 p-6 border-accent/20 hover:bg-card/50 transition-colors cursor-pointer">
              <div className="text-center">
                <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Play Games</h3>
                <p className="text-sm text-muted-foreground">Earn Z points and rewards</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recommended Connections */}
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recommended Connections</h2>
          <div className="space-y-4">
            {[
              { name: "Sarah Kim", interests: ["Web3", "AI"], matchScore: 85 },
              { name: "Mike Johnson", interests: ["Startups", "Gaming"], matchScore: 78 },
              { name: "Lisa Wang", interests: ["AI", "Music"], matchScore: 72 },
            ].map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/professional-woman-tech.jpg`} />
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{person.name}</p>
                    <div className="flex gap-1">
                      {person.interests.map((interest, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-accent">{person.matchScore}% match</p>
                  <Button size="sm" variant="outline" className="mt-1 bg-transparent">
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
