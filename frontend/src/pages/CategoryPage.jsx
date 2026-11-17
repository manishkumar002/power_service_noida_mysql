import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb";
import CategorySidebar from "../components/CategorySidebar";
import CategoryProductListing from "../components/CategoryProductListing";
import EnquiryModal from "../components/EnquiryModal";
import { getCategories, getProducts, getErrorMessage } from "../api/services";
import { usePageMeta } from "../hooks/usePageMeta";

const CategoryPage = () => {
  const { slug } = useParams();
  const activeSlug = slug;

  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts({}),
        ]);
        setCategories(catRes.data.data || []);
        setAllProducts(prodRes.data.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const category = categories.find((c) => c.slug === slug) || null;

  usePageMeta(
    category?.name || "Category",
    category?.description ||
      `${category?.name || "UPS"} products — get best quote from Power Solution Services.`,
  );

  const products = useMemo(
    () =>
      category
        ? allProducts.filter(
            (p) =>
              (p.category?.id || p.category)?.toString() ===
              category.id.toString(),
          )
        : [],
    [allProducts, category],
  );

  const productCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat.id] = allProducts.filter(
        (p) => (p.category?.id || p.category)?.toString() === cat.id.toString(),
      ).length;
    });
    return counts;
  }, [categories, allProducts]);

  const openEnquiry = (product) => {
    setSelectedProduct(product);
    setShowEnquiry(true);
  };

  return (
    <div className="category-page">
      <div className="category-page-top">
        <div className="category-page-top-inner">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Products & Services", to: "/products" },
              { label: category?.name || slug },
            ]}
          />
        </div>
      </div>

      <div className="category-page-layout">
        <CategorySidebar
          categories={categories}
          products={allProducts}
          productCounts={productCounts}
          activeSlug={activeSlug}
        />

        <main className="category-main">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : !category ? (
            <div className="empty-state sh-card">Category not found.</div>
          ) : (
            <>
              <h1 className="section-heading">
                <span className="gradient-text">{category.name}</span>
              </h1>
              {category.description && (
                <p className="category-main-desc">{category.description}</p>
              )}

              {products.length === 0 ? (
                <div className="empty-state sh-card">
                  Is category me abhi koi product nahi hai. Admin panel se
                  product add karein.
                </div>
              ) : (
                <div className="category-products-list">
                  {products.map((p) => (
                    <div id={`product-${p.id}`} key={p.id}>
                      <CategoryProductListing
                        product={p}
                        onEnquire={openEnquiry}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <EnquiryModal
        show={showEnquiry}
        onHide={() => setShowEnquiry(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default CategoryPage;
