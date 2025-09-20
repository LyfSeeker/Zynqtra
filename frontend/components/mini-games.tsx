"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gamepad2, Users, Brain, MapPin, Trophy, Star, Play } from "lucide-react"
import { useState } from "react"

interface MiniGame {
  id: string
  title: string
  description: string
  icon: any
  players: string
  duration: string
  points: number
  nftReward: string
  difficulty: "Easy" | "Medium" | "Hard"
  status: "available" | "playing" | "completed"
}

export function MiniGames() {
  const [games] = useState<MiniGame[]>([
    {
      id: "1",
      title: "Icebreaker Bingo",
      description: "Find people who match the descriptions on your bingo card",
      icon: Users,
      players: "2-20",
      duration: "15 min",
      points: 100,
      nftReward: "Social Butterfly Badge",
      difficulty: "Easy",
      status: "available",
    },
    {
      id: "2",
      title: "Industry Trivia",
      description: "Test your knowledge with industry-specific questions",
      icon: Brain,
      players: "1-10",
      duration: "10 min",
      points: 150,
      nftReward: "Knowledge Master Badge",
      difficulty: "Medium",
      status: "playing",
    },
    {
      id: "3",
      title: "Networking Treasure Hunt",
      description: "Complete location-based challenges around the venue",
      icon: MapPin,
      players: "1-50",
      duration: "30 min",
      points: 250,
      nftReward: "Explorer Badge",
      difficulty: "Hard",
      status: "completed",
    },
  ])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "playing":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getButtonText = (status: string) => {
    switch (status) {
      case "available":
        return "Play Now"
      case "playing":
        return "Continue"
      case "completed":
        return "Play Again"
      default:
        return "Play"
    }
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 glow-text">
            Networking Mini-Games
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Break the ice and build connections through fun, interactive games that reward participation
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Card
              key={game.id}
              className="glassmorphism bg-card/50 border-border/30 hover:border-border/60 transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-6">
                {/* Game Icon & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <game.icon className="w-8 h-8 text-accent" />
                  </div>
                  <Badge className={`text-xs ${getStatusColor(game.status)}`}>
                    {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                  </Badge>
                </div>

                {/* Game Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">{game.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{game.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{game.duration}</span>
                    </div>
                  </div>

                  <Badge className={`text-xs ${getDifficultyColor(game.difficulty)} mb-3`}>{game.difficulty}</Badge>
                </div>

                {/* Rewards */}
                <div className="mb-6 p-3 bg-muted/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">Rewards</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Points:</span>
                    <span className="text-accent font-semibold">{game.points}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">NFT Badge:</span>
                    <span className="text-accent font-semibold text-xs">{game.nftReward}</span>
                  </div>
                </div>

                {/* Play Button */}
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  disabled={game.status === "playing"}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {getButtonText(game.status)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glassmorphism bg-card/30 p-6 text-center">
            <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">15</div>
            <div className="text-muted-foreground">Games Played</div>
          </Card>

          <Card className="glassmorphism bg-card/30 p-6 text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">1,250</div>
            <div className="text-muted-foreground">Points Earned</div>
          </Card>

          <Card className="glassmorphism bg-card/30 p-6 text-center">
            <Star className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">8</div>
            <div className="text-muted-foreground">NFT Badges</div>
          </Card>

          <Card className="glassmorphism bg-card/30 p-6 text-center">
            <Users className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">42</div>
            <div className="text-muted-foreground">Players Met</div>
          </Card>
        </div>
      </div>
    </section>
  )
}
