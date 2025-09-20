"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  isConnected: boolean
  address: string | undefined
  isConnecting: boolean
  currentNetwork: string | undefined
  connect: () => void
  disconnect: () => void
  switchToArbitrumSepolia: () => void
  userProfile: UserProfile | null
  updateProfile: (profile: Partial<UserProfile>) => void
  joinEvent: (eventId: string) => void
  markEventAttended: (eventId: string, pointsEarned: number) => void
  showProfileSetup: boolean
  setShowProfileSetup: (show: boolean) => void
}

interface UserProfile {
  name: string
  walletAddress: string
  email?: string
  interests: string[]
  totalPoints: number
  eventsAttended: number
  eventsHosted: number
  connectionsCount?: number
  registeredEvents: string[]
  attendedEvents: string[]
  linkedinUsername?: string
  twitterUsername?: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const ARBITRUM_SEPOLIA_CHAIN_ID = "0x66eee" // 421614 in hex
const ARBITRUM_SEPOLIA_CHAIN_ID_DECIMAL = 421614
const ARBITRUM_SEPOLIA_CONFIG = {
  chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
  chainName: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
  blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [isConnecting, setIsConnecting] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState<string | undefined>(undefined)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const walletAddress = accounts[0]
            setAddress(walletAddress)
            setIsConnected(true)

            // Get current network
            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            setCurrentNetwork(chainId)
            console.log("Current chain ID:", chainId, "Expected:", ARBITRUM_SEPOLIA_CHAIN_ID)

            // Load user profile
            const savedProfile = localStorage.getItem(`profile_${walletAddress}`)
            if (savedProfile) {
              const profile = JSON.parse(savedProfile)
              if (profile.attendedEvents && profile.attendedEvents.length > 0) {
                profile.eventsAttended = profile.attendedEvents.length
              }
              setUserProfile(profile)
            }
          }
        } catch (error) {
          console.error("Error checking existing connection:", error)
        }
      }
    }

    checkExistingConnection()

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          handleDisconnect()
        } else {
          setAddress(accounts[0])
        }
      })

      window.ethereum.on("chainChanged", (chainId: string) => {
        setCurrentNetwork(chainId)
        console.log("Chain changed to:", chainId)
        const isCorrectNetwork = chainId === ARBITRUM_SEPOLIA_CHAIN_ID || chainId === "421614" || parseInt(chainId, 16) === 421614
        if (!isCorrectNetwork) {
          toast({
            title: "Network Changed",
            description: "Please switch to Arbitrum Sepolia for full functionality",
            variant: "destructive",
          })
        }
      })
    }
  }, [toast])

  const handleConnect = async () => {
    if (isConnected || isConnecting) {
      return
    }

    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          const walletAddress = accounts[0]
          setAddress(walletAddress)
          setIsConnected(true)

          // Get current network
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setCurrentNetwork(chainId)
          console.log("Current chain ID on connect:", chainId, "Expected:", ARBITRUM_SEPOLIA_CHAIN_ID)

          // Create or load user profile
          const savedProfile = localStorage.getItem(`profile_${walletAddress}`)
          if (savedProfile) {
            const profile = JSON.parse(savedProfile)
            if (profile.attendedEvents && profile.attendedEvents.length > 0) {
              profile.eventsAttended = profile.attendedEvents.length
            }
            setUserProfile(profile)

            toast({
              title: "Wallet Connected",
              description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            })
          } else {
            const newProfile: UserProfile = {
              name: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
              walletAddress,
              email: "",
              interests: [],
              totalPoints: 0,
              eventsAttended: 1, // Set to 1 since we have Web3 Summit 2023 in dummy data
              eventsHosted: 0,
              connectionsCount: 0,
              registeredEvents: [],
              attendedEvents: ["web3-summit-2023"], // Add the dummy event to match the display
            }
            setUserProfile(newProfile)
            localStorage.setItem(`profile_${walletAddress}`, JSON.stringify(newProfile))

            setShowProfileSetup(true)
          }

          const isCorrectNetwork = chainId === ARBITRUM_SEPOLIA_CHAIN_ID || chainId === "421614" || parseInt(chainId, 16) === 421614
          if (!isCorrectNetwork) {
            toast({
              title: "Wrong Network",
              description: "Please switch to Arbitrum Sepolia network",
              variant: "destructive",
            })
          }
        }
      } else {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Web3 wallet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress(undefined)
    setUserProfile(null)
    setCurrentNetwork(undefined)
    setShowProfileSetup(false)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const switchToArbitrumSepolia = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // First try to switch to the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
        })
        
        // If successful, show success message
        toast({
          title: "Network Switched",
          description: "Successfully switched to Arbitrum Sepolia",
        })
        
        // Update the current network state
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        setCurrentNetwork(chainId)
        
      } catch (switchError: any) {
        console.error("Network switch error:", switchError)
        
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [ARBITRUM_SEPOLIA_CONFIG],
            })
            
            toast({
              title: "Network Added",
              description: "Arbitrum Sepolia network has been added to your wallet",
            })
            
            // Update the current network state
            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            setCurrentNetwork(chainId)
            
          } catch (addError: any) {
            console.error("Add network error:", addError)
            toast({
              title: "Network Switch Failed",
              description: `Failed to add Arbitrum Sepolia network: ${addError.message || 'Unknown error'}`,
              variant: "destructive",
            })
          }
        } else if (switchError.code === 4001) {
          // User rejected the request
          toast({
            title: "Network Switch Cancelled",
            description: "You cancelled the network switch request",
            variant: "destructive",
          })
        } else {
          // Other errors
          toast({
            title: "Network Switch Failed",
            description: `Failed to switch to Arbitrum Sepolia: ${switchError.message || 'Unknown error'}`,
            variant: "destructive",
          })
        }
      }
    } else {
      toast({
        title: "Wallet Not Found",
        description: "Please make sure MetaMask is installed and unlocked",
        variant: "destructive",
      })
    }
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (userProfile && address) {
      const updatedProfile = { ...userProfile, ...updates }
      setUserProfile(updatedProfile)
      localStorage.setItem(`profile_${address}`, JSON.stringify(updatedProfile))
    }
  }

  const joinEvent = (eventId: string) => {
    if (userProfile && address) {
      const updatedProfile = {
        ...userProfile,
        registeredEvents: [...userProfile.registeredEvents, eventId],
      }
      setUserProfile(updatedProfile)
      localStorage.setItem(`profile_${address}`, JSON.stringify(updatedProfile))
    }
  }

  const markEventAttended = (eventId: string, pointsEarned = 0) => {
    if (userProfile && address) {
      const updatedProfile = {
        ...userProfile,
        attendedEvents: [...userProfile.attendedEvents, eventId],
        eventsAttended: userProfile.eventsAttended + 1,
        totalPoints: userProfile.totalPoints + pointsEarned,
      }
      setUserProfile(updatedProfile)
      localStorage.setItem(`profile_${address}`, JSON.stringify(updatedProfile))
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        isConnecting,
        currentNetwork,
        connect: handleConnect,
        disconnect: handleDisconnect,
        switchToArbitrumSepolia,
        userProfile,
        updateProfile,
        joinEvent,
        markEventAttended,
        showProfileSetup,
        setShowProfileSetup,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
  }
}
