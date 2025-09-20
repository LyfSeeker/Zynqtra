"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, MessageCircle, Users, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Attendee {
  id: string
  name: string
  avatar: string
  interests: string[]
  bio: string
  company: string
  matchScore: number
  mutualConnections: number
}

export function InterestMatching() {
  const [currentAttendee, setCurrentAttendee] = useState<Attendee | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [matches, setMatches] = useState<Attendee[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const mockAttendees: Attendee[] = [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/professional-woman-tech.jpg",
        interests: ["Web3", "AI", "Startups", "Blockchain"],
        bio: "Building the future of decentralized applications. Always excited to connect with fellow innovators!",
        company: "TechFlow Labs",
        matchScore: 92,
        mutualConnections: 5,
      },
      {
        id: "2",
        name: "Marcus Johnson",
        avatar: "/professional-man-developer.png",
        interests: ["Gaming", "AI", "Music", "Web3"],
        bio: "Game developer passionate about AI-powered experiences. Love discussing the intersection of tech and creativity.",
        company: "Pixel Studios",
        matchScore: 87,
        mutualConnections: 3,
      },
      {
        id: "3",
        name: "Elena Rodriguez",
        avatar: "/professional-woman-designer.png",
        interests: ["Startups", "Design", "Music", "AI"],
        bio: "UX designer helping startups create meaningful user experiences. Always up for creative collaborations!",
        company: "Design Forward",
        matchScore: 78,
        mutualConnections: 2,
      },
    ]

    setAttendees(mockAttendees)
    setCurrentAttendee(mockAttendees[0])
  }, [])

  const handleLike = () => {
    if (currentAttendee) {
      setMatches((prev) => [...prev, currentAttendee])
      toast({
        title: "It's a match! 🎉",
        description: `You and ${currentAttendee.name} have connected!`,
      })
      nextAttendee()
    }
  }

  const handlePass = () => {
    nextAttendee()
  }

  const nextAttendee = () => {
    const currentIndex = attendees.findIndex((a) => a.id === currentAttendee?.id)
    const nextIndex = currentIndex + 1

    if (nextIndex < attendees.length) {
      setCurrentAttendee(attendees[nextIndex])
    } else {
      setCurrentAttendee(null)
    }
  }

  const handleMessage = (attendee: Attendee) => {
    toast({
      title: "Message Sent",
      description: `Started conversation with ${attendee.name}`,
    })
  }

  if (!currentAttendee && matches.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="glassmorphism bg-card/30 p-8 border-accent/20 text-center max-w-md">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No More Attendees</h2>
          <p className="text-muted-foreground mb-4">
            You've seen all available matches for now. Check back later for new attendees!
          </p>
          <Button variant="outline">Return to Profile</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Find Matches</h1>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Current Attendee Card */}
        {currentAttendee && (
          <Card className="glassmorphism bg-card/30 border-accent/20 overflow-hidden mb-6">
            <div className="relative">
              <img
                src={currentAttendee.avatar || "/placeholder.svg"}
                alt={currentAttendee.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium">
                {currentAttendee.matchScore}% match
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-semibold text-foreground">{currentAttendee.name}</h2>
                <Badge variant="outline">{currentAttendee.company}</Badge>
              </div>

              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{currentAttendee.bio}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Shared Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {currentAttendee.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-accent/20 text-accent">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {currentAttendee.mutualConnections > 0 && (
                <p className="text-sm text-muted-foreground">{currentAttendee.mutualConnections} mutual connections</p>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {currentAttendee && (
          <div className="flex gap-4 mb-8">
            <Button onClick={handlePass} variant="outline" size="lg" className="flex-1 glassmorphism bg-transparent">
              <X className="w-5 h-5 mr-2" />
              Pass
            </Button>
            <Button onClick={handleLike} size="lg" className="flex-1 bg-accent hover:bg-accent/90">
              <Heart className="w-5 h-5 mr-2" />
              Connect
            </Button>
          </div>
        )}

        {/* Matches Section */}
        {matches.length > 0 && (
          <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Matches ({matches.length})</h3>
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={match.avatar || "/placeholder.svg"} alt={match.name} />
                      <AvatarFallback>
                        {match.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{match.name}</p>
                      <p className="text-sm text-muted-foreground">{match.company}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleMessage(match)} className="bg-accent hover:bg-accent/90">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
