"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, X, Briefcase, MapPin, Star } from "lucide-react"
import { useState } from "react"

interface Profile {
  id: string
  name: string
  title: string
  company: string
  location: string
  interests: string[]
  matchScore: number
  avatar: string
}

export function ProfileMatching() {
  const [profiles] = useState<Profile[]>([
    {
      id: "1",
      name: "Sarah Chen",
      title: "Product Manager",
      company: "TechCorp",
      location: "San Francisco",
      interests: ["AI/ML", "Product Strategy", "Startups"],
      matchScore: 95,
      avatar: "/professional-woman-diverse.png",
    },
    {
      id: "2",
      name: "Marcus Johnson",
      title: "Senior Developer",
      company: "DevStudio",
      location: "New York",
      interests: ["Web3", "React", "Open Source"],
      matchScore: 88,
      avatar: "/professional-man.png",
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      title: "UX Designer",
      company: "DesignLab",
      location: "Austin",
      interests: ["Design Systems", "User Research", "Accessibility"],
      matchScore: 92,
      avatar: "/professional-woman-designer.png",
    },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const currentProfile = profiles[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length)
      setSwipeDirection(null)
    }, 300)
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-yellow-400"
    return "text-orange-400"
  }

  if (!currentProfile) return null

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 glow-text">
            Smart Profile Matching
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Discover attendees with shared interests and complementary skills through AI-powered matching
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <div className="relative">
            <Card
              className={`glassmorphism bg-card/50 border-border/30 transition-all duration-300 ${
                swipeDirection === "left"
                  ? "transform -translate-x-full rotate-12 opacity-0"
                  : swipeDirection === "right"
                    ? "transform translate-x-full -rotate-12 opacity-0"
                    : ""
              }`}
            >
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="relative h-64 bg-gradient-to-br from-accent/20 to-primary/20 rounded-t-xl overflow-hidden">
                  <img
                    src={currentProfile.avatar || "/placeholder.svg"}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getMatchColor(currentProfile.matchScore)} bg-black/50 border-current`}>
                      <Star className="w-3 h-3 mr-1" />
                      {currentProfile.matchScore}% Match
                    </Badge>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{currentProfile.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>
                        {currentProfile.title} at {currentProfile.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{currentProfile.location}</span>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Shared Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest) => (
                        <Badge key={interest} className="bg-accent/20 text-accent border-accent/30">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 glassmorphism hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 bg-transparent"
                      onClick={() => handleSwipe("left")}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Pass
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => handleSwipe("right")}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Profile Preview */}
            {profiles[currentIndex + 1] && (
              <Card className="absolute inset-0 -z-10 transform scale-95 opacity-50 glassmorphism bg-card/30">
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-xl" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{profiles[currentIndex + 1].name}</h3>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Match Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Card className="glassmorphism bg-card/30 p-4 text-center">
              <div className="text-lg font-bold text-accent glow-text">12</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </Card>
            <Card className="glassmorphism bg-card/30 p-4 text-center">
              <div className="text-lg font-bold text-accent glow-text">8</div>
              <div className="text-xs text-muted-foreground">Connected</div>
            </Card>
            <Card className="glassmorphism bg-card/30 p-4 text-center">
              <div className="text-lg font-bold text-accent glow-text">3</div>
              <div className="text-xs text-muted-foreground">Chatting</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
