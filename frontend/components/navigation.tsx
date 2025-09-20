"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet, User, LogOut, Network } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isConnected, connect, disconnect, isConnecting, address, currentNetwork, switchToArbitrumSepolia } =
    useWallet()

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/join-event" },
    { name: "Global Leaderboard", href: "/leaderboard" },
  ]

  // Handle both hex and decimal chain ID formats
  const isOnCorrectNetwork = currentNetwork === "0x66eee" || currentNetwork === "421614" || parseInt(currentNetwork || "0", 16) === 421614
  const networkName = isOnCorrectNetwork ? "Arbitrum Sepolia" : "Wrong Network"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism bg-card/80">
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <img 
                src="/zynqtralogobg.png" 
                alt="Zynqtra Logo" 
                className="h-16 w-16 object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <h1 className="text-2xl font-black text-foreground glow-text font-[family-name:var(--font-orbitron)] tracking-wider cursor-pointer group-hover:glow-text">
                ZYNQTRA
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-all duration-300 px-3 py-2 text-sm font-[family-name:var(--font-rajdhani)] font-bold tracking-wide hover:glow-text uppercase ${
                    pathname === item.href ? "text-accent glow-text" : "text-muted-foreground hover:text-accent"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`glassmorphism bg-transparent ${
                        !isOnCorrectNetwork ? "border-red-500 text-red-500 animate-pulse" : ""
                      }`}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      {!isOnCorrectNetwork ? "Wrong Network" : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glassmorphism bg-card/95">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Network:{" "}
                      <span className={isOnCorrectNetwork ? "text-green-500" : "text-red-500"}>{networkName}</span>
                    </div>
                    <DropdownMenuSeparator />
                    {!isOnCorrectNetwork && (
                      <>
                        <DropdownMenuItem onClick={switchToArbitrumSepolia}>
                          <Network className="w-4 h-4 mr-2" />
                          Switch to Arbitrum Sepolia
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={disconnect} className="text-red-500">
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                className="glassmorphism bg-transparent"
                onClick={connect}
                disabled={isConnecting}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glassmorphism bg-card/90 rounded-lg mt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-[family-name:var(--font-rajdhani)] font-bold tracking-wide transition-all duration-300 hover:glow-text uppercase ${
                    pathname === item.href ? "text-accent glow-text" : "text-muted-foreground hover:text-accent"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground px-3">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                    <div className="text-xs text-muted-foreground px-3">
                      Network:{" "}
                      <span className={isOnCorrectNetwork ? "text-green-500" : "text-red-500"}>{networkName}</span>
                    </div>
                    {!isOnCorrectNetwork && (
                      <Button
                        variant="outline"
                        className="w-full glassmorphism bg-transparent text-xs border-red-500 text-red-500"
                        onClick={switchToArbitrumSepolia}
                      >
                        <Network className="w-4 h-4 mr-2" />
                        Switch to Arbitrum Sepolia
                      </Button>
                    )}
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full glassmorphism bg-transparent">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full glassmorphism bg-transparent text-red-500"
                      onClick={disconnect}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full glassmorphism bg-transparent"
                    onClick={connect}
                    disabled={isConnecting}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
