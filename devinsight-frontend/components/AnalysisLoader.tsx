export default function AnalysisLoader() {

  return (

    <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-6 rounded-xl">

      <h3 className="font-semibold text-[var(--foreground)]">
        Analyzing Repository
      </h3>

      <div className="mt-4 animate-pulse space-y-3">

        <div className="h-4 bg-[var(--border)] rounded"></div>
        <div className="h-4 bg-[var(--border)] rounded"></div>
        <div className="h-4 bg-[var(--border)] rounded"></div>

      </div>

    </div>

  )

}
