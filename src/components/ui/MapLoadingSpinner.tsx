export function MapLoadingSpinner() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  );
}
