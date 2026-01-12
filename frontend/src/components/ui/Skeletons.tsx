interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <table className="w-full">
        {/* Header skeleton */}
        <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-20" />
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body skeleton */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[var(--border)]">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  {colIndex === 0 ? (
                    // Primera columna: Avatar + nombre + email
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--muted-foreground)]/20 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-32" />
                        <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-40" />
                      </div>
                    </div>
                  ) : (
                    // Otras columnas: Texto simple
                    <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-24" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton para cards del kanban
interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
}

export function KanbanSkeleton({ columns = 4, cardsPerColumn = 2 }: KanbanSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="flex flex-col">
          {/* Header de columna */}
          <div className="mb-4 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--muted-foreground)]/20 animate-pulse" />
              <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-20" />
              <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-8" />
            </div>
            <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-16" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3"
              >
                {/* Header: prioridad + avatar */}
                <div className="flex items-start justify-between mb-2">
                  <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-12" />
                  <div className="w-6 h-6 rounded-full bg-[var(--muted-foreground)]/20 animate-pulse" />
                </div>

                {/* Cliente */}
                <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-20 mb-1" />

                {/* Título */}
                <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-full mb-3" />

                {/* Footer: valor + fecha */}
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-12" />
                  <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton para métricas del dashboard
export function MetricCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-24" />
          <div className="h-8 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-32" />
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--muted-foreground)]/20 animate-pulse" />
      </div>
      <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-28" />
    </div>
  );
}

// Skeleton para gráfico del dashboard
export function ChartSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="h-5 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-40" />
          <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-48" />
        </div>
        <div className="h-6 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-24" />
      </div>
      
      {/* Gráfico simulado */}
      <div className="h-64 flex items-end gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-[var(--muted-foreground)]/20 rounded-t animate-pulse"
            style={{
              height: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
