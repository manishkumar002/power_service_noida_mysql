import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import WorkingProgress from "../components/WorkingProgress";
import { COMPANY } from "../config/company";
import CategoryCatalogCard from "../components/CategoryCatalogCard";
import ProductCard from "../components/ProductCard";
import EnquiryModal from "../components/EnquiryModal";
import NetworkBackground from "../components/NetworkBackground";
import OurSolutions from "../components/OurSolutions";
import SupportServices from "../components/SupportServices";

import { getCategories, getProducts, getErrorMessage } from "../api/services";

const Home = () => {
  const { searchQuery } = useOutletContext() || {};
  const [searchParams] = useSearchParams();

  const q = (searchParams.get("q") || searchQuery || "").trim();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const params = q ? { search: q } : {};

        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts(params),
        ]);

        setCategories(catRes?.data?.data || []);
        setProducts(prodRes?.data?.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [q]);

  const productsForCategory = (categoryId) =>
    products.filter((product) => {
      const productCategoryId = product.category?.id || product.category;
      return productCategoryId?.toString() === categoryId?.toString();
    });

  // Categories with products first, then rest — so home always fills 4 slots meaningfully
  // const catalogCategories = useMemo(() => {
  //   const withProducts = [];
  //   const withoutProducts = [];

  //   for (const category of categories) {
  //     if (productsForCategory(category.id).length > 0) {
  //       withProducts.push(category);
  //     } else {
  //       withoutProducts.push(category);
  //     }
  //   }

  //   return [...withProducts, ...withoutProducts].slice(0, 4);
  // }, [categories, products]);

  // Sirf wahi categories jinme product hain, maximum 4
  const catalogCategories = useMemo(
    () =>
      categories
        .filter((category) => productsForCategory(category.id).length > 0)
        .slice(0, 4),
    [categories, products],
  );

  const categoryProductSections = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          categoryProducts: productsForCategory(category.id).slice(0, 4),
        }))
        .filter(({ categoryProducts }) => categoryProducts.length > 0)
        .slice(0, 6),
    [categories, products],
  );

  // ================= ENQUIRY =================
  const openEnquiry = (product) => {
    setSelectedProduct(product);
    setShowEnquiry(true);
  };

  return (
    <>
      <div className="container-fluid">
        <NetworkBackground />

        <Container fluid="lg">
          <Row className="align-items-center g-4">
            {/* HERO CONTENT */}
            <Col lg={7}>
              <span className="hero-tag mt-2">Power Backup Solutions</span>

              <h1 className="mt-4 section-heading">
                Trusted <span className="gradient-text">Online UPS</span> &amp;{" "}
                <span className="gradient-text">Industrial Power</span> Partner
              </h1>

              <p className="hero-lead">
                {COMPANY.tagline}. {COMPANY.about}
              </p>

              <div className="hero-actions">
                <Link to="/products" className="btn-get-quote">
                  View All Products
                </Link>

                <a href={`tel:${COMPANY.phone}`} className="btn-hero-outline">
                  📞 Call Now
                </a>
              </div>
            </Col>

            {/* HERO STATS */}
            <Col lg={5}>
              <div className="hero-stats-grid">
                <div>
                  <strong style={{ color: "#16a34a" }}>1500+</strong>
                  <span>Happy Clients</span>
                </div>

                <div>
                  <strong style={{ color: "#16a34a" }}>25+</strong>
                  <span>Years Experience</span>
                </div>

                <div>
                  <strong style={{ color: "#16a34a" }}>1200</strong>
                  <span>kVA Capacity</span>
                </div>

                <div>
                  <strong style={{ color: "#16a34a" }}>PAN</strong>
                  <span>India Service</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container fluid="lg" className="py-5">
        <div className="section-header mb-5">
          <div>
            <h2 className="section-heading">
              Products &amp; <span className="gradient-text">Services</span>
            </h2>

            <p className="catalog-page-intro mb-0">
              Abhion Power is successful when your business is successful. "That
              is our fundamental business philosophy We pride ourselves in
              providing the services in the most efficient manner and also for
              the timely execution and customization installation
            </p>
          </div>

          <Link to="/products" className="view-all-link">
            View All Category →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : q ? (
          <>
            {/* <h3 className="section-title mb-4">Search: &quot;{q}&quot;</h3> */}

            {products.length > 0 ? (
              <Row className="g-3">
                {products.map((product) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard product={product} onEnquire={openEnquiry} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <h4>No products found</h4>

                <p className="text-muted">No products matched your search.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <Row className="g-4 catalog-grid mb-5">
              {catalogCategories.map((category) => (
                <Col xs={12} sm={6} lg={3} key={category.id}>
                  <CategoryCatalogCard
                    category={category}
                    products={productsForCategory(category.id)}
                  />
                </Col>
              ))}
            </Row>

            {/* =================================================
                CATEGORY WISE PRODUCTS
            ================================================== */}
            {categoryProductSections.map(({ category, categoryProducts }) => (
              <div className="mb-5" key={category.id}>
                <div className="mb-4 d-flex align-items-center justify-content-between">
                  <h2
                    className="mb-0"
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {category.name}
                  </h2>

                  <Link
                    to={`/category/${category.slug}`}
                    className="view-all-link"
                    style={{
                      fontSize: "14px",
                      padding: "6px 12px",
                      border: "1px solid #08f50c",
                      borderRadius: "6px",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View All →
                  </Link>
                </div>
                <Row className="g-3">
                  {categoryProducts.map((product) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <ProductCard product={product} onEnquire={openEnquiry} />
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </>
        )}
        {!q && products.length > 0 && (
          <>
            <h2 className="section-heading mb-5 text-center">
              Featured <span className="gradient-text">Products</span>
            </h2>

            <Row className="g-3">
              {products
                .filter((product) => product.isFeatured)
                .slice(0, 4)
                .map((product) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard product={product} onEnquire={openEnquiry} />
                  </Col>
                ))}
            </Row>
          </>
        )}

        {/* ============= */}
        <WorkingProgress />
        <SupportServices />
        <OurSolutions />

        {/* =============== */}
      </Container>

      <EnquiryModal
        show={showEnquiry}
        onHide={() => setShowEnquiry(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default Home;
