"use client"

import { Card } from "@/components/ui/card"
import { QrCode, Trophy, Users, Gamepad2 } from "lucide-react"

export function FeaturePreview() {
  const features = [
    {
      icon: QrCode,
      title: "Proof of Connection",
      subtitle: "QR Scan",
    },
    {
      icon: Trophy,
      title: "Starter Challenges",
      subtitle: "Gamified Tasks",
    },
    {
      icon: Users,
      title: "Profile Matching",
      subtitle: "Smart Connections",
    },
    {
      icon: Gamepad2,
      title: "Mini Games & Rewards",
      subtitle: "Earn Points",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 glow-text">Explore Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how Zynqtra transforms networking through gamification
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glassmorphism bg-card/30 p-6 border-accent/20">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-accent/20">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
