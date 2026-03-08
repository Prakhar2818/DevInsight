import FeatureCard from "./FeatureCard"
import { FaRobot, FaBug, FaCodeBranch, FaProjectDiagram } from "react-icons/fa"

export default function FeatureGrid() {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

      <FeatureCard
        icon={<FaCodeBranch />}
        title="Repository Analyzer"
        description="Analyze GitHub repository structure automatically"
      />

      <FeatureCard
        icon={<FaRobot />}
        title="AI Code Intelligence"
        description="Understand architecture and modules"
      />

      <FeatureCard
        icon={<FaBug />}
        title="Debug Assistant"
        description="Fix runtime errors faster"
      />

      <FeatureCard
        icon={<FaProjectDiagram />}
        title="Architecture Diagrams"
        description="Visualize project architecture"
      />

    </div>

  )
}