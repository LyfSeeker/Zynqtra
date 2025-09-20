"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Zap, Network, Trophy, Target, Shield, Atom } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Sync",
      description: "Instant connections powered by real-time neural matching that adapts to your networking style.",
      color: "from-electric-blue to-cyan-400",
      bgColor: "bg-blue-500/10",
      delay: "0ms",
    },
    {
      icon: Network,
      title: "Web Weaving",
      description: "Build intricate professional networks that grow stronger with every meaningful interaction.",
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-purple-500/10",
      delay: "200ms",
    },
    {
      icon: Trophy,
      title: "Achievement Engine",
      description: "Unlock exclusive rewards and recognition as you master the art of strategic networking.",
      color: "from-amber-400 to-orange-400",
      bgColor: "bg-amber-500/10",
      delay: "400ms",
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Find exactly who you need with laser-focused algorithms that understand your goals.",
      color: "from-green-400 to-emerald-400",
      bgColor: "bg-green-500/10",
      delay: "600ms",
    },
    {
      icon: Shield,
      title: "Trust Protocol",
      description: "Verified connections and secure interactions in a protected networking environment.",
      color: "from-red-400 to-rose-400",
      bgColor: "bg-red-500/10",
      delay: "800ms",
    },
    {
      icon: Atom,
      title: "Quantum Leap",
      description: "Breakthrough networking experiences that transcend traditional professional boundaries.",
      color: "from-indigo-400 to-violet-400",
      bgColor: "bg-indigo-500/10",
      delay: "1000ms",
    },
  ]

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-purple-500/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-green-500/20 rotate-12 animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 glow-text">Power Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Experience networking reimagined with cutting-edge technology and intuitive design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={feature.title} className="group relative" style={{ animationDelay: feature.delay }}>
              <Card className="glassmorphism bg-card/50 border-border/30 hover:border-border/60 transition-all duration-700 hover:scale-110 hover:-translate-y-4 relative overflow-hidden animate-fade-in-up">
                <div
                  className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-spin-border transition-opacity duration-500"></div>

                <CardContent className="p-8 relative z-10">
                  <div className="relative mb-6">
                    <div
                      className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl group-hover:animate-pulse-glow transition-all duration-500 shadow-lg group-hover:shadow-2xl`}
                    >
                      <feature.icon className="w-8 h-8 text-white group-hover:animate-bounce-subtle" />
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-orbit-1"></div>
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-orbit-2"></div>
                      <div className="absolute top-8 right-0 w-1 h-1 bg-white/50 rounded-full animate-orbit-3"></div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-card-foreground mb-4 font-display group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-1 bg-gray-700 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className={`h-full bg-gradient-to-r ${feature.color} rounded-full animate-progress-fill`}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.6); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes orbit-1 {
          from { transform: rotate(0deg) translateX(30px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(120deg) translateX(25px) rotate(-120deg); }
          to { transform: rotate(480deg) translateX(25px) rotate(-480deg); }
        }
        @keyframes orbit-3 {
          from { transform: rotate(240deg) translateX(20px) rotate(-240deg); }
          to { transform: rotate(600deg) translateX(20px) rotate(-600deg); }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-spin-border { animation: spin-border 2s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 1s ease-in-out infinite; }
        .animate-orbit-1 { animation: orbit-1 8s linear infinite; }
        .animate-orbit-2 { animation: orbit-2 6s linear infinite; }
        .animate-orbit-3 { animation: orbit-3 10s linear infinite; }
        .animate-progress-fill { animation: progress-fill 2s ease-out; }
      `}</style>
    </section>
  )
}
