import { Row, Col } from "react-bootstrap";
import { COMPANY } from "../../config/company";

const CITIES = [
  "Delhi",
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",
  "Greater Noida",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
];

const AboutLocation = () => (
  <>
    <div className="about-hero-block">
      <span className="about-hero-badge">Find Us</span>
      <h1 className="about-page-title">About Location</h1>
      <p className="about-hero-subtitle">
        Headquartered in Noida with a PAN India service network supporting
        clients across every major metro.
      </p>
    </div>

    <Row className="g-4">
      <Col lg={7}>
        <div className="about-content-card sh-card">
          <h5 className="about-card-heading">Head Office — Noida</h5>
          <ul className="location-detail-list">
            <li>
              <span className="location-detail-icon">📍</span>
              <div>
                <span className="location-detail-label">Address</span>
                <span className="location-detail-value">{COMPANY.address}</span>
              </div>
            </li>
            <li>
              <span className="location-detail-icon">🌐</span>
              <div>
                <span className="location-detail-label">Location</span>
                <span className="location-detail-value">
                  {COMPANY.location}
                </span>
              </div>
            </li>
            <li>
              <span className="location-detail-icon">📞</span>
              <div>
                <span className="location-detail-label">Phone</span>

                <a
                  href={`tel:${COMPANY.phone}`}
                  className="location-detail-value location-detail-link"
                >
                  {COMPANY.phoneDisplay}
                </a>
              </div>
            </li>
            <li>
              <span className="location-detail-icon">📧</span>
              <div>
                <span className="location-detail-label">Email</span>

                <a
                  href={`mailto:${COMPANY.email}`}
                  className="location-detail-value location-detail-link"
                >
                  {COMPANY.email}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </Col>

      <Col lg={5}>
        <div className="about-content-card sh-card h-100">
          <h5 className="about-card-heading">Service Coverage</h5>
          <p className="coverage-intro">
            PAN India service network with branch support across Delhi NCR,
            Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, and all major
            metros.
          </p>
          <div className="coverage-tags">
            {CITIES.map((c) => (
              <span key={c} className="coverage-tag">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  </>
);

export default AboutLocation;
