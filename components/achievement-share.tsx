"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Share2, Download } from "lucide-react"
import { SocialShare } from "./social-share"
import { useState } from "react"

interface Achievement {
  title: string
  description: string
  points: number
  badge: string
  date: string
}

interface AchievementShareProps {
  achievement: Achievement
  userProfile?: {
    name: string
    walletAddress: string
  }
}

export function AchievementShare({ achievement, userProfile }: AchievementShareProps) {
  const [showShare, setShowShare] = useState(false)

  const shareTitle = `🏆 Just earned "${achievement.title}" at ZYNQTRA!`
  const shareDescription = `I earned ${achievement.points} points and unlocked the ${achievement.badge} badge through Web3 networking. Join the gamified networking revolution!`
  const hashtags = ["Web3Networking", "ZYNQTRA", "Blockchain", "DeFi", "Arbitrum"]

  return (
    <Card className="glassmorphism bg-card/30 p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
          <Trophy className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Achievement Unlocked!</h2>
        <h3 className="text-xl font-semibold text-accent mb-2">{achievement.title}</h3>
        <p className="text-muted-foreground mb-4">{achievement.description}</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge className="bg-accent/20 text-accent">+{achievement.points} Points</Badge>
          <Badge className="bg-purple-500/20 text-purple-400">{achievement.badge} Badge</Badge>
        </div>
        {userProfile && (
          <p className="text-sm text-muted-foreground">
            Earned by {userProfile.name} • {achievement.date}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => setShowShare(!showShare)}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Achievement
        </Button>

        {showShare && (
          <SocialShare title={shareTitle} description={shareDescription} hashtags={hashtags} showCard={false} />
        )}

        <Button variant="outline" className="w-full glassmorphism bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Download Certificate
        </Button>
      </div>
    </Card>
  )
}
