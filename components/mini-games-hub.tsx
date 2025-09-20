"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Trophy, Star, Zap, Target, Users, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Game {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  points: number
  difficulty: "Easy" | "Medium" | "Hard"
  players: number
  duration: string
}

interface Achievement {
  id: string
  title: string
  description: string
  points: number
  unlocked: boolean
}

export function MiniGamesHub() {
  const [userPoints, setUserPoints] = useState(1250)
  const [userLevel, setUserLevel] = useState(5)
  const [levelProgress, setLevelProgress] = useState(75)
  const { toast } = useToast()

  const games: Game[] = [
    {
      id: "networking-bingo",
      title: "Networking Bingo",
      description: "Complete networking challenges to fill your bingo card",
      icon: Target,
      points: 50,
      difficulty: "Easy",
      players: 1,
      duration: "10 min",
    },
    {
      id: "trivia-challenge",
      title: "Industry Trivia",
      description: "Test your knowledge in tech, business, and innovation",
      icon: Star,
      points: 100,
      difficulty: "Medium",
      players: 4,
      duration: "15 min",
    },
    {
      id: "connection-race",
      title: "Connection Race",
      description: "Race against time to make meaningful connections",
      icon: Zap,
      points: 150,
      difficulty: "Hard",
      players: 8,
      duration: "20 min",
    },
  ]

  const achievements: Achievement[] = [
    {
      id: "first-connection",
      title: "First Connection",
      description: "Make your first connection at an event",
      points: 25,
      unlocked: true,
    },
    {
      id: "social-butterfly",
      title: "Social Butterfly",
      description: "Connect with 10 people in one event",
      points: 100,
      unlocked: true,
    },
    {
      id: "game-master",
      title: "Game Master",
      description: "Win 5 mini-games",
      points: 200,
      unlocked: false,
    },
    {
      id: "trivia-champion",
      title: "Trivia Champion",
      description: "Score 100% on an industry trivia game",
      points: 150,
      unlocked: false,
    },
  ]

  const handlePlayGame = (game: Game) => {
    const pointsEarned = Math.floor(Math.random() * game.points) + 20
    setUserPoints((prev) => prev + pointsEarned)

    toast({
      title: "Game Completed! 🎉",
      description: `You earned ${pointsEarned} points playing ${game.title}`,
    })

    if (Math.random() > 0.7) {
      setLevelProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          setUserLevel((level) => level + 1)
          toast({
            title: "Level Up! 🚀",
            description: `Congratulations! You've reached level ${userLevel + 1}`,
          })
          return 0
        }
        return newProgress
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "Hard":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Stats */}
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-accent" />
                Mini Games Hub
              </h1>
              <p className="text-muted-foreground">Earn points and unlock achievements through fun challenges</p>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-accent">{userPoints}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">Level {userLevel}</p>
                <Progress value={levelProgress} className="w-20 mt-1" />
              </div>
            </div>
          </div>
        </Card>

        {/* Available Games */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Available Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Card
                key={game.id}
                className="glassmorphism bg-card/30 p-6 border-accent/20 hover:bg-card/50 transition-colors"
              >
                <div className="text-center mb-4">
                  <div className="p-3 rounded-full bg-accent/20 inline-block mb-3">
                    <game.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Reward:</span>
                    <span className="text-accent font-medium">{game.points} points</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {game.players}
                      <span>•</span>
                      {game.duration}
                    </div>
                  </div>

                  <Button onClick={() => handlePlayGame(game)} className="w-full bg-accent hover:bg-accent/90">
                    Play Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked ? "bg-accent/10 border-accent/20" : "bg-muted/10 border-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{achievement.title}</h3>
                  {achievement.unlocked ? (
                    <Trophy className="w-5 h-5 text-accent" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-medium">{achievement.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard Preview */}
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <h2 className="text-xl font-semibold text-foreground mb-4">Event Leaderboard</h2>
          <div className="space-y-3">
            {[
              { rank: 1, name: "You", points: userPoints, isUser: true },
              { rank: 2, name: "Sarah Chen", points: 1180, isUser: false },
              { rank: 3, name: "Mike Johnson", points: 1050, isUser: false },
              { rank: 4, name: "Lisa Wang", points: 980, isUser: false },
            ].map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.isUser ? "bg-accent/20" : "bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      player.rank === 1
                        ? "bg-yellow-500 text-black"
                        : player.rank === 2
                          ? "bg-gray-400 text-white"
                          : player.rank === 3
                            ? "bg-orange-600 text-white"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {player.rank}
                  </div>
                  <span className={`font-medium ${player.isUser ? "text-accent" : "text-foreground"}`}>
                    {player.name}
                  </span>
                </div>
                <span className="text-accent font-medium">{player.points} pts</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
