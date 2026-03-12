"use client"

import RepoInput from "@/components/RepoInput"
import FeatureGrid from "@/components/FeatureGrid"
import Hero from "@/components/Hero"
import MotionWrapper from "@/components/MotionWrapper"

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <MotionWrapper animation="slideUp" delay={0.3}>
          <RepoInput />
        </MotionWrapper>

        <FeatureGrid />
      </div>
    </main>
  )
}
