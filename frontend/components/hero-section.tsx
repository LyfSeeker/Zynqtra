import { Button } from "@/components/ui/button"
import { TypingAnimation } from "./typing-animation"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  const phrases = [
    "Networking made fun.",
    "Earn rewards as you connect.",
    "Your Zynqtra journey starts here.",
    "Connect. Engage. Grow.",
    "The connecting network.",
    "Build meaningful relationships.",
    "Level up your network game.",
    "Where connections become rewards.",
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg">
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with varied sizes and positions */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl float-animation" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "2s" }}
        />

        {/* Additional organic background elements */}
        <div
          className="absolute top-10 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl float-animation"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-20 left-10 w-40 h-40 bg-primary/8 rounded-full blur-2xl float-animation"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 bg-secondary/6 rounded-full blur-xl float-animation"
          style={{ animationDelay: "2.5s" }}
        />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Animated lines/connections */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M100,200 Q300,100 500,300 T900,200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M200,400 Q400,300 600,500 T1000,400"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Main heading with typing animation */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
          <TypingAnimation phrases={phrases} className="glow-text text-balance" />
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty font-sans font-normal leading-relaxed">
          The gamified networking platform that transforms events into engaging experiences. Build connections, earn
          rewards, and level up your professional network.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold glow-text group"
          >
            Start Networking
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="glassmorphism px-8 py-4 text-lg font-semibold hover:bg-card/50 bg-transparent"
          >
            <Play className="mr-2 w-5 h-5" />
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="glassmorphism bg-card/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-accent glow-text">10K+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div className="glassmorphism bg-card/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-accent glow-text">500+</div>
            <div className="text-muted-foreground">Events Hosted</div>
          </div>
          <div className="glassmorphism bg-card/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-accent glow-text">1M+</div>
            <div className="text-muted-foreground">Connections Made</div>
          </div>
        </div>
      </div>
    </section>
  )
}
