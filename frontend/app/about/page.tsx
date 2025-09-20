import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-foreground glow-text font-[family-name:var(--font-orbitron)] tracking-wider mb-6">
              ZYNQTRA
            </h1>
            <p className="text-xl text-muted-foreground font-[family-name:var(--font-inter)] leading-relaxed">
              The future of Web3 networking and event management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glassmorphism bg-card/50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-accent mb-4 font-[family-name:var(--font-rajdhani)]">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                ZYNQTRA revolutionizes networking by combining blockchain technology with gamified social interactions.
                We create meaningful connections through innovative QR code scanning, challenges, and reward systems.
              </p>
            </div>

            <div className="glassmorphism bg-card/50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-accent mb-4 font-[family-name:var(--font-rajdhani)]">
                Web3 Innovation
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Built on Arbitrum Sepolia testnet, ZYNQTRA leverages blockchain technology to create verifiable
                networking achievements, NFT badges, and a transparent point system that rewards genuine engagement.
              </p>
            </div>
          </div>

          <div className="glassmorphism bg-card/50 p-8 rounded-xl mb-12">
            <h2 className="text-3xl font-bold text-accent mb-6 font-[family-name:var(--font-rajdhani)] text-center">
              Data Architecture
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-bold text-green-400 mb-3 font-[family-name:var(--font-rajdhani)]">
                  🔗 On-Chain Storage
                </h3>
                <p className="text-sm text-green-300 mb-3 font-semibold">Arbitrum Testnet Smart Contracts + IPFS</p>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Profile activities & achievements</li>
                  <li>• Points & rewards system</li>
                  <li>• Connection records</li>
                  <li>• User interests & preferences</li>
                  <li>• Available NFT badges & certifications</li>
                  <li>• Immutable profile data on IPFS</li>
                </ul>
                <p className="text-xs text-green-400 mt-3 italic">For transparency & verifiability</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-bold text-blue-400 mb-3 font-[family-name:var(--font-rajdhani)]">
                  💾 Off-Chain Storage
                </h3>
                <p className="text-sm text-blue-300 mb-3 font-semibold">Supabase/PostgreSQL + AWS S3</p>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Event details & descriptions</li>
                  <li>• Challenge content & media</li>
                  <li>• Organizer analytics</li>
                  <li>• Event media & assets</li>
                  <li>• Real-time messaging</li>
                  <li>• Temporary session data</li>
                </ul>
                <p className="text-xs text-blue-400 mt-3 italic">For scalability & performance</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-center text-muted-foreground text-sm">
                <span className="text-accent font-semibold">Connected through wallet login:</span> Your wallet serves as
                the bridge between on-chain achievements and off-chain event experiences, all displayed seamlessly on
                the frontend.
              </p>
            </div>
          </div>

          <div className="glassmorphism bg-card/50 p-8 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-accent mb-6 font-[family-name:var(--font-rajdhani)]">
              Join the Future of Networking
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Connect your wallet, attend events, complete challenges, and earn rewards while building meaningful
              professional relationships in the Web3 ecosystem.
            </p>
          </div>

          <div className="glassmorphism bg-card/50 p-8 rounded-xl text-center mt-8">
            <h2 className="text-2xl font-bold text-accent mb-6 font-[family-name:var(--font-rajdhani)]">
              Connect With ZYNQTRA
            </h2>
            <div className="flex justify-center gap-8">
              <a
                href="https://t.me/zynqtra_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.507-1.123 1.507-1.123 1.507l-2.678-2.018-1.292 1.239c-.148.145-.272.268-.559.268-.374 0-.311-.139-.311-.139l.706-3.193L18.43 7.493c.311-.279-.068-.434-.068-.434-.442-.311-1.123.068-1.123.068l-7.22 4.613-3.193-.706s-.706-.311-.068-.934c0 0 .638-.311 1.292-.622L18.36 6.503c1.291-.622 2.018-.311 2.018 1.657z" />
                </svg>
              </a>

              <a
                href="https://discord.gg/zynqtra_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              <a
                href="https://twitter.com/zynqtra_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
