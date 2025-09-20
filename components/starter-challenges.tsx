"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, QrCode, MessageCircle, Trophy, Star, Target } from "lucide-react"
import { useState } from "react"

interface Challenge {
  id: string
  title: string
  description: string
  icon: any
  progress: number
  maxProgress: number
  points: number
  completed: boolean
  difficulty: "Easy" | "Medium" | "Hard"
}

export function StarterChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Meet 3 New People",
      description: "Start conversations with 3 different attendees",
      icon: Users,
      progress: 2,
      maxProgress: 3,
      points: 50,
      completed: false,
      difficulty: "Easy",
    },
    {
      id: "2",
      title: "Scan 5 QR Codes",
      description: "Connect with 5 people using QR code scanning",
      icon: QrCode,
      progress: 3,
      maxProgress: 5,
      points: 75,
      completed: false,
      difficulty: "Easy",
    },
    {
      id: "3",
      title: "Join a Group Discussion",
      description: "Participate in at least one group conversation",
      icon: MessageCircle,
      progress: 1,
      maxProgress: 1,
      points: 100,
      completed: true,
      difficulty: "Medium",
    },
    {
      id: "4",
      title: "Network Navigator",
      description: "Connect with people from 3 different industries",
      icon: Target,
      progress: 1,
      maxProgress: 3,
      points: 150,
      completed: false,
      difficulty: "Hard",
    },
  ])

  const totalPoints = challenges.reduce((sum, challenge) => sum + (challenge.completed ? challenge.points : 0), 0)

  const completedChallenges = challenges.filter((c) => c.completed).length

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

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 glow-text">
            Starter Challenges
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Complete challenges to earn points, unlock rewards, and level up your networking game
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glassmorphism bg-card/50 border-border/30 p-6 text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">{totalPoints}</div>
            <div className="text-muted-foreground">Total Points</div>
          </Card>

          <Card className="glassmorphism bg-card/50 border-border/30 p-6 text-center">
            <Star className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">{completedChallenges}</div>
            <div className="text-muted-foreground">Completed</div>
          </Card>

          <Card className="glassmorphism bg-card/50 border-border/30 p-6 text-center">
            <Target className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent glow-text">{challenges.length - completedChallenges}</div>
            <div className="text-muted-foreground">Remaining</div>
          </Card>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className={`glassmorphism bg-card/50 border-border/30 hover:border-border/60 transition-all duration-300 ${
                challenge.completed ? "ring-2 ring-accent/50" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        challenge.completed ? "bg-accent/20" : "bg-muted/20"
                      }`}
                    >
                      <challenge.icon
                        className={`w-6 h-6 ${challenge.completed ? "text-accent" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                      <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent">{challenge.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">{challenge.description}</p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {challenge.progress}/{challenge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        challenge.completed ? "bg-accent" : "bg-accent/60"
                      }`}
                      style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>

                {challenge.completed && (
                  <div className="mt-4 flex items-center gap-2 text-accent">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Challenge Complete!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
