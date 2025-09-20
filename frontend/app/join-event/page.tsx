"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/hooks/use-toast"

export default function JoinEventPage() {
  const [hasJoined, setHasJoined] = useState(false)
  const router = useRouter()
  const { isConnected, userProfile, updateProfile } = useWallet()
  const { toast } = useToast()

  const event = {
    id: "arbitrum-open-house",
    title: "Arbitrum Open House",
    date: "2024-01-25",
    time: "6:00 PM",
    location: "Bangalore, India",
    attendees: 47,
    maxAttendees: 100,
    rewards: "2000 ARB",
    tags: ["Arbitrum", "Web3", "Networking", "DeFi"],
    description:
      "Join the Arbitrum community for an evening of networking, learning, and building connections in the Web3 space. Experience gamified networking with QR code scanning, challenges, and rewards.",
  }

  const isAlreadyRegistered = userProfile?.registeredEvents?.includes(event.id) || false

  const handleJoinEvent = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet from the navigation menu to join events.",
        variant: "destructive",
      })
      return
    }

    if (isAlreadyRegistered) {
      toast({
        title: "Already Registered",
        description: "You are already registered for this event.",
      })
      return
    }

    setHasJoined(true)

    if (userProfile) {
      const updatedRegisteredEvents = [...(userProfile.registeredEvents || []), event.id]
      updateProfile({
        registeredEvents: updatedRegisteredEvents,
      })

      toast({
        title: "Event Joined!",
        description: `Successfully registered for ${event.title}`,
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 glow-text">Join an Event</h1>
            <p className="text-lg text-muted-foreground">Discover networking events and start earning rewards</p>
          </div>

          {/* Single Event Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="glassmorphism bg-card/30 p-8 hover:bg-card/50 transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-semibold text-foreground">{event.title}</h3>
                  {isAlreadyRegistered && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Registered
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-accent/20 text-accent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3" />
                  {event.attendees}/{event.maxAttendees} attendees
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-3" />
                  {event.rewards} reward pool
                </div>
              </div>

              {/* Event Features */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-foreground mb-3">What You'll Experience:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                    QR Code Networking
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                    Gamified Challenges
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                    Profile Matching
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                    Mini Games & Rewards
                  </div>
                </div>
              </div>

              <Button
                onClick={handleJoinEvent}
                disabled={hasJoined || isAlreadyRegistered}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 disabled:opacity-50"
              >
                {hasJoined
                  ? "Joined! Redirecting to Dashboard..."
                  : isAlreadyRegistered
                    ? "Already Registered"
                    : "Join Event"}
              </Button>

              {isAlreadyRegistered && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    className="glassmorphism bg-transparent"
                    onClick={() => router.push(`/event/${event.id}`)}
                  >
                    Enter Event
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
