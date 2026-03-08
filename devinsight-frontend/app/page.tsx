"use client"

import RepoInput from "@/components/RepoInput"
import FeatureGrid from "@/components/FeatureGrid"
import Hero from "@/components/Hero"

export default function Home() {

  return (

    <main className="bg-[var(--background)] min-h-screen">

      <Hero />

      <div className="max-w-6xl mx-auto px-6">

        <RepoInput />

        <FeatureGrid />

      </div>

    </main>

  )

}
