"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useWallet } from "@/contexts/wallet-context"
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  User,
  Wallet,
  Star,
  Award,
  Edit3,
  Save,
  X,
  Linkedin,
  Twitter,
  Mail,
  Network,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { isConnected, userProfile, updateProfile } = useWallet()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "", // Added email to edit form
    interests: [] as string[], // Added interests to edit form
    linkedinUsername: "",
    twitterUsername: "",
  })

  const availableInterests = [
    "Web3",
    "DeFi",
    "NFTs",
    "Blockchain",
    "AI/ML",
    "Product Management",
    "Software Development",
    "UX/UI Design",
    "Marketing",
    "Sales",
    "Entrepreneurship",
    "Startups",
    "Fintech",
    "Gaming",
    "Metaverse",
    "Crypto Trading",
    "Smart Contracts",
    "React",
    "Node.js",
    "Python",
  ]

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name,
        email: userProfile.email || "", // Load email from profile
        interests: userProfile.interests || [], // Load interests from profile
        linkedinUsername: userProfile.linkedinUsername || "",
        twitterUsername: userProfile.twitterUsername || "",
      })
    }
  }, [userProfile])

  const registeredEvents = [
    {
      id: "arbitrum-open-house",
      title: "Arbitrum Open House",
      date: "2024-01-25",
      time: "6:00 PM",
      location: "Bangalore, India",
      attendees: 48,
      maxAttendees: 100,
      rewards: "2000 ARB",
      tags: ["Arbitrum", "Web3", "Networking", "DeFi"],
      status: "upcoming",
    },
  ]

  const attendedEvents = [
    {
      id: "web3-summit-2023",
      title: "Web3 Summit 2023",
      date: "2023-12-15",
      location: "Mumbai, India",
      pointsEarned: 500, // Changed to Z points terminology
    },
  ]

  const handleSaveProfile = () => {
    if (userProfile) {
      updateProfile({
        name: editForm.name,
        email: editForm.email, // Save email
        interests: editForm.interests, // Save interests
        linkedinUsername: editForm.linkedinUsername,
        twitterUsername: editForm.twitterUsername,
      })
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    }
  }

  const toggleInterest = (interest: string) => {
    setEditForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glassmorphism bg-card/30 p-12">
              <Wallet className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h1>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to access your dashboard and manage your profile.
              </p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 glow-text">Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                  Manage profile, events, and track Web3 networking journey
                </p>
              </div>
              <Button
                variant="outline"
                className="glassmorphism bg-transparent"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Profile Information Card */}
            <Card className="glassmorphism bg-card/30 p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    Profile Information
                  </h2>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="glassmorphism bg-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="glassmorphism bg-input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Your Interests</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {availableInterests.map((interest) => (
                            <Button
                              key={interest}
                              type="button"
                              variant={editForm.interests.includes(interest) ? "default" : "outline"}
                              size="sm"
                              className={`text-xs ${
                                editForm.interests.includes(interest)
                                  ? "bg-accent text-accent-foreground"
                                  : "glassmorphism bg-transparent"
                              }`}
                              onClick={() => toggleInterest(interest)}
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Username</Label>
                        <div className="flex items-center">
                          <Linkedin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            placeholder="your-linkedin-username"
                            value={editForm.linkedinUsername}
                            onChange={(e) => setEditForm({ ...editForm, linkedinUsername: e.target.value })}
                            className="glassmorphism bg-input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter Username</Label>
                        <div className="flex items-center">
                          <Twitter className="w-4 h-4 mr-2 text-muted-foreground" />
                          <Input
                            id="twitter"
                            placeholder="your-twitter-handle"
                            value={editForm.twitterUsername}
                            onChange={(e) => setEditForm({ ...editForm, twitterUsername: e.target.value })}
                            className="glassmorphism bg-input"
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveProfile} className="bg-accent hover:bg-accent/90">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <p className="text-foreground font-medium">{userProfile?.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Wallet Address:</span>
                        <p className="text-foreground font-mono text-sm">{userProfile?.walletAddress}</p>
                      </div>
                      {userProfile?.email && (
                        <div>
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <p className="text-foreground flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {userProfile.email}
                          </p>
                        </div>
                      )}
                      {userProfile?.interests && userProfile.interests.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userProfile.interests.map((interest) => (
                              <Badge key={interest} className="bg-accent/20 text-accent text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {userProfile?.linkedinUsername && (
                        <div>
                          <span className="text-sm text-muted-foreground">LinkedIn:</span>
                          <p className="text-foreground flex items-center">
                            <Linkedin className="w-4 h-4 mr-2" />@{userProfile.linkedinUsername}
                          </p>
                        </div>
                      )}
                      {userProfile?.twitterUsername && (
                        <div>
                          <span className="text-sm text-muted-foreground">Twitter:</span>
                          <p className="text-foreground flex items-center">
                            <Twitter className="w-4 h-4 mr-2" />@{userProfile.twitterUsername}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Stats & Achievements
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glassmorphism bg-card/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent">{userProfile?.totalPoints || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Z Points</div> {/* Changed to Z Points */}
                    </div>
                    <div className="glassmorphism bg-card/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent flex items-center justify-center">
                        <Network className="w-5 h-5 mr-1" />
                        {userProfile?.connectionsCount || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Connections Made</div>
                    </div>
                    <div className="glassmorphism bg-card/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent">{userProfile?.eventsAttended || 0}</div>
                      <div className="text-sm text-muted-foreground">Events Attended</div>
                    </div>
                    <div className="glassmorphism bg-card/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent">{userProfile?.eventsHosted || 0}</div>
                      <div className="text-sm text-muted-foreground">Events Hosted</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 glassmorphism bg-card/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Profile Completion</span>
                      <span className="text-sm text-accent font-bold">
                        {Math.round(
                          (((userProfile?.name ? 1 : 0) +
                            (userProfile?.email ? 1 : 0) +
                            (userProfile?.interests?.length ? 1 : 0) +
                            (userProfile?.linkedinUsername ? 1 : 0) +
                            (userProfile?.twitterUsername ? 1 : 0)) /
                            5) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (((userProfile?.name ? 1 : 0) +
                              (userProfile?.email ? 1 : 0) +
                              (userProfile?.interests?.length ? 1 : 0) +
                              (userProfile?.linkedinUsername ? 1 : 0) +
                              (userProfile?.twitterUsername ? 1 : 0)) /
                              5) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete your profile to unlock more networking opportunities
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Separator className="mb-8" />

          {/* Registered Events Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Registered Events
            </h2>

            {registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="glassmorphism bg-card/30 p-6 hover:bg-card/50 transition-all duration-300"
                  >
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-accent/20 text-accent text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}/{event.maxAttendees} attendees
                      </div>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        {event.rewards} reward pool
                      </div>
                    </div>

                    <Link href={`/event/${event.id}`}>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group">
                        Enter Event
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glassmorphism bg-card/30 p-8 text-center">
                <p className="text-muted-foreground mb-4">No events registered yet</p>
                <Link href="/join-event">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Join an Event</Button>
                </Link>
              </Card>
            )}
          </div>

          <Separator className="mb-8" />

          {/* Attended Events Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Attended Events
            </h2>

            {attendedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendedEvents.map((event) => (
                  <Card key={event.id} className="glassmorphism bg-card/30 p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-accent" />
                        {event.pointsEarned} Z points earned {/* Changed to Z points */}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glassmorphism bg-card/30 p-8 text-center">
                <p className="text-muted-foreground">No events attended yet</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
