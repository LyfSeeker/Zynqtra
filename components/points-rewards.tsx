"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Gift, Zap, Crown, Award, Coins } from "lucide-react"
import { useState } from "react"

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  type: "nft" | "perk" | "access"
  icon: any
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  claimed: boolean
}

export function PointsRewards() {
  const [currentPoints, setCurrentPoints] = useState(1250)
  const [level, setLevel] = useState(5)
  const [nextLevelPoints, setNextLevelPoints] = useState(1500)

  const [rewards] = useState<Reward[]>([
    {
      id: "1",
      title: "Networking Ninja Badge",
      description: "Exclusive NFT badge for active networkers",
      cost: 500,
      type: "nft",
      icon: Star,
      rarity: "Common",
      claimed: true,
    },
    {
      id: "2",
      title: "VIP Lounge Access",
      description: "Access to exclusive VIP networking area",
      cost: 1000,
      type: "access",
      icon: Crown,
      rarity: "Rare",
      claimed: false,
    },
    {
      id: "3",
      title: "Premium Profile Boost",
      description: "24h featured profile visibility",
      cost: 750,
      type: "perk",
      icon: Zap,
      rarity: "Common",
      claimed: false,
    },
    {
      id: "4",
      title: "Event Legend NFT",
      description: "Ultra-rare commemorative NFT",
      cost: 2500,
      type: "nft",
      icon: Trophy,
      rarity: "Legendary",
      claimed: false,
    },
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "Rare":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Epic":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Legendary":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nft":
        return Award
      case "perk":
        return Gift
      case "access":
        return Crown
      default:
        return Star
    }
  }

  const progressPercentage = ((currentPoints % 500) / 500) * 100

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 glow-text">
            Z Points & Rewards
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Earn Z points through networking activities and redeem them for exclusive rewards
          </p>
        </div>

        {/* Points Dashboard */}
        <div className="mb-16">
          <Card className="glassmorphism bg-card/50 border-border/30 p-8 max-w-2xl mx-auto">
            <CardContent className="p-0">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-8 h-8 text-accent" />
                  <span className="text-4xl font-bold text-accent glow-text">{currentPoints.toLocaleString()}</span>
                </div>
                <p className="text-muted-foreground">Total Z Points Earned</p>
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    <span className="text-lg font-semibold text-foreground">Level {level}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentPoints % 500}/{500} to Level {level + 1}
                  </span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-accent to-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">12</div>
                  <div className="text-xs text-muted-foreground">Rewards Claimed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">8</div>
                  <div className="text-xs text-muted-foreground">NFT Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">5</div>
                  <div className="text-xs text-muted-foreground">Current Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Store */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Rewards Store</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => {
              const TypeIcon = getTypeIcon(reward.type)
              const canAfford = currentPoints >= reward.cost

              return (
                <Card
                  key={reward.id}
                  className={`glassmorphism bg-card/50 border-border/30 hover:border-border/60 transition-all duration-300 ${
                    reward.claimed ? "opacity-60" : "hover:scale-105"
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Reward Icon & Rarity */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                        <reward.icon className="w-6 h-6 text-accent" />
                      </div>
                      <Badge className={`text-xs ${getRarityColor(reward.rarity)}`}>{reward.rarity}</Badge>
                    </div>

                    {/* Reward Info */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-foreground mb-2">{reward.title}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{reward.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <TypeIcon className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent capitalize">{reward.type}</span>
                      </div>
                    </div>

                    {/* Cost & Action */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cost:</span>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-accent" />
                          <span className="font-semibold text-accent">{reward.cost}</span>
                        </div>
                      </div>

                      <Button
                        className={`w-full ${
                          reward.claimed
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : canAfford
                              ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                              : "bg-muted/20 text-muted-foreground cursor-not-allowed"
                        }`}
                        disabled={reward.claimed || !canAfford}
                      >
                        {reward.claimed ? "Claimed" : canAfford ? "Claim Reward" : "Insufficient Points"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
