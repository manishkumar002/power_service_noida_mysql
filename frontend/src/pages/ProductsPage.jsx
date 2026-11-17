import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb";
import CategoryCatalogCard from "../components/CategoryCatalogCard";
import { COMPANY } from "../config/company";
import { getCategories, getProducts, getErrorMessage } from "../api/services";

const ProductsPage = () => (
  <div className="products-page">
    <Container fluid="lg" className="py-4">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Products & Services" }]}
      />
      <h1 className="catalog-page-title">Products &amp; Services</h1>
      <p className="catalog-page-intro">
        {COMPANY.name} is a leading trader and dealer of Online UPS, Three Phase
        UPS, Industrial UPS, Refurbished UPS, UPS Rental, Repair &amp; AMC
        services across India. Browse categories below or search for specific
        products.
      </p>
      <ProductsGrid />
    </Container>
  </div>
);

const ProductsGrid = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getProducts({})])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Row className="g-4 catalog-grid">
      {categories.map((cat) => {
        const items = products.filter(
          (p) =>
            (p.category?.id || p.category)?.toString() === cat.id.toString(),
        );
        return (
          <Col xs={12} sm={6} lg={3} key={cat.id}>
            <CategoryCatalogCard category={cat} products={items} />
          </Col>
        );
      })}
    </Row>
  );
};

export default ProductsPage;
