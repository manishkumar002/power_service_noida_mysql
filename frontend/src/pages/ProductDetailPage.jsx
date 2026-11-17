import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb";
import EnquiryModal from "../components/EnquiryModal";
import { getProductById, getErrorMessage } from "../api/services";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatPrice } from "../utils/format";
import { getProductImages, getImageUrl } from "../utils/image";
import { COMPANY } from "../config/company";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(slug)
      .then(({ data }) => {
        setProduct(data.data);
        setActiveImg(0);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  usePageMeta(
    product?.name || "Product",
    product?.description?.slice(0, 160) || "Get best quote for UPS products.",
  );

  const images = getProductImages(product);

  const prevImg = () =>
    setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () =>
    setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-wrap">
        <style>{pdStyles}</style>
        <div className="pd-notfound">Product not found.</div>
      </div>
    );
  }

  const catSlug = product.category?.slug;

  return (
    <div className="pd-wrap">
      <style>{pdStyles}</style>

      <div className="pd-crumb-bar">
        <div className="pd-crumb-inner">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              ...(catSlug
                ? [{ label: product.category.name, to: `/category/${catSlug}` }]
                : []),
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="pd-card">
        <div className="pd-header">
          <div>
            {product.category?.name && (
              <span className="pd-cat-tag">{product.category.name}</span>
            )}
            <h1 className="pd-title">{product.name}</h1>
          </div>
          <a href={`tel:${COMPANY.phone}`} className="pd-callback-btn">
            📞 Request Callback
          </a>
        </div>

        <div className="pd-body">
          <div className="pd-gallery-col">
            <div className="pd-main-img">
              {images.length > 0 ? (
                <img src={getImageUrl(images[activeImg])} alt={product.name} />
              ) : (
                <div className="pd-img-placeholder">
                  <span>{product.category?.icon || "⚡"}</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="pd-thumbs-row">
                <button
                  type="button"
                  className="pd-thumb-nav"
                  onClick={prevImg}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <div className="pd-thumbs">
                  {images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      className={`pd-thumb${idx === activeImg ? " active" : ""}`}
                      onClick={() => setActiveImg(idx)}
                    >
                      <img src={getImageUrl(img)} alt="" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="pd-thumb-nav"
                  onClick={nextImg}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            )}

            {product.description && (
              <div className="pd-desc-block">
                <h2 className="pd-block-title">Overview</h2>
                <p className="pd-desc">{product.description}</p>
              </div>
            )}

            {product.technicalDetails && (
              <div className="pd-tech-details">
                <h2 className="pd-block-title">Technical Specifications</h2>
                <pre>{product.technicalDetails}</pre>
              </div>
            )}
          </div>

          <div className="pd-info-col">
            <div className="pd-buybox">
              <div className="pd-price-row">
                <span className="pd-price">
                  {formatPrice(product.price, product.priceUnit)}
                </span>
              </div>

              {product.minOrderQuantity > 0 && (
                <p className="pd-moq">
                  Min. order quantity —{" "}
                  <strong>
                    {product.minOrderQuantity} {product.priceUnit}
                  </strong>
                </p>
              )}

              <button
                type="button"
                className="pd-quote-btn"
                onClick={() => setShowEnquiry(true)}
              >
                Get Best Quote
              </button>
              <button
                type="button"
                className="pd-interested-btn"
                onClick={() => setShowEnquiry(true)}
              >
                ✉ Yes! I am interested
              </button>

              {product.brochure && (
                <a
                  href={getImageUrl(product.brochure)}
                  target="_blank"
                  rel="noreferrer"
                  className="pd-brochure"
                >
                  📄 Download Brochure
                </a>
              )}

              <p className="pd-sold-by">
                Sold by <strong>{COMPANY.name}</strong>
              </p>
            </div>

            {product.specs?.length > 0 && (
              <div className="pd-specs-card">
                <h2 className="pd-block-title">Specifications</h2>
                <table className="pd-spec-table">
                  <tbody>
                    {product.specs.map((s) => (
                      <tr key={s.key}>
                        <th>{s.key}</th>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {catSlug && (
              <Link to={`/category/${catSlug}`} className="pd-back-link">
                View all {product.category.name} products
              </Link>
            )}
          </div>
        </div>
      </div>

      <EnquiryModal
        show={showEnquiry}
        onHide={() => setShowEnquiry(false)}
        product={product}
      />
    </div>
  );
};

const pdStyles = `
  .pd-wrap {
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    min-height: 100%;
    padding-bottom: 48px;
  }

  .pd-notfound {
    max-width: 480px;
    margin: 60px auto;
    text-align: center;
    padding: 32px;
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e4e8ef;
    color: #5c6b82;
  }

  .pd-crumb-bar {
    padding: 14px 0;
  }
  .pd-crumb-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .pd-crumb-bar a {
    color: #19191a;
  }
  .pd-crumb-bar,
  .pd-crumb-bar * {
    color: #1f6ce8;
    font-size: 13px;
  }

  .pd-card {
    max-width: 1120px;
    margin: 24px auto 0;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e4e8ef;
    overflow: hidden;
  } 

  .pd-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 26px 30px 18px;
    border-bottom: 1px solid #edf0f4;
  }
  .pd-cat-tag {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    color: #c97c10;
    background: #fff3e2;
    padding: 3px 10px;
    border-radius: 20px;
    margin-bottom: 8px;
  }
  .pd-title {
    font-size: 25px;
    font-weight: 700;
    color: #10233f;
    margin: 0;
    line-height: 1.3;
  }
  .pd-callback-btn {
    flex-shrink: 0;
    border: 1.5px solid #10233f;
    color: #10233f;
    background: #fff;
    font-weight: 600;
    font-size: 13.5px;
    padding: 9px 16px;
    border-radius: 9px;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .pd-callback-btn:hover {
    background: #10233f;
    color: #fff;
  }

  .pd-body {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 32px;
    padding: 26px 30px 32px;
    align-items: start;
  }

  .pd-main-img {
    background: #f7f8fb;
    border: 1px solid #edf0f4;
    border-radius: 12px;
    aspect-ratio: 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .pd-main-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .pd-img-placeholder {
    font-size: 48px;
    color: #c5cdd9;
  }

  .pd-thumbs-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }
  .pd-thumb-nav {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #dfe4ec;
    background: #fff;
    color: #10233f;
    font-size: 16px;
    cursor: pointer;
  }
  .pd-thumbs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }
  .pd-thumb {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    border: 1.5px solid #e4e8ef;
    background: #fff;
    padding: 2px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .pd-thumb.active { border-color: #e08c1a; }
  .pd-thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .pd-block-title {
    font-size: 15px;
    font-weight: 700;
    color: #10233f;
    margin: 0 0 10px;
  }
  .pd-desc-block { margin-top: 26px; }
  .pd-desc {
    font-size: 14.5px;
    line-height: 1.65;
    color: #454e5c;
    margin: 0;
    max-width: 62ch;
  }

  .pd-tech-details { margin-top: 26px; }
  .pd-tech-details pre {
    background: #f7f8fb;
    border: 1px solid #edf0f4;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
    color: #3a4351;
    white-space: pre-wrap;
    font-family: inherit;
    margin: 0;
  }

  .pd-info-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pd-buybox {
    border: 1.5px solid #edf0f4;
    border-radius: 14px;
    padding: 22px;
    background: #fbfcfe;
  }
  .pd-price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
  }
  .pd-price {
    font-size: 24px;
    font-weight: 700;
    color: #10233f;
  }
  .pd-price-link {
    border: none;
    background: none;
    color: #e08c1a;
    font-weight: 600;
    font-size: 12.5px;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .pd-moq {
    font-size: 13px;
    color: #6b7686;
    margin: 0 0 18px;
  }

  .pd-quote-btn, .pd-interested-btn {
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 12px;
    font-size: 14.5px;
    font-weight: 650;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background 0.15s ease, opacity 0.15s ease;
  }
  .pd-quote-btn {
  background: linear-gradient(90deg, #0f1110 0%, #22c55e 100%);
    color: #fff;
  }
  .pd-quote-btn:hover { background: #c97c10; }
  .pd-interested-btn {
    background: #10233f;
    color: #fff;
  }
  .pd-interested-btn:hover { opacity: 0.9; }

  .pd-brochure {
    display: block;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #10233f;
    text-decoration: none;
    padding: 9px 0 2px;
    border-top: 1px dashed #e4e8ef;
    margin-top: 8px;
  }
  .pd-brochure:hover { color: #e08c1a; }

  .pd-sold-by {
    text-align: center;
    font-size: 12.5px;
    color: #8592a6;
    margin: 12px 0 0;
  }
  .pd-sold-by strong { color: #10233f; }

  .pd-specs-card {
    border: 1.5px solid #edf0f4;
    border-radius: 14px;
    padding: 20px 22px;
  }
  .pd-spec-table {
    width: 100%;
    border-collapse: collapse;
  }
  .pd-spec-table tr {
    border-bottom: 1px dashed #edf0f4;
  }
  .pd-spec-table tr:last-child { border-bottom: none; }
  .pd-spec-table th, .pd-spec-table td {
    text-align: left;
    padding: 8px 0;
    font-size: 13.5px;
    font-weight: 400;
    vertical-align: top;
  }
  .pd-spec-table th {
    color: #8592a6;
    width: 46%;
    font-weight: 500;
  }
  .pd-spec-table td {
    color: #1c2430;
    font-weight: 600;
  }

  .pd-back-link {
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #10233f;
    text-decoration: none;
    padding: 4px 0;
  }
  .pd-back-link:hover { color: #e08c1a; }

  @media (max-width: 860px) {
    .pd-body { grid-template-columns: 1fr; }
    .pd-header { flex-direction: column; }
    .pd-callback-btn { align-self: flex-start; }
  }
`;

export default ProductDetailPage;
