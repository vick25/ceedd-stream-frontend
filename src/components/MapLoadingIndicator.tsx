export const MapLoadingIndicator = ({
  loaded,
  total,
}: {
  loaded: number;
  total: number;
}) => {
  const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <div className="absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur-md shadow-md rounded-lg px-4 py-3 text-xs w-44">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="font-semibold text-gray-700">Loading data…</span>
      </div>

      <div className="text-gray-600 mb-1">
        {loaded} / {total} features
      </div>

      <div className="w-full h-1.5 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-600 rounded transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
