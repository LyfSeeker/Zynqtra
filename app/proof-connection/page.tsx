"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, CheckCircle, Users, Smartphone } from "lucide-react"
import { useState } from "react"

export default function ProofConnectionPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [connections, setConnections] = useState([
    { name: "Sarah Johnson", title: "Product Manager", company: "TechCorp", time: "2 min ago" },
    { name: "Mike Rodriguez", title: "Designer", company: "CreativeCo", time: "5 min ago" },
    { name: "Emily Davis", title: "Developer", company: "StartupXYZ", time: "10 min ago" },
  ])

  const handleStartScanning = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      // Add new connection
      setConnections((prev) => [
        {
          name: "David Kim",
          title: "Marketing Lead",
          company: "GrowthCorp",
          time: "Just now",
        },
        ...prev,
      ])
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 glow-text">Proof of Connection</h1>
            <p className="text-lg text-muted-foreground">
              Scan QR codes to verify and record your networking connections
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Scanner */}
            <Card className="glassmorphism bg-card/30 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6 text-accent">Scan QR Code</h2>

                {/* QR Scanner Interface */}
                <div className="relative mb-6">
                  <div className="w-64 h-64 mx-auto glassmorphism bg-background/50 rounded-lg flex items-center justify-center border-2 border-dashed border-accent/50">
                    {isScanning ? (
                      <div className="text-center">
                        <Scan className="w-16 h-16 mx-auto mb-4 text-accent animate-pulse" />
                        <p className="text-accent">Scanning...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-16 h-16 mx-auto mb-4 text-accent/50" />
                        <p className="text-muted-foreground">Point camera at QR code</p>
                      </div>
                    )}
                  </div>

                  {/* Scanning overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-accent rounded-lg animate-pulse" />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleStartScanning}
                  disabled={isScanning}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {isScanning ? "Scanning..." : "Start Scanning"}
                </Button>

                <div className="mt-6 p-4 glassmorphism bg-accent/10 rounded-lg">
                  <h3 className="font-medium text-accent mb-2">How it works:</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 text-left">
                    <li>1. Ask someone to show their Synqtra QR code</li>
                    <li>2. Point your camera at their code</li>
                    <li>3. Connection is automatically verified and recorded</li>
                    <li>4. Both parties earn connection points</li>
                  </ol>
                </div>
              </div>
            </Card>

            {/* Recent Connections */}
            <Card className="glassmorphism bg-card/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-accent">Recent Connections</h2>
                <div className="flex items-center text-accent">
                  <Users className="w-5 h-5 mr-1" />
                  <span className="font-semibold">{connections.length}</span>
                </div>
              </div>

              <div className="space-y-4">
                {connections.map((connection, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 glassmorphism bg-background/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-accent font-semibold">
                          {connection.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{connection.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {connection.title} at {connection.company}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <CheckCircle className="w-5 h-5 text-green-400 mb-1" />
                      <div className="text-xs text-muted-foreground">{connection.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {connections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No connections yet. Start scanning to build your network!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Your QR Code */}
          <Card className="glassmorphism bg-card/30 p-8 mt-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6 text-accent">Your QR Code</h2>
              <p className="text-muted-foreground mb-6">Show this code to others so they can connect with you</p>

              <div className="w-48 h-48 mx-auto glassmorphism bg-white rounded-lg flex items-center justify-center mb-6">
                {/* Placeholder QR code */}
                <div className="w-40 h-40 bg-black rounded grid grid-cols-8 gap-1 p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" className="glassmorphism bg-transparent">
                  Share QR Code
                </Button>
                <Button variant="outline" className="glassmorphism bg-transparent">
                  Download
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
