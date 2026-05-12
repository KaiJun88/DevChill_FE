
export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, itemName = "mục" }) {
  const currentTotal = Math.min(currentPage * itemsPerPage, totalItems);
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  function getPageNumbers() {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 4) end = 5;
      if (currentPage >= totalPages - 3) start = totalPages - 4;

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 3) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-gray-500 font-medium font-sans">
        Hiển thị <span className="text-gray-900 font-bold">{startIdx}-{currentTotal}</span> trong tổng số <span className="text-gray-900 font-bold">{totalItems}</span> {itemName}
      </div>
      
      <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-100 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
          >
            <span className="text-lg font-bold">‹</span>
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400 font-bold select-none cursor-default">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all border font-sans ${
                  currentPage === page 
                  ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20 active:scale-95' 
                  : 'bg-gray-100 border-gray-100 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 active:scale-90'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-100 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
          >
            <span className="text-lg font-bold">›</span>
          </button>
      </div>
   </div>
  );
}
