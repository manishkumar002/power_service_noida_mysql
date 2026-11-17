import { Container, Row, Col } from "react-bootstrap";
import { COMPANY } from "../config/company";
import Breadcrumb from "../components/Breadcrumb";

const Contact = () => {
  return (
    <Container fluid="lg" className="py-4 pb-2">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
      />

      <div className="about-hero-block">
        <span className="about-hero-badge">We're Here to Help</span>
        <h1 className="about-page-title">Contact Us</h1>
        <p className="about-hero-subtitle">
          Get the best quote for Online UPS, Industrial UPS, Rental &amp; AMC
          services. Our team responds within {COMPANY.responseRate}.
        </p>
      </div>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <div className="contact-card sh-card">
            <div className="contact-card-icon">📞</div>
            <h5 className="contact-card-title">Call Us</h5>
            <a href={`tel:${COMPANY.phone}`} className="contact-link">
              {COMPANY.phoneDisplay}
            </a>
            <span className="contact-card-badge">
              {COMPANY.responseRate} response rate
            </span>
          </div>
        </Col>
        <Col md={4}>
          <div className="contact-card sh-card">
            <div className="contact-card-icon">✉</div>
            <h5 className="contact-card-title">Email</h5>
            <a href={`mailto:${COMPANY.email}`} className="contact-link">
              {COMPANY.email}
            </a>
            <span className="contact-card-badge contact-card-badge-muted">
              Replies within 24 hrs
            </span>
          </div>
        </Col>
        <Col md={4}>
          <div className="contact-card sh-card">
            <div className="contact-card-icon">📍</div>
            <h5 className="contact-card-title">Visit Us</h5>
            <p className="contact-address">{COMPANY.address}</p>
            <span className="contact-card-badge contact-card-badge-muted">
              PAN India service
            </span>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <div className="contact-form-box sh-card bg-white">
            <h5 className="about-card-heading">Find Us Here</h5>
            <div className="contact-map mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d39150.464200370705!2d77.3563937373414!3d28.607448763509275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sABHION%20POWER%20SOLUTION%2C%20B1%2C84%20AN%20LOCHONO%20SAKEER%20ROOM%2C%20SAKTAM%20BUDDHA%20NAGAR%20201309%2C%20UTTAR%20PRADESH%20UP%20INDIA!5e1!3m2!1sen!2sin!4v1790063757454!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Abhion Power Solution Location"
              />
            </div>
          </div>
        </Col>

        <Col lg={5}>
          <div className="contact-side-card sh-card bg-white">
            <h5 className="about-card-heading">Business Hours</h5>
            <ul className="hours-list">
              <li>
                <span>Monday – Saturday</span>
                <span className="hours-value">9:00 AM – 7:00 PM</span>
              </li>
              <li>
                <span>Sunday</span>
                <span className="hours-value">Emergency support only</span>
              </li>
            </ul>
            <div className="hours-note">
              24×7 emergency breakdown support available on call.
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
