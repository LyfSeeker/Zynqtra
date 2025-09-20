import { Navigation } from "@/components/navigation"
import { MinimalHero } from "@/components/minimal-hero"
import { FeaturePreview } from "@/components/feature-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <MinimalHero />
        <FeaturePreview />
      </main>
    </div>
  )
}
