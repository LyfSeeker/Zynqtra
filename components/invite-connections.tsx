"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Mail, Send, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InviteConnectionsProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  eventId: string
}

const mockConnections = [
  {
    id: "1",
    name: "Ben Greenberg",
    email: "ben@example.com",
    interests: ["Web3", "DeFi", "Product Management"],
    avatar: null,
    connected: true,
  },
  {
    id: "2",
    name: "Toni",
    email: "toni@example.com",
    interests: ["React", "Node.js", "Web3"],
    avatar: null,
    connected: true,
  },
  {
    id: "3",
    name: "Benjamin",
    email: "benjamin@example.com",
    interests: ["UX/UI Design", "AI/ML", "Startups"],
    avatar: null,
    connected: true,
  },
  {
    id: "4",
    name: "Takamasa",
    email: "takamasa@example.com",
    interests: ["Blockchain", "Smart Contracts", "DeFi"],
    avatar: null,
    connected: true,
  },
  {
    id: "5",
    name: "Swagtimus",
    email: "swagtimus@example.com",
    interests: ["Marketing", "Entrepreneurship", "NFTs"],
    avatar: null,
    connected: true,
  },
  {
    id: "6",
    name: "Dablendo",
    email: "dablendo@example.com",
    interests: ["Web3", "Gaming", "Community"],
    avatar: null,
    connected: true,
  },
  {
    id: "7",
    name: "Aditi Chopra",
    email: "aditi@example.com",
    interests: ["AI/ML", "Data Science", "Web3"],
    avatar: null,
    connected: true,
  },
]

export function InviteConnections({ isOpen, onClose, eventTitle, eventId }: InviteConnectionsProps) {
  const { toast } = useToast()
  const [selectedConnections, setSelectedConnections] = useState<string[]>([])

  const toggleConnection = (connectionId: string) => {
    setSelectedConnections((prev) =>
      prev.includes(connectionId) ? prev.filter((id) => id !== connectionId) : [...prev, connectionId],
    )
  }

  const handleSendInvitations = () => {
    if (selectedConnections.length === 0) {
      toast({
        title: "No Connections Selected",
        description: "Please select at least one connection to invite.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitations Sent!",
      description: `Successfully sent ${selectedConnections.length} invitation${selectedConnections.length !== 1 ? "s" : ""} to ${eventTitle}.`,
    })

    setSelectedConnections([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism bg-card/95 border-accent/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-accent" />
            Invite Your Connections
          </DialogTitle>
          <p className="text-muted-foreground">Invite your network connections to join "{eventTitle}"</p>
        </DialogHeader>

        <div className="mt-6">
          <div className="mb-4">
            <Badge className="bg-accent/20 text-accent">
              {mockConnections.length} connections • {selectedConnections.length} selected
            </Badge>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockConnections.map((connection) => (
              <Card key={connection.id} className="glassmorphism bg-background/30 p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedConnections.includes(connection.id)}
                    onCheckedChange={() => toggleConnection(connection.id)}
                    className="mt-1"
                  />

                  <Avatar className="w-12 h-12">
                    <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                    <AvatarFallback>
                      {connection.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">{connection.name}</h4>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Connected</Badge>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Mail className="w-3 h-3 mr-1" />
                      {connection.email}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {connection.interests.slice(0, 3).map((interest) => (
                        <Badge key={interest} className="text-xs bg-muted/20 text-muted-foreground">
                          {interest}
                        </Badge>
                      ))}
                      {connection.interests.length > 3 && (
                        <Badge className="text-xs bg-muted/20 text-muted-foreground">
                          +{connection.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedConnections.length > 0 && (
            <Card className="glassmorphism bg-accent/10 p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-accent">
                    {selectedConnections.length} connection{selectedConnections.length !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-xs text-muted-foreground">They'll receive an invitation to join this event</p>
                </div>
                <Users className="w-5 h-5 text-accent" />
              </div>
            </Card>
          )}

          <div className="flex gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glassmorphism bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSendInvitations}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={selectedConnections.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Invitations ({selectedConnections.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
