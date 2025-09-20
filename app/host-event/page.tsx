"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge" // Added Badge import
import { Checkbox } from "@/components/ui/checkbox" // Added Checkbox import
import { Trophy, Coins, Users, Mail } from "lucide-react" // Added Users and Mail icons
import { useState, useEffect } from "react" // Added useEffect
import { useWallet } from "@/contexts/wallet-context" // Added wallet context
import { useToast } from "@/hooks/use-toast" // Added toast

const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    interests: ["Web3", "DeFi", "Product Management"],
    walletAddress: "0x1234...5678",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    interests: ["React", "Node.js", "Web3"],
    walletAddress: "0x2345...6789",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    interests: ["UX/UI Design", "AI/ML", "Startups"],
    walletAddress: "0x3456...7890",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@example.com",
    interests: ["Blockchain", "Smart Contracts", "DeFi"],
    walletAddress: "0x4567...8901",
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa@example.com",
    interests: ["Marketing", "Entrepreneurship", "NFTs"],
    walletAddress: "0x5678...9012",
  },
]

export default function HostEventPage() {
  const { isConnected, userProfile } = useWallet() // Added wallet context
  const { toast } = useToast() // Added toast
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "", // Keep date separate
    time: "", // Keep time separate
    location: "",
    maxAttendees: "",
    rewards: "",
    targetInterests: [] as string[],
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]) // Added selected users state
  const [filteredUsers, setFilteredUsers] = useState(mockUsers) // Added filtered users state

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
    if (eventData.targetInterests.length === 0) {
      setFilteredUsers(mockUsers)
    } else {
      const filtered = mockUsers.filter((user) =>
        user.interests.some((interest) => eventData.targetInterests.includes(interest)),
      )
      setFilteredUsers(filtered)
    }
  }, [eventData.targetInterests])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glassmorphism bg-card/30 p-12">
              <h1 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h1>
              <p className="text-muted-foreground mb-6">Please connect your wallet to host an event.</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventData.date || !eventData.time) {
      toast({
        title: "Missing Information",
        description: "Please provide both date and time for your event.",
        variant: "destructive",
      })
      return
    }

    if (!eventData.title || !eventData.location || !eventData.maxAttendees) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Creating event:", eventData)
    console.log("[v0] Selected users:", selectedUsers)

    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        eventsHosted: userProfile.eventsHosted + 1,
      }
      // Save to localStorage
      localStorage.setItem(`profile_${userProfile.walletAddress}`, JSON.stringify(updatedProfile))
    }

    toast({
      title: "Event Created Successfully!",
      description: `Your event "${eventData.title}" has been created and invitations sent to ${selectedUsers.length} users.`,
    })

    setEventData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxAttendees: "",
      rewards: "",
      targetInterests: [],
    })
    setSelectedUsers([])
  }

  const toggleInterest = (interest: string) => {
    setEventData((prev) => ({
      ...prev,
      targetInterests: prev.targetInterests.includes(interest)
        ? prev.targetInterests.filter((i) => i !== interest)
        : [...prev.targetInterests, interest],
    }))
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {" "}
          {/* Increased max width for better layout */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 glow-text">Host Your Event</h1>
            <p className="text-lg text-muted-foreground">
              Create an engaging networking experience with gamified challenges and rewards
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {" "}
            {/* Changed to 3 columns */}
            {/* Event Setup Form */}
            <Card className="glassmorphism bg-card/30 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-accent">Event Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="Web3 Networking Summit"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="Describe your event..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventData.date}
                      onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                      className="glassmorphism bg-background/50"
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventData.time}
                      onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                      className="glassmorphism bg-background/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={eventData.maxAttendees}
                    onChange={(e) => setEventData({ ...eventData, maxAttendees: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="100"
                  />
                </div>

                <div>
                  <Label>Target Interests</Label>
                  <p className="text-sm text-muted-foreground mb-2">Select interests to find relevant attendees</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {availableInterests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={eventData.targetInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${
                          eventData.targetInterests.includes(interest)
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

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Create Event
                </Button>
              </form>
            </Card>
            {/* Rewards & Challenges Setup */}
            <Card className="glassmorphism bg-card/30 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-accent">Gamification Setup</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-accent" />
                    Default Challenges
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Meet 3 new people (50 Z points)", // Changed to Z points
                      "Join a group discussion (30 Z points)", // Changed to Z points
                      "Scan 5 QR codes (25 Z points)", // Changed to Z points
                      "Complete profile (20 Z points)", // Changed to Z points
                    ].map((challenge, index) => (
                      <div key={index} className="flex items-center p-3 glassmorphism bg-background/30 rounded-lg">
                        <Coins className="w-4 h-4 mr-2 text-accent" />
                        <span className="text-sm">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Reward Pool</h3>
                  <Input
                    value={eventData.rewards}
                    onChange={(e) => setEventData({ ...eventData, rewards: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="1000 Z tokens" // Changed to Z tokens
                  />
                </div>
              </div>
            </Card>
            <Card className="glassmorphism bg-card/30 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-accent flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Invite Users
              </h2>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {eventData.targetInterests.length > 0
                    ? `Showing users with interests: ${eventData.targetInterests.join(", ")}`
                    : "Showing all users (select interests above to filter)"}
                </p>
                <Badge className="bg-accent/20 text-accent">
                  {filteredUsers.length} users found • {selectedUsers.length} selected
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start space-x-3 p-3 glassmorphism bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground truncate">{user.name}</h4>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.interests.map((interest) => (
                          <Badge
                            key={interest}
                            className={`text-xs ${
                              eventData.targetInterests.includes(interest)
                                ? "bg-accent/30 text-accent border-accent/50"
                                : "bg-muted/20 text-muted-foreground"
                            }`}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedUsers.length > 0 && (
                <div className="mt-4 p-3 glassmorphism bg-accent/10 rounded-lg">
                  <p className="text-sm text-accent font-medium">
                    {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} will receive event invitations
                  </p>
                  <Button
                    type="button"
                    className="mt-2 w-full bg-accent/20 hover:bg-accent/30 text-accent"
                    onClick={() => {
                      toast({
                        title: "Invitations Sent!",
                        description: `Event invitations sent to ${selectedUsers.length} selected users.`,
                      })
                    }}
                  >
                    Send Invitations Now
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
