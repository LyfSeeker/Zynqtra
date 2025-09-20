"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Edit, Share2, Trophy, Users, Coins, Calendar, MapPin } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const [userProfile] = useState({
    name: "Alex Chen",
    title: "Senior Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    avatar: "/professional-woman-diverse.png",
    points: 1250,
    rank: 1,
    badges: 8,
    connections: 45,
    eventsAttended: 12,
    joinDate: "January 2024",
  })

  const badges = [
    { emoji: "🏆", name: "Event Champion", description: "Attended 10+ events", earned: true },
    { emoji: "🤝", name: "Super Connector", description: "Made 50+ connections", earned: true },
    { emoji: "🧠", name: "Knowledge Master", description: "Won 5 trivia games", earned: true },
    { emoji: "🗺️", name: "Explorer", description: "Completed treasure hunt", earned: true },
    { emoji: "⚡", name: "Speed Connector", description: "Speed networking champion", earned: true },
    { emoji: "🎯", name: "Challenge Master", description: "Completed all challenges", earned: true },
    { emoji: "🌟", name: "First Timer", description: "Attended first event", earned: true },
    { emoji: "🔥", name: "Streak Master", description: "5 events in a row", earned: true },
    { emoji: "💎", name: "VIP Member", description: "Premium member", earned: false },
    { emoji: "🚀", name: "Innovation Leader", description: "Led a workshop", earned: false },
  ]

  const recentActivity = [
    { type: "badge", description: "Earned 'Challenge Master' badge", date: "2 hours ago" },
    { type: "connection", description: "Connected with Sarah Johnson", date: "1 day ago" },
    { type: "event", description: "Attended Web3 Networking Summit", date: "2 days ago" },
    { type: "points", description: "Earned 75 points from treasure hunt", date: "3 days ago" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="glassmorphism bg-card/30 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                  <AvatarFallback>
                    {userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2 glow-text">{userProfile.name}</h1>
                  <p className="text-lg text-muted-foreground mb-1">
                    {userProfile.title} at {userProfile.company}
                  </p>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile.location}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="glassmorphism bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="glassmorphism bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats & Progress */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Cards */}
              <Card className="glassmorphism bg-card/30 p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent">Your Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="w-5 h-5 mr-2 text-accent" />
                      <span>Points</span>
                    </div>
                    <span className="text-xl font-bold text-accent">{userProfile.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-accent" />
                      <span>Rank</span>
                    </div>
                    <span className="text-xl font-bold text-accent">#{userProfile.rank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-accent" />
                      <span>Connections</span>
                    </div>
                    <span className="text-xl font-bold text-accent">{userProfile.connections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-accent" />
                      <span>Events</span>
                    </div>
                    <span className="text-xl font-bold text-accent">{userProfile.eventsAttended}</span>
                  </div>
                </div>
              </Card>

              {/* Progress to Next Level */}
              <Card className="glassmorphism bg-card/30 p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent">Next Level</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level 6</span>
                    <span>1250/1500</span>
                  </div>
                  <Progress value={(1250 / 1500) * 100} />
                  <p className="text-sm text-muted-foreground">250 more points to reach Level 6</p>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="glassmorphism bg-card/30 p-6">
                <h2 className="text-xl font-semibold mb-4 text-accent">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* NFT Badges Collection */}
            <div className="lg:col-span-2">
              <Card className="glassmorphism bg-card/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-accent">Synqtra Profile NFT & Badges</h2>
                  <Badge className="bg-accent/20 text-accent">
                    {userProfile.badges} / {badges.length} Collected
                  </Badge>
                </div>

                {/* NFT Profile Card */}
                <div className="mb-8">
                  <Card className="glassmorphism bg-gradient-to-br from-accent/20 to-primary/20 p-6 border-accent/40">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Synqtra Profile NFT</h3>
                      <Badge className="bg-accent/30 text-accent">Level 5</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16 border-2 border-accent/50">
                        <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                        <AvatarFallback>
                          {userProfile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-lg">{userProfile.name}</div>
                        <div className="text-muted-foreground">Member since {userProfile.joinDate}</div>
                        <div className="text-accent font-medium">{userProfile.points} Total Points</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {badges.map((badge, index) => (
                    <Card
                      key={index}
                      className={`glassmorphism p-4 text-center transition-all duration-300 hover:scale-105 ${
                        badge.earned ? "bg-accent/20 border-accent/40" : "bg-background/30 opacity-50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.emoji}</div>
                      <div className="text-sm font-medium mb-1">{badge.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">{badge.description}</div>
                      {badge.earned ? (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">Earned</Badge>
                      ) : (
                        <Badge className="bg-muted/20 text-muted-foreground text-xs">Locked</Badge>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
