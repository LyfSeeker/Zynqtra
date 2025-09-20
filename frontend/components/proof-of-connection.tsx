"use client"

import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Smartphone, Users, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export function ProofOfConnection() {
  const [scanCount, setScanCount] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (scanCount < 5) {
        setScanCount((prev) => prev + 1)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [scanCount])

  const handleScanDemo = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setScanCount((prev) => Math.min(prev + 1, 5))
    }, 1500)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 glow-text">
            Proof of Connection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Scan QR codes to instantly connect with other attendees and build your verified network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* QR Code Demo */}
          <div className="relative">
            <Card className="glassmorphism bg-card/50 border-border/30 p-8">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div
                      className={`w-48 h-48 mx-auto bg-white rounded-2xl p-4 transition-all duration-500 ${isScanning ? "scale-110 shadow-2xl shadow-accent/50" : ""}`}
                    >
                      <div className="w-full h-full bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                        <QrCode className="w-32 h-32 text-white" />
                        {isScanning && <div className="absolute inset-0 bg-accent/20 animate-pulse rounded-lg" />}
                      </div>
                    </div>
                    {/* Scanning animation overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 border-4 border-accent rounded-2xl animate-pulse">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-2xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-2xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-2xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-2xl" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleScanDemo}
                  disabled={isScanning}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  {isScanning ? "Scanning..." : "Scan QR Code"}
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Connection Steps */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">1. Scan QR Codes</h3>
                <p className="text-muted-foreground">
                  Each attendee has a unique QR code. Scan to initiate connection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">2. Instant Connection</h3>
                <p className="text-muted-foreground">Profiles are exchanged automatically with mutual consent.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">3. Verified Network</h3>
                <p className="text-muted-foreground">Build a verified network of real connections from events.</p>
              </div>
            </div>

            {/* Connection Counter */}
            <Card className="glassmorphism bg-card/30 p-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent glow-text mb-2">{scanCount}/5</div>
                <div className="text-muted-foreground mb-4">Connections Made</div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(scanCount / 5) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
