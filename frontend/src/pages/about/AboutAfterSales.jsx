import { Row, Col } from "react-bootstrap";
import { COMPANY } from "../../config/company";

const services = [
  "PAN-India resident engineers in major metros",
  "Preventive maintenance & AMC packages",
  "Emergency breakdown support 24×7",
  "UPS repair from 10 kVA to 1200 kVA",
  "Battery testing, replacement & bank management",
  "Installation, commissioning & system optimization",
];

const AboutAfterSales = () => (
  <>
    <div className="about-hero-block">
      <span className="about-hero-badge">24×7 Support</span>
      <h1 className="about-page-title">After Sales Service</h1>
      <p className="about-hero-subtitle">
        For over 25 years, {COMPANY.name} has been a trusted name in UPS
        after-sales support. We ensure your critical power infrastructure keeps
        running — 24/7, 365 days a year.
      </p>
    </div>

    <Row className="g-3 mb-4">
      {services.map((s) => (
        <Col md={6} key={s}>
          <div className="service-item-card sh-card">
            <span className="service-item-check">✓</span>
            <span className="service-item-text">{s}</span>
          </div>
        </Col>
      ))}
    </Row>

    <div className="hotline-banner">
      <div className="hotline-banner-left">
        <h5 className="hotline-title">Support Hotline</h5>
        <p className="hotline-subtitle">
          Reach out anytime — our team is ready to help.
        </p>
      </div>
      <div className="hotline-banner-right">
        <a href={`tel:${COMPANY.phone}`} className="hotline-link">
          <span className="hotline-icon">📞</span>
          {COMPANY.phoneDisplay}
        </a>
        <a href={`mailto:${COMPANY.email}`} className="hotline-link">
          <span className="hotline-icon">📧</span>
          {COMPANY.email}
        </a>
      </div>
    </div>
  </>
);

export default AboutAfterSales;
