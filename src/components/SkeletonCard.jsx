export default function SkeletonCard() {
  return (
    <div className="bg-gray-800 animate-pulse rounded-lg overflow-hidden">
      <div className="h-64 bg-gray-700"></div>
      <div className="p-3">
        <div className="h-4 bg-gray-600 mb-2 rounded"></div>
        <div className="h-3 bg-gray-600 w-2/3 rounded"></div>
      </div>
    </div>
  );
}
