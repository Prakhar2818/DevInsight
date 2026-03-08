export default function LoadingCard() {
  return (
    <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-[var(--border)] rounded w-1/3"></div>

      <div className="mt-4 h-4 bg-[var(--border)] rounded"></div>

      <div className="mt-2 h-4 bg-[var(--border)] rounded"></div>
    </div>
  );
}
