"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SocialShare } from "@/components/social-share"
import { AchievementShare } from "@/components/achievement-share"
import { InviteConnections } from "@/components/invite-connections"
import { QrCode, Trophy, Users, Gamepad2, Target, Zap, Award, Crown, Share2, Twitter, UserPlus } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"

export default function EventPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [userPoints, setUserPoints] = useState(150)
  const [showAchievement, setShowAchievement] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [hasJoinedEvent, setHasJoinedEvent] = useState(true) // Simulate user has joined
  const { userProfile, joinEvent } = useWallet()

  const event = {
    id: "arbitrum-open-house",
    title: "Arbitrum Open House",
    date: "2024-01-25",
    time: "6:00 PM",
    location: "Bangalore, India",
    attendees: 48,
    maxAttendees: 100,
    rewards: "2000 ARB",
  }

  const challenges = [
    { id: 1, title: "Connect with 5 people using QR code", progress: 60, reward: 50, completed: false },
    { id: 2, title: "Complete your profile", progress: 100, reward: 25, completed: true },
    { id: 3, title: "Attend a workshop", progress: 0, reward: 30, completed: false },
    { id: 4, title: "Share your project", progress: 0, reward: 40, completed: false },
  ]

  const leaderboard = [
    { rank: 1, name: "Ben Greenberg", points: 420, avatar: "BG" },
    { rank: 2, name: "Toni", points: 380, avatar: "T" },
    { rank: 3, name: "Benjamin", points: 350, avatar: "B" },
    { rank: 4, name: userProfile?.name || "You", points: userPoints, avatar: "YU" },
    { rank: 5, name: "Takamasa", points: 120, avatar: "T" },
  ]

  const miniGames = [
    {
      id: 1,
      title: "Icebreaker Trivia",
      description: "Answer questions about Web3",
      reward: "25 Z points + NFT badge", // Updated to Z points
      icon: Target,
    },
    {
      id: 2,
      title: "Networking Bingo",
      description: "Complete networking challenges",
      reward: "50 Z points + Rare NFT", // Updated to Z points
      icon: Trophy,
    },
    {
      id: 3,
      title: "Treasure Hunt",
      description: "Find hidden QR codes around the venue",
      reward: "100 Z points + Epic NFT", // Updated to Z points
      icon: Zap,
    },
  ]

  const sampleAchievement = {
    title: "Profile Master",
    description: "Successfully completed your networking profile with all social links",
    points: 25,
    badge: "Profile Expert",
    date: new Date().toLocaleDateString(),
  }

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <Button
      variant={activeTab === id ? "default" : "ghost"}
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 ${activeTab === id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  )

  const simulateAchievement = () => {
    setShowAchievement(true)
    setTimeout(() => setShowAchievement(false), 10000) // Hide after 10 seconds
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Achievement Popup */}
          {showAchievement && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="max-w-md w-full">
                <AchievementShare achievement={sampleAchievement} userProfile={userProfile} />
                <Button
                  variant="ghost"
                  onClick={() => setShowAchievement(false)}
                  className="w-full mt-4 text-muted-foreground"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Invite Connections Modal */}
          <InviteConnections
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            eventTitle={event.title}
            eventId={event.id}
          />

          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-foreground glow-text">{event.title}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 px-3 py-1">Live Event</Badge>
                {hasJoinedEvent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                    className="glassmorphism bg-transparent"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Friends
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("share")}
                  className="glassmorphism bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>
                {event.date} at {event.time}
              </span>
              <span>•</span>
              <span>{event.location}</span>
              <span>•</span>
              <span>
                {event.attendees}/{event.maxAttendees} attendees
              </span>
            </div>
          </div>

          {/* Points Display */}
          <Card className="glassmorphism bg-card/30 p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/20">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Z Points</p> {/* Updated to Z Points */}
                  <p className="text-2xl font-bold text-foreground">{userPoints}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-xl font-semibold text-accent">#4</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateAchievement}
                  className="glassmorphism bg-transparent"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Test Achievement
                </Button>
              </div>
            </div>
          </Card>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
            <TabButton id="overview" label="Overview" icon={Target} />
            <TabButton id="qr-scan" label="QR Scan" icon={QrCode} />
            <TabButton id="challenges" label="Challenges" icon={Trophy} />
            <TabButton id="matching" label="Profile Matching" icon={Users} />
            <TabButton id="games" label="Mini Games" icon={Gamepad2} />
            <TabButton id="leaderboard" label="Leaderboard" icon={Crown} />
            <TabButton id="share" label="Share" icon={Share2} />
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glassmorphism bg-card/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <QrCode className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold">Proof of Connection</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Scan QR codes to connect with other attendees and earn Z points. {/* Updated to Z points */}
                </p>
                <Button onClick={() => setActiveTab("qr-scan")} variant="outline" className="w-full">
                  Start Scanning
                </Button>
              </Card>

              <Card className="glassmorphism bg-card/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold">Challenges</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Complete networking challenges to earn rewards and badges. {/* Removed NFT reference */}
                </p>
                <Button onClick={() => setActiveTab("challenges")} variant="outline" className="w-full">
                  View Challenges
                </Button>
              </Card>

              <Card className="glassmorphism bg-card/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gamepad2 className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold">Mini Games</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Play networking games and compete for the top spot on the leaderboard.
                </p>
                <Button onClick={() => setActiveTab("games")} variant="outline" className="w-full">
                  Play Games
                </Button>
              </Card>
            </div>
          )}

          {activeTab === "qr-scan" && (
            <Card className="glassmorphism bg-card/30 p-8 text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-48 h-48 mx-auto bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-24 h-24 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code Scanner</h3>
                <p className="text-muted-foreground">Point your camera at another attendee's QR code to connect</p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Open Camera</Button>
            </Card>
          )}

          {activeTab === "challenges" && (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="glassmorphism bg-card/30 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <Badge
                      variant={challenge.completed ? "default" : "secondary"}
                      className={challenge.completed ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {challenge.reward} Z points {/* Updated to Z points */}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  {challenge.completed && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Completed!</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {activeTab === "matching" && (
            <div className="text-center">
              <Card className="glassmorphism bg-card/30 p-8 max-w-md mx-auto">
                <Users className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Profile Matching</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with attendees who share your interests in Web3, DeFi, and blockchain technology.
                </p>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Find Matches</Button>
              </Card>
            </div>
          )}

          {activeTab === "games" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {miniGames.map((game) => (
                <Card key={game.id} className="glassmorphism bg-card/30 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <game.icon className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-semibold">{game.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{game.description}</p>
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      {game.reward}
                    </Badge>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Play Now</Button>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <Card className="glassmorphism bg-card/30 p-6">
              <h3 className="text-xl font-semibold mb-6 text-center">Event Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${player.name === "You" ? "bg-accent/20" : "bg-background/50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${player.rank <= 3 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {player.rank <= 3 ? <Crown className="w-4 h-4" /> : player.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent">
                        {player.avatar}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className="font-semibold text-accent">{player.points} pts</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "share" && (
            <div className="space-y-6">
              <SocialShare
                title={`Join me at ${event.title}!`}
                description="Experience the future of networking with gamified Web3 events. Connect, compete, and earn rewards!"
                hashtags={["Web3Networking", "ZYNQTRA", "Blockchain", "Arbitrum", "DeFi"]}
              />

              <Card className="glassmorphism bg-card/30 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-accent" />
                  Share Your Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glassmorphism bg-card/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-accent mb-1">{userPoints}</div>
                    <div className="text-sm text-muted-foreground">Z Points Earned</div> {/* Updated to Z Points */}
                  </div>
                  <div className="glassmorphism bg-card/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-accent mb-1">#4</div>
                    <div className="text-sm text-muted-foreground">Current Rank</div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => {
                    const shareText = `🚀 I'm currently ranked #4 with ${userPoints} Z points at ${event.title}! Join the Web3 networking revolution at ZYNQTRA! #Web3Networking #ZYNQTRA`
                    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
                    window.open(shareUrl, "_blank")
                  }}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Share My Progress
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
