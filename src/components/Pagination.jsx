export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 my-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        title="Trang đầu"
      >
        {"<<"}
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        title="Trang trước"
      >
        {"<"}
      </button>
      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ${
            p === currentPage
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        title="Trang tiếp"
      >
        {">"}
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        title="Trang cuối"
      >
        {">>"}
      </button>
    </div>
  );
}
