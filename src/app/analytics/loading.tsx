import { ChartSkeleton } from "@/components/ui/ChartSkeleton";

export default function AnalyticsLoading() {
  return (
    <div className="pt-16 pb-8 px-4 max-w-7xl mx-auto">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton heightClass="h-[200px]" type="card" />
        <ChartSkeleton heightClass="h-[200px]" type="heatmap" />
        <div className="md:col-span-2">
          <ChartSkeleton heightClass="h-[350px]" type="area" />
        </div>
        <ChartSkeleton heightClass="h-[300px]" type="heatmap" />
        <ChartSkeleton heightClass="h-[400px]" type="bar" />
        <div className="md:col-span-2">
          <ChartSkeleton heightClass="h-[400px]" type="bar" />
        </div>
      </div>
    </div>
  );
}
