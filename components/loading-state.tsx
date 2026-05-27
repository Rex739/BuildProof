export function LoadingState({ label = "Loading local demo data..." }: { label?: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-card p-5 text-sm text-muted-foreground">
      <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-sky-300" />
      {label}
    </div>
  );
}
