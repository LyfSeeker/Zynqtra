"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function ProfileMatchingPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState([])

  const profiles = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Product Manager",
      company: "TechCorp",
      location: "San Francisco, CA",
      avatar: "/professional-woman-designer.png",
      interests: ["Web3", "Product Strategy", "AI"],
      matchScore: 95,
      bio: "Passionate about building products that make a difference. Love connecting with fellow innovators in the Web3 space.",
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      title: "UX Designer",
      company: "CreativeCo",
      location: "New York, NY",
      avatar: "/professional-man.png",
      interests: ["Design", "User Research", "Startups"],
      matchScore: 88,
      bio: "Design thinking enthusiast with 8 years of experience. Always excited to discuss the future of user experience.",
    },
    {
      id: 3,
      name: "Emily Davis",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Austin, TX",
      avatar: "/professional-woman-diverse.png",
      interests: ["React", "Node.js", "Blockchain"],
      matchScore: 92,
      bio: "Full-stack developer with a passion for blockchain technology. Building the future one line of code at a time.",
    },
  ]

  const handleLike = () => {
    const likedProfile = profiles[currentIndex]
    setMatches((prev) => [...prev, likedProfile])
    nextProfile()
  }

  const handlePass = () => {
    nextProfile()
  }

  const nextProfile = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length)
  }

  const prevProfile = () => {
    setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length)
  }

  const currentProfile = profiles[currentIndex]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 glow-text">Profile Matching</h1>
            <p className="text-lg text-muted-foreground">
              Discover people with shared interests and complementary skills
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Cards */}
            <div className="lg:col-span-2">
              <Card className="glassmorphism bg-card/30 p-8 relative overflow-hidden">
                {/* Profile Card */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-32 h-32 border-4 border-accent/50">
                      <AvatarImage src={currentProfile.avatar || "/placeholder.svg"} alt={currentProfile.name} />
                      <AvatarFallback>
                        {currentProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-semibold">
                      {currentProfile.matchScore}%
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">{currentProfile.name}</h2>
                  <p className="text-lg text-muted-foreground mb-1">
                    {currentProfile.title} at {currentProfile.company}
                  </p>
                  <div className="flex items-center justify-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentProfile.location}
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {currentProfile.interests.map((interest, index) => (
                      <Badge key={index} className="bg-accent/20 text-accent">
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">{currentProfile.bio}</p>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-6">
                    <Button
                      onClick={handlePass}
                      variant="outline"
                      size="lg"
                      className="glassmorphism w-16 h-16 rounded-full p-0 hover:bg-red-500/20 hover:border-red-500/50 bg-transparent"
                    >
                      <X className="w-8 h-8 text-red-400" />
                    </Button>
                    <Button
                      onClick={handleLike}
                      size="lg"
                      className="bg-accent hover:bg-accent/90 w-16 h-16 rounded-full p-0"
                    >
                      <Heart className="w-8 h-8" />
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8">
                    <Button onClick={prevProfile} variant="ghost" size="sm" className="glassmorphism">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentIndex + 1} of {profiles.length}
                    </span>
                    <Button onClick={nextProfile} variant="ghost" size="sm" className="glassmorphism">
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Matches Sidebar */}
            <div className="lg:col-span-1">
              <Card className="glassmorphism bg-card/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-accent">Your Matches</h2>
                  <div className="flex items-center text-accent">
                    <Users className="w-5 h-5 mr-1" />
                    <span className="font-semibold">{matches.length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 glassmorphism bg-background/30 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={match.avatar || "/placeholder.svg"} alt={match.name} />
                        <AvatarFallback>
                          {match.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{match.name}</div>
                        <div className="text-xs text-muted-foreground">{match.title}</div>
                        <div className="text-xs text-accent">{match.matchScore}% match</div>
                      </div>
                    </div>
                  ))}
                </div>

                {matches.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No matches yet. Start liking profiles to build your network!</p>
                  </div>
                )}
              </Card>

              {/* Matching Tips */}
              <Card className="glassmorphism bg-card/30 p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-accent">Matching Tips</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <p>Higher match scores indicate shared interests and complementary skills</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <p>Mutual likes create instant connections</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <p>Complete your profile to get better matches</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
