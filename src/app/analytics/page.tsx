"use client";

import dynamic from "next/dynamic";
import { useDemos } from "@/hooks/useDemos";
import { useSession } from "@/hooks/useSession";
import { LoginForm } from "@/components/auth/LoginForm";
import { createAuthBrowserClient } from "@/lib/supabase/authClient";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";

const AnalyticsDashboard = dynamic(
  () =>
    import("@/app/analytics/AnalyticsDashboard").then(
      (m) => m.AnalyticsDashboard
    ),
  {
    ssr: false,
    loading: () => (
      <div className="pt-16 px-4 space-y-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    ),
  }
);

export default function AnalyticsPage() {
  const { session, isLoading: sessionLoading } = useSession();
  const { demos, lastUpdated, isLoading: demosLoading } = useDemos();

  if (sessionLoading) {
    return (
      <div className="pt-16 px-4 space-y-4">
        <ChartSkeleton />
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  const handleLogout = async () => {
    const supabase = createAuthBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (demosLoading) {
    return (
      <div className="pt-16 px-4 space-y-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-0 right-0 z-50 p-3">
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>
      <AnalyticsDashboard demos={demos} lastUpdated={lastUpdated} />
    </div>
  );
}
