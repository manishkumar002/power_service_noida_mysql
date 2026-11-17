import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { COMPANY } from "../../config/company";
import { useAuth } from "../../context/AuthContext";
import { getCategories, getProducts } from "../../api/services";

const ABOUT_LINKS = [
  { to: "/about", label: "About Company", desc: "Who we are" },
  { to: "/about/clientele", label: "Clientele", desc: "1500+ clients" },
  {
    to: "/about/customers",
    label: "Clients / Customers",
    desc: "Industry sectors",
  },
  {
    to: "/about/after-sales",
    label: "After Sales Service",
    desc: "24×7 support",
  },
  {
    to: "/about/philosophy",
    label: "Our Business Philosophy",
    desc: "Our values",
  },
  { to: "/about/location", label: "About Location", desc: "Noida & PAN India" },
];

const Header = ({ onSearch, searchQuery, setSearchQuery }) => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAboutPage = location.pathname.startsWith("/about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    Promise.all([getCategories(), getProducts({})])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      })
      .catch(() => {
        setCategories([]);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setAboutOpen(false);
    setMobileProductsOpen(false);
    setMobileAboutOpen(false);
  }, [location.pathname]);

  const getProductsForCategory = (catId) =>
    products.filter(
      (p) => (p.category?.id || p.category)?.toString() === catId.toString(),
    );

  const megaColumns = categories.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery?.trim() || "");
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <header className={`site-header${scrolled ? " header-scrolled" : ""}`}>
      <div className="mobile-top-bar d-flex d-lg-none align-items-center justify-content-between">
        <Link
          to="/"
          className="mobile-logo"
          onClick={() => setMobileOpen(false)}
        >
          <img src="/logo.jpeg" alt="Company Logo" height="32" />
        </Link>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* desktop */}
      <nav className="main-nav d-none d-lg-block">
        <Container fluid="lg" className="main-nav-inner">
          {/* LEFT: Logo */}
          <Link to="/" className="nav-logo">
            <img src="/logo.jpeg" alt="Company Logo" height="78" />
          </Link>

          {/* CENTER: Nav links */}
          <div className="nav-center-links">
            <NavLink to="/" end className="nav-pill">
              Home
            </NavLink>

            <div
              className="nav-drop-wrap"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                type="button"
                className={`nav-pill${productsOpen ? " open" : ""}`}
              >
                Products <span className="nav-caret">▾</span>
              </button>

              {productsOpen && categories.length > 0 && (
                <div className="nav-dropdown mega-menu">
                  <div className="mega-menu-inner">
                    <div className="mega-columns">
                      {megaColumns.map((cat) => {
                        const catProducts = getProductsForCategory(
                          cat.id,
                        ).slice(0, 5);
                        return (
                          <div key={cat.id} className="mega-column">
                            <Link
                              to={`/category/${cat.slug}`}
                              className="mega-column-title"
                              onClick={() => setProductsOpen(false)}
                            >
                              {cat.name}
                            </Link>
                            <ul className="mega-product-list">
                              {catProducts.map((p) => (
                                <li key={p.id}>
                                  <Link
                                    to={`/category/${cat.slug}`}
                                    onClick={() => setProductsOpen(false)}
                                  >
                                    {p.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <Link
                              to={`/category/${cat.slug}`}
                              className="mega-view-products"
                              onClick={() => setProductsOpen(false)}
                            >
                              View All Products →
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                    {categories.length > 4 && (
                      <div className="mega-more-cols">
                        {categories.slice(4).map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            className="mega-more-link"
                            onClick={() => setProductsOpen(false)}
                          >
                            {cat.icon} {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    <Link
                      to="/products"
                      className=" btn-get-quote btn-sm mega-all-cats"
                      onClick={() => setProductsOpen(false)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className="nav-drop-wrap"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button
                type="button"
                className={`nav-pill${aboutOpen || isAboutPage ? " open" : ""}`}
              >
                About Us <span className="nav-caret">▾</span>
              </button>

              {aboutOpen && (
                <div className="nav-dropdown about-hover-menu">
                  <div className="about-hover-grid">
                    {ABOUT_LINKS.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        className="about-hover-item"
                        onClick={() => setAboutOpen(false)}
                      >
                        <span className="about-hover-label">{l.label}</span>
                        <span className="about-hover-desc">{l.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/contact" className="nav-pill">
              Contact Us
            </NavLink>
          </div>

          {/* RIGHT: Search + buttons */}
          <div className="nav-right-actions">
            <form className="nav-search" onSubmit={handleSearch}>
              <Form.Control
                placeholder="Search Products/Services"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="nav-search-input"
              />
              <Button type="submit" className="nav-search-btn ">
                Search
              </Button>
            </form>

            {isAuthenticated && role === "admin" ? (
              <>
                <Link to="/admin" className="nav-pill admin-pill">
                  Admin
                </Link>
                <button
                  type="button"
                  className="nav-pill admin-pill"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/contact" className="btn-contact-us">
                  +91 7836852039
                </Link>
                <Link to="/products" className=" btn-get-quote ">
                  Get a Quote
                </Link>
              </>
            )}
          </div>
        </Container>
      </nav>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          <form className="mobile-search" onSubmit={handleSearch}>
            <Form.Control
              placeholder="Search products..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
            <Button type="submit" className="btn-sh-primary">
              Search
            </Button>
          </form>

          <Link
            to="/"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          {/* Products & Services collapsible */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileProductsOpen((prev) => !prev)}
          >
            Products &amp; Services
            <span
              className={`mobile-nav-arrow${mobileProductsOpen ? " open" : ""}`}
            >
              ▾
            </span>
          </button>
          {mobileProductsOpen && (
            <div className="mobile-nav-sublist">
              <Link
                to="/products"
                className="mobile-nav-sublink"
                onClick={() => setMobileOpen(false)}
              >
                View All Products &amp; Services
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="mobile-nav-sublink"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* About Us collapsible */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileAboutOpen((prev) => !prev)}
          >
            About Us
            <span
              className={`mobile-nav-arrow${mobileAboutOpen ? " open" : ""}`}
            >
              ▾
            </span>
          </button>
          {mobileAboutOpen && (
            <div className="mobile-nav-sublist">
              {ABOUT_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="mobile-nav-sublink"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/contact"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Link>
          <a href={`tel:${COMPANY.phone}`} className="mobile-call-btn">
            📞 Call {COMPANY.phoneDisplay}
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
