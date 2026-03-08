export default function IntelligenceView({ analysis }: any) {

  return (

    <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4 flex-1">

      <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        Architecture Explanation
      </h3>

      <div className="text-[var(--foreground-secondary)]">
        <p className="whitespace-pre-wrap">{analysis}</p>
      </div>

    </div>

  )

}
