
const Pagination = ({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
  showPrevNext = true
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 1, 2, 3 ... 8, 9, 10 pattern matching Figma
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Catalog pagination">
      {showPrevNext && (
        <button
          type="button"
          className="pagination__btn pagination__btn--prev"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          aria-label="Go to previous page"
        >
          <span className="pagination__arrow">←</span>
          <span className="pagination__btn-text">Previous</span>
        </button>
      )}

      <div className="pagination__numbers">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="pagination__ellipsis">
                ...
              </span>
            );
          }
          const isCurrent = currentPage === page;
          return (
            <button
              key={page}
              type="button"
              className={`pagination__page ${isCurrent ? "pagination__page--active" : ""}`}
              onClick={() => onPageChange && onPageChange(page)}
              aria-current={isCurrent ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {showPrevNext && (
        <button
          type="button"
          className="pagination__btn pagination__btn--next"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          aria-label="Go to next page"
        >
          <span className="pagination__btn-text">Next</span>
          <span className="pagination__arrow">→</span>
        </button>
      )}
    </nav>
  );
};

export default Pagination;
