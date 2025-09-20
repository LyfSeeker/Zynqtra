"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Twitter, Linkedin, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface SocialShareProps {
  title: string
  description: string
  url?: string
  hashtags?: string[]
  showCard?: boolean
}

export function SocialShare({ title, description, url, hashtags = [], showCard = true }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const encodedUrl = encodeURIComponent(currentUrl)
  const hashtagString = hashtags.map((tag) => `#${tag}`).join(" ")

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags.join(",")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast({
        title: "Link Copied!",
        description: "The link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], "_blank", "width=600,height=400")
  }

  const ShareButtons = () => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="glassmorphism bg-transparent hover:bg-blue-500/20 hover:border-blue-500/40"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="glassmorphism bg-transparent hover:bg-blue-600/20 hover:border-blue-600/40"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="glassmorphism bg-transparent">
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  )

  if (!showCard) {
    return <ShareButtons />
  }

  return (
    <Card className="glassmorphism bg-card/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-accent" />
          <div>
            <h3 className="font-semibold text-foreground">Share this event</h3>
            <p className="text-sm text-muted-foreground">Spread the word about Web3 networking</p>
          </div>
        </div>
        <ShareButtons />
      </div>
      {hashtags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-accent/20 text-accent text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
