"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScannedUser {
  userId: string
  name: string
  interests: string[]
  timestamp: number
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    const mockData: ScannedUser = {
      userId: "user_" + Math.random().toString(36).substr(2, 9),
      name: "Jordan Smith",
      interests: ["Web3", "Gaming", "Music"],
      timestamp: Date.now(),
    }

    setScannedData(mockData)
    stopCamera()

    toast({
      title: "Connection Successful!",
      description: `Connected with ${mockData.name}`,
    })
  }

  const handleConnect = () => {
    if (scannedData) {
      console.log("Connecting with:", scannedData)
      setScannedData(null)

      toast({
        title: "Added to Connections",
        description: `${scannedData.name} has been added to your network`,
      })
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  if (scannedData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20 max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">QR Code Scanned!</h2>
            <p className="text-muted-foreground mb-4">Found: {scannedData.name}</p>

            <div className="bg-accent/10 rounded-lg p-4 mb-6">
              <p className="font-medium text-foreground mb-2">Shared Interests:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {scannedData.interests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-accent/20 text-accent rounded text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConnect} className="flex-1">
                Add Connection
              </Button>
              <Button variant="outline" onClick={() => setScannedData(null)} className="flex-1">
                Scan Another
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <Card className="glassmorphism bg-card/30 p-6 border-accent/20">
          <div className="text-center mb-6">
            <Camera className="w-12 h-12 text-accent mx-auto mb-3" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">QR Scanner</h1>
            <p className="text-muted-foreground">Scan QR codes to connect with other attendees</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="relative mb-6">
            {isScanning ? (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg bg-muted" />
                <div className="absolute inset-0 border-2 border-accent rounded-lg">
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent"></div>
                </div>
                <Button onClick={stopCamera} variant="destructive" size="sm" className="absolute top-2 right-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Camera not active</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {!isScanning ? (
              <Button onClick={startCamera} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={simulateQRScan} variant="outline" className="w-full bg-transparent">
                Simulate QR Scan (Demo)
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
