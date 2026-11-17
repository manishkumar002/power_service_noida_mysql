import { Link } from "react-router-dom";
import { getCategoryImage, getImageUrl } from "../utils/image";

const CategoryCatalogCard = ({ category, products }) => {
  const categoryImage = getCategoryImage(category);

  return (
    <div className="catalog-card">
      <Link to={`/category/${category.slug}`} className="catalog-card-img-wrap">
        {categoryImage ? (
          <img
            src={getImageUrl(categoryImage)}
            alt={category.name}
            style={{
              objectFit: "cover",
            }}
          />
        ) : (
          <div className="catalog-card-img-placeholder">
            <span>{category.icon || "⚡"}</span>
          </div>
        )}
      </Link>

      <div className="catalog-card-body">
        <Link to={`/category/${category.slug}`} className="catalog-card-title">
          {category.name}
        </Link>

        <ul className="catalog-product-list">
          {products.slice(0, 4).map((p) => (
            <li key={p.id}>
              <Link to={`/category/${category.slug}`}>{p.name}</Link>
            </li>
          ))}

          {products.length === 0 && (
            <li className="text-muted">Products coming soon</li>
          )}
        </ul>

        <Link to={`/category/${category.slug}`} className="catalog-view-all">
          View Complete Range →
        </Link>
      </div>
    </div>
  );
};

export default CategoryCatalogCard;
