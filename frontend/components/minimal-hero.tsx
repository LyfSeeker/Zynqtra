"use client"

import { Button } from "@/components/ui/button"
import { TypingAnimation } from "./typing-animation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function MinimalHero() {
  const phrases = [
    "Your Zynqtra Journey Starts Here",
    "The Connecting Network",
    "Build Meaningful Connections",
    "Network. Earn. Grow.",
    "Where Web3 Meets Networking",
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl float-animation" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
          <TypingAnimation phrases={phrases} className="glow-text text-balance" />
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty font-sans font-normal leading-relaxed">
          The gamified Web3 networking platform that transforms events into engaging experiences.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/host-event">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold glow-text group"
            >
              Host an Event
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/join-event">
            <Button
              variant="outline"
              size="lg"
              className="glassmorphism px-8 py-4 text-lg font-semibold hover:bg-card/50 bg-transparent"
            >
              Join an Event
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
