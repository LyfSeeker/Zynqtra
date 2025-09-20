"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, Brain, MapPin, Trophy, Coins, Play } from "lucide-react"
import { useState } from "react"

export default function MiniGamesPage() {
  const [userPoints, setUserPoints] = useState(275)

  const games = [
    {
      id: 1,
      title: "Icebreaker Bingo",
      description: "Find people who match the bingo squares",
      players: "1-8 players",
      duration: "10 min",
      points: 30,
      nftReward: "Social Butterfly",
      icon: Users,
      status: "available",
    },
    {
      id: 2,
      title: "Industry Trivia",
      description: "Test your knowledge in tech and Web3",
      players: "2-6 players",
      duration: "15 min",
      points: 50,
      nftReward: "Knowledge Master",
      icon: Brain,
      status: "available",
    },
    {
      id: 3,
      title: "Networking Treasure Hunt",
      description: "Find hidden QR codes around the venue",
      players: "Solo or team",
      duration: "20 min",
      points: 75,
      nftReward: "Explorer",
      icon: MapPin,
      status: "active",
    },
    {
      id: 4,
      title: "Speed Networking Challenge",
      description: "Meet as many people as possible in 5 minutes",
      players: "All attendees",
      duration: "5 min",
      points: 40,
      nftReward: "Speed Connector",
      icon: Trophy,
      status: "coming-soon",
    },
  ]

  const handlePlayGame = (gameId: number) => {
    console.log("[v0] Starting game:", gameId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-400"
      case "active":
        return "bg-accent/20 text-accent"
      case "coming-soon":
        return "bg-muted/20 text-muted-foreground"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 glow-text">Mini Games & Rewards</h1>
            <p className="text-lg text-muted-foreground">
              Play networking games, earn points, and unlock exclusive NFT badges
            </p>
          </div>

          {/* Points & Active Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="glassmorphism bg-card/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Your Points</h2>
                  <div className="flex items-center">
                    <Coins className="w-6 h-6 mr-2 text-accent" />
                    <span className="text-2xl font-bold text-accent glow-text">{userPoints}</span>
                  </div>
                </div>
                <Gamepad2 className="w-12 h-12 text-accent/50" />
              </div>
            </Card>

            <Card className="glassmorphism bg-card/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Active Games</h2>
                  <div className="text-2xl font-bold text-accent">1</div>
                  <div className="text-sm text-muted-foreground">Treasure Hunt in progress</div>
                </div>
                <Trophy className="w-12 h-12 text-accent/50" />
              </div>
            </Card>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {games.map((game) => (
              <Card key={game.id} className="glassmorphism bg-card/30 p-6 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-accent/20">
                      <game.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{game.title}</h3>
                      <Badge className={getStatusColor(game.status)}>{game.status.replace("-", " ")}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{game.description}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players:</span>
                    <span>{game.players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{game.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points:</span>
                    <span className="text-accent font-semibold">{game.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NFT Reward:</span>
                    <span className="text-accent">{game.nftReward}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePlayGame(game.id)}
                  disabled={game.status === "coming-soon"}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {game.status === "active"
                    ? "Continue Game"
                    : game.status === "coming-soon"
                      ? "Coming Soon"
                      : "Play Game"}
                </Button>
              </Card>
            ))}
          </div>

          {/* NFT Badges Collection */}
          <Card className="glassmorphism bg-card/30 p-6">
            <h2 className="text-xl font-semibold mb-6 text-accent">Your NFT Badge Collection</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { emoji: "🏆", name: "Event Champion", earned: true },
                { emoji: "🤝", name: "Super Connector", earned: true },
                { emoji: "🧠", name: "Knowledge Master", earned: false },
                { emoji: "🗺️", name: "Explorer", earned: true },
                { emoji: "⚡", name: "Speed Connector", earned: false },
                { emoji: "🎯", name: "Challenge Master", earned: false },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`text-center p-4 glassmorphism rounded-lg transition-all duration-300 ${
                    badge.earned ? "bg-accent/20 border-accent/40" : "bg-background/30 opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <div className="text-xs font-medium">{badge.name}</div>
                  {badge.earned && <div className="text-xs text-green-400 mt-1">✓ Earned</div>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
