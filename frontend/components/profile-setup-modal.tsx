"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { User, Mail, Linkedin, Twitter, Save } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/hooks/use-toast"

interface ProfileSetupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
  const { userProfile, updateProfile } = useWallet()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: "",
    interests: [] as string[],
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

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your display name.",
        variant: "destructive",
      })
      return
    }

    updateProfile({
      name: formData.name,
      email: formData.email,
      interests: formData.interests,
      linkedinUsername: formData.linkedinUsername,
      twitterUsername: formData.twitterUsername,
    })

    toast({
      title: "Profile Setup Complete!",
      description: "Your profile has been created successfully. Welcome to Synqtra!",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism bg-card/95 border-accent/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-accent" />
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <Card className="glassmorphism bg-background/30 p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glassmorphism bg-background/50"
                  placeholder="Your display name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism bg-background/30 p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Interests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select your interests to help us connect you with like-minded people
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableInterests.map((interest) => (
                <Button
                  key={interest}
                  type="button"
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    formData.interests.includes(interest)
                      ? "bg-accent text-accent-foreground"
                      : "glassmorphism bg-transparent"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Button>
              ))}
            </div>

            {formData.interests.length > 0 && (
              <div className="mt-4 p-3 glassmorphism bg-accent/10 rounded-lg">
                <p className="text-sm text-accent font-medium">
                  {formData.interests.length} interest{formData.interests.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            )}
          </Card>

          <Card className="glassmorphism bg-background/30 p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Social Profiles (Optional)</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Username</Label>
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={formData.linkedinUsername}
                    onChange={(e) => setFormData({ ...formData, linkedinUsername: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="your-linkedin-username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="twitter">Twitter Username</Label>
                <div className="flex items-center">
                  <Twitter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    id="twitter"
                    value={formData.twitterUsername}
                    onChange={(e) => setFormData({ ...formData, twitterUsername: e.target.value })}
                    className="glassmorphism bg-background/50"
                    placeholder="your-twitter-handle"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glassmorphism bg-transparent">
              Skip for Now
            </Button>
            <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
