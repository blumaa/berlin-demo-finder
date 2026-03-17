interface ChartSkeletonProps {
  height?: number;
  type?: "bar" | "area" | "heatmap" | "card";
}

export function ChartSkeleton({ height = 300, type = "bar" }: ChartSkeletonProps) {
  return (
    <div
      className="animate-pulse rounded-lg bg-gray-100 p-4"
      style={{ height }}
    >
      <div className="h-4 w-1/3 rounded bg-gray-200 mb-4" />
      {type === "card" ? (
        <div className="space-y-3">
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      ) : type === "heatmap" ? (
        <div className="grid grid-cols-12 gap-1 mt-4">
          {Array.from({ length: 84 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-2 mt-8 h-2/3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gray-200"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
