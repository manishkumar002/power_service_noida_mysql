import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { formatPrice } from "../utils/format";
import { getProductImages, getImageUrl } from "../utils/image";

const ProductCard = ({ product, onEnquire }) => {
  const images = getProductImages(product);
  const mainImage = images[0];

  const handleInterest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEnquire(product);
  };

  return (
    <article className="product-card sh-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="product-card-img">
          {mainImage ? (
            <img
              src={getImageUrl(mainImage)}
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <div className="product-card-placeholder">
              <span>{product.category?.icon || "⚡"}</span>
            </div>
          )}
        </div>
        <div className="product-card-body">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-price">
            {formatPrice(product.price, product.priceUnit)}
          </p>
          {product.specs?.length > 0 && (
            <ul className="product-spec-list small text-muted mb-3">
              {product.specs.slice(0, 4).map((s) => (
                <li key={s.key}>
                  {s.key}: {s.value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3">
        <Button className="btn-get-quote w-100" onClick={handleInterest}>
          Yes, I am interested
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
