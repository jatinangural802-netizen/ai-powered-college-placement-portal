export default function LoadingSkeleton({ className = 'h-4' }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <LoadingSkeleton className="h-4 w-24" />
      <LoadingSkeleton className="h-8 w-16" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
