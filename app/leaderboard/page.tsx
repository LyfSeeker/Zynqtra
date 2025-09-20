"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SocialShare } from "@/components/social-share"
import { Trophy, Medal, Award, Coins, TrendingUp, Share2 } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"

export default function LeaderboardPage() {
  const [showShare, setShowShare] = useState(false)
  const { userProfile } = useWallet()

  const leaderboard = [
    {
      rank: 1,
      name: "Alex Chen",
      points: 1250,
      badges: 8,
      connections: 45,
      avatar: "/diverse-professional-woman.png",
      trend: "up",
    },
    {
      rank: 2,
      name: "Sarah Johnson",
      points: 1180,
      badges: 7,
      connections: 38,
      avatar: "/professional-woman-designer.png",
      trend: "up",
    },
    {
      rank: 3,
      name: "Mike Rodriguez",
      points: 1050,
      badges: 6,
      connections: 42,
      avatar: "/professional-man.png",
      trend: "down",
    },
    {
      rank: 4,
      name: userProfile?.name || "Emily Davis",
      points: userProfile?.totalPoints || 980,
      badges: 5,
      connections: 35,
      avatar: "/diverse-professional-woman.png",
      trend: "up",
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "David Kim",
      points: 920,
      badges: 5,
      connections: 29,
      avatar: "/professional-man.png",
      trend: "same",
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">#{rank}</div>
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const currentUserRank = leaderboard.find((user) => user.isCurrentUser)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground glow-text">Global Leaderboard</h1>
              <Button
                variant="outline"
                onClick={() => setShowShare(!showShare)}
                className="glassmorphism bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <p className="text-lg text-muted-foreground">
              See who's leading the global networking game across all events
            </p>
          </div>

          {showShare && (
            <div className="mb-8">
              <SocialShare
                title="Check out the ZYNQTRA Leaderboard!"
                description="See who's dominating the Web3 networking scene. Join the gamified networking revolution and climb the ranks!"
                hashtags={["Web3Networking", "ZYNQTRA", "Leaderboard", "Blockchain", "DeFi"]}
              />
            </div>
          )}

          {currentUserRank && (
            <Card className="glassmorphism bg-accent/10 border-accent/40 p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">{getRankIcon(currentUserRank.rank)}</div>
                  <div>
                    <div className="font-semibold text-accent">Your Current Position</div>
                    <div className="text-sm text-muted-foreground">
                      Rank #{currentUserRank.rank} with {currentUserRank.points} points
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glassmorphism bg-transparent"
                  onClick={() => {
                    const shareText = `🏆 I'm ranked #${currentUserRank.rank} on the ZYNQTRA leaderboard with ${currentUserRank.points} points! Join the Web3 networking revolution! #Web3Networking #ZYNQTRA`
                    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
                    window.open(shareUrl, "_blank")
                  }}
                >
                  Share My Rank
                </Button>
              </div>
            </Card>
          )}

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {leaderboard.slice(0, 3).map((user, index) => (
              <Card
                key={user.rank}
                className={`glassmorphism p-6 text-center ${
                  user.rank === 1 ? "bg-accent/20 border-accent/40" : "bg-card/30"
                } ${index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}`}
              >
                <div className="mb-4">{getRankIcon(user.rank)}</div>
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <Coins className="w-4 h-4 mr-1 text-accent" />
                  <span className="text-xl font-bold text-accent">{user.points}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.badges} badges • {user.connections} connections
                </div>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card className="glassmorphism bg-card/30">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-accent">Full Rankings</h2>
              <div className="space-y-4">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 glassmorphism rounded-lg hover:bg-background/50 transition-colors ${
                      user.isCurrentUser ? "bg-accent/10 border border-accent/40" : "bg-background/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className={`font-semibold ${user.isCurrentUser ? "text-accent" : ""}`}>
                          {user.name} {user.isCurrentUser && "(You)"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.badges} badges • {user.connections} connections
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center">
                          <Coins className="w-4 h-4 mr-1 text-accent" />
                          <span className="font-bold text-accent">{user.points}</span>
                        </div>
                      </div>
                      <div className={`flex items-center ${getTrendColor(user.trend)}`}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="glassmorphism bg-card/30 p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-accent">1,250</div>
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </Card>
            <Card className="glassmorphism bg-card/30 p-6 text-center">
              <Medal className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-accent">45</div>
              <div className="text-sm text-muted-foreground">Most Connections</div>
            </Card>
            <Card className="glassmorphism bg-card/30 p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-accent">8</div>
              <div className="text-sm text-muted-foreground">Most Badges</div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
