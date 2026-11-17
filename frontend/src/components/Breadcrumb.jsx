import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => (
  <nav className="site-breadcrumb" aria-label="breadcrumb">
    {items.map((item, i) => (
      <span key={item.label}>
        {i > 0 && <span className="bc-sep"> › </span>}
        {item.to && i < items.length - 1 ? (
          <Link to={item.to}>{item.label}</Link>
        ) : (
          <span className={i === items.length - 1 ? "bc-active" : ""}>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
