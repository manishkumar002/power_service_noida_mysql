import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { COMPANY } from "../config/company";
import { formatPrice } from "../utils/format";
import { getProductImages, getImageUrl } from "../utils/image";

const CategoryProductListing = ({ product, onEnquire }) => {
  const images = getProductImages(product);
  const [activeImg, setActiveImg] = useState(0);

  return (
    <article className="category-product-block sh-card">
      <div className="cpb-header">
        <h2 className="cpb-title">{product.name}</h2>
        <a href={`tel:${COMPANY.phone}`} className="cpb-callback-btn">
          📞 Request Callback
        </a>
      </div>

      <div className="cpb-body">
        <div className="cpb-gallery">
          <Link to={`/product/${product.slug}`} className="cpb-main-img">
            {images.length > 0 ? (
              <img src={getImageUrl(images[activeImg])} alt={product.name} />
            ) : (
              <div className="cpb-img-placeholder">
                <span>{product.category?.icon || "⚡"}</span>
              </div>
            )}
          </Link>

          {images.length > 1 && (
            <div
              className="cpb-thumbs-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Left Button */}
              <button
                type="button"
                onClick={() => setActiveImg(Math.max(0, activeImg - 1))}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                ‹
              </button>

              {/* Thumbnails */}
              <div
                className="cpb-thumbs"
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    className={`cpb-thumb${idx === activeImg ? " active" : ""}`}
                    onClick={() => setActiveImg(idx)}
                    style={{
                      border: "none",
                      padding: 0,
                      background: "transparent",
                    }}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Right Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveImg(Math.min(images.length - 1, activeImg + 1))
                }
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                ›
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn-get-quote"
            onClick={() => onEnquire(product)}
          >
            Get Best Quote
          </button>
        </div>

        <div className="cpb-details">
          <div className="cpb-price-row">
            <span className="cpb-price">
              {formatPrice(product.price, product.priceUnit)}
            </span>
          </div>

          {product.brochure && (
            <a
              href={getImageUrl(product.brochure)}
              target="_blank"
              rel="noreferrer"
              className="cpb-brochure"
            >
              📄 Product Brochure
            </a>
          )}

          {product.specs?.length > 0 && (
            <table className="cpb-spec-table">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.key}>
                    <th>{s.key}</th>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {product.minOrderQuantity > 0 && (
            <p className="cpb-moq small text-muted">
              Minimum order quantity: {product.minOrderQuantity}{" "}
              {product.priceUnit}
            </p>
          )}

          {product.description && (
            <p className="cpb-desc">{product.description}</p>
          )}

          <p className="cpb-sold-by">
            Sold By — <strong>{COMPANY.name}</strong>
          </p>

          <div className="cpb-actions">
            <Button
              className="btn-get-quote"
              onClick={() => onEnquire(product)}
            >
              ✉ Yes! I am interested
            </Button>{" "}
            <Link
              to={`/product/${product.slug}`}
              className="cpb-view-link"
              style={{ textDecoration: "none", color: "#22c55e" }}
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CategoryProductListing;
