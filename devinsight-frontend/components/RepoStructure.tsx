export default function RepoStructure({ structure }: any) {
  return (
    <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl h-[400px] flex flex-col">
      <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Repository Structure
        </h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="bg-[var(--background)] p-4 rounded text-sm text-[var(--foreground-secondary)] whitespace-pre-wrap break-all">
          {JSON.stringify(structure, null, 2)}
        </pre>
      </div>
    </div>
  );
}
