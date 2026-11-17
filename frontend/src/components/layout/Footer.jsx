import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { COMPANY } from "../../config/company";
import { getCategories } from "../../api/services";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories((data.data || []).slice(0, 6)))
      .catch(() => setCategories([]));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // apna subscribe API call yahan
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Container fluid="lg">
          <Row className="gy-4">
            {/* Brand column */}
            <Col md={6} lg={3}>
              <div className="footer-brand">
                <img src="/logo.jpeg" alt="Company Logo" height="78" />
              </div>
              <p className="footer-about">
                Innovate · Solve · Grow. Cloud based subscription software,
                mobile apps, custom development and compatible biometric
                hardware for organizations of every size.
              </p>
              <ul className="footer-contact-list">
                <li>
                  <span className="footer-icon">✉</span> {COMPANY.email}
                </li>
                <li>
                  <span className="footer-icon">📞</span> {COMPANY.phoneDisplay}
                </li>
                <li>
                  <span className="footer-icon">📍</span> Delhi, India
                </li>
              </ul>
            </Col>

            {/* Products column */}
            <Col md={6} lg={3}>
              <h6 className="footer-heading">Products</h6>
              <ul className="footer-links">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link to={`/category/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Company column */}
            <Col md={6} lg={3}>
              <h6 className="footer-heading">Company</h6>
              <ul className="footer-links">
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/careers">Careers</Link>
                </li>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/channel-partners">Channel Partners</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </Col>

            {/* Solutions column */}
            <Col md={6} lg={3}>
              <form className="footer-subscribe" onSubmit={handleSubscribe}>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="footer-subscribe-btn">
                  Subscribe
                </Button>
              </form>

              <div className="footer-social">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="footer-social-icon"
                >
                  in
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="footer-social-icon"
                >
                  f
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="footer-social-icon"
                >
                  ◎
                </a>
                <a href="#" aria-label="YouTube" className="footer-social-icon">
                  ▶
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container fluid="lg">
          <p className="mb-0">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
