import { ChartSkeleton } from "@/components/ui/ChartSkeleton";

export default function AnalyticsLoading() {
  return (
    <div className="pt-16 pb-8 px-4 max-w-7xl mx-auto">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton height={200} type="card" />
        <ChartSkeleton height={200} type="heatmap" />
        <div className="md:col-span-2">
          <ChartSkeleton height={350} type="area" />
        </div>
        <ChartSkeleton height={300} type="heatmap" />
        <ChartSkeleton height={400} type="bar" />
        <div className="md:col-span-2">
          <ChartSkeleton height={400} type="bar" />
        </div>
      </div>
    </div>
  );
}
