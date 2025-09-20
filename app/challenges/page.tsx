"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, QrCode, UserCheck, Star, Coins } from "lucide-react"
import { useState } from "react"

export default function ChallengesPage() {
  const [userPoints, setUserPoints] = useState(275)

  const challenges = [
    {
      id: 1,
      title: "Meet 3 new people",
      description: "Connect with 3 different attendees",
      progress: 2,
      target: 3,
      points: 50,
      status: "active",
      icon: Users,
    },
    {
      id: 2,
      title: "Scan 5 QR codes",
      description: "Scan QR codes from other attendees",
      progress: 5,
      target: 5,
      points: 25,
      status: "completed",
      icon: QrCode,
    },
    {
      id: 3,
      title: "Complete your profile",
      description: "Fill out all profile information",
      progress: 1,
      target: 1,
      points: 20,
      status: "completed",
      icon: UserCheck,
    },
    {
      id: 4,
      title: "Join a group discussion",
      description: "Participate in a group conversation",
      progress: 0,
      target: 1,
      points: 30,
      status: "pending",
      icon: Star,
    },
    {
      id: 5,
      title: "Attend 3 sessions",
      description: "Join 3 different event sessions",
      progress: 1,
      target: 3,
      points: 75,
      status: "active",
      icon: Trophy,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "active":
        return "bg-accent/20 text-accent"
      case "pending":
        return "bg-muted/20 text-muted-foreground"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 glow-text">Your Challenges</h1>
            <p className="text-lg text-muted-foreground">Complete challenges to earn points and unlock rewards</p>
          </div>

          {/* Points Display */}
          <Card className="glassmorphism bg-card/30 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Total Points</h2>
                <div className="flex items-center">
                  <Coins className="w-6 h-6 mr-2 text-accent" />
                  <span className="text-3xl font-bold text-accent glow-text">{userPoints}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Next Reward</div>
                <div className="text-lg font-semibold text-accent">500 points</div>
                <Progress value={(userPoints / 500) * 100} className="w-32 mt-2" />
              </div>
            </div>
          </Card>

          {/* Challenges List */}
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="glassmorphism bg-card/30 p-6 hover:bg-card/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 rounded-full bg-accent/20">
                      <challenge.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                        <Badge className={getStatusColor(challenge.status)}>{challenge.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{challenge.description}</p>

                      {challenge.status !== "completed" && (
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {challenge.progress}/{challenge.target}
                            </span>
                          </div>
                          <Progress value={(challenge.progress / challenge.target) * 100} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center text-accent font-semibold">
                      <Coins className="w-4 h-4 mr-1" />
                      {challenge.points}
                    </div>
                    {challenge.status === "completed" && <div className="text-green-400 text-sm mt-1">✓ Completed</div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Upcoming Rewards */}
          <Card className="glassmorphism bg-card/30 p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-accent">Upcoming Rewards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 glassmorphism bg-background/30 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-medium">Event Champion</div>
                <div className="text-sm text-muted-foreground">500 points</div>
              </div>
              <div className="text-center p-4 glassmorphism bg-background/30 rounded-lg">
                <div className="text-2xl mb-2">🤝</div>
                <div className="font-medium">Super Connector</div>
                <div className="text-sm text-muted-foreground">750 points</div>
              </div>
              <div className="text-center p-4 glassmorphism bg-background/30 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-medium">Challenge Master</div>
                <div className="text-sm text-muted-foreground">1000 points</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
