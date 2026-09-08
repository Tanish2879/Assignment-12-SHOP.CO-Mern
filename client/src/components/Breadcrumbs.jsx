import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumbs__item">
              {item.path && !isLast ? (
                <Link to={item.path} className="breadcrumbs__link">
                  {item.label}
                </Link>
              ) : (
                <span className={`breadcrumbs__current ${isLast ? "breadcrumbs__current--active" : ""}`}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
