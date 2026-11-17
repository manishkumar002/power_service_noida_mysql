import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { COMPANY } from "../../config/company";

const clients = [
  "Delhi Metro",
  "Google",
  "Adani Group",
  "NTPC",
  "Siemens",
  "Reliance",
  "L&T",
  "PVR INOX",
  "Waaree",
  "UFlex",
  "BHEL",
  "SAIL",
  "GAIL",
  "Philips",
  "Zydus",
  "Wockhardt",
  "CPWD",
  "Mumbai Metro",
];

const SECTORS = [
  "Government & PSU organizations",
  "IT parks & data centers",
  "Hospitals & healthcare",
  "Manufacturing & process industries",
  "Metro rail & infrastructure projects",
];

const AboutClientele = () => (
  <>
    <div className="about-hero-block">
      <span className="about-hero-badge">Trusted Nationwide</span>
      <h1 className="about-page-title">Our Clientele</h1>
      <p className="about-hero-subtitle">
        Proudly serving 1500+ clients across government, industry, and
        infrastructure sectors all over India.
      </p>
    </div>

    <Row className="g-3 mb-4">
      <Col xs={4}>
        <div className="stat-mini-card">
          <span className="stat-mini-value">1500+</span>
          <span className="stat-mini-label">Clients Served</span>
        </div>
      </Col>
      <Col xs={4}>
        <div className="stat-mini-card">
          <span className="stat-mini-value">25+</span>
          <span className="stat-mini-label">Years Experience</span>
        </div>
      </Col>
      <Col xs={4}>
        <div className="stat-mini-card">
          <span className="stat-mini-value">PAN</span>
          <span className="stat-mini-label">India Service</span>
        </div>
      </Col>
    </Row>

    <Row className="g-4 align-items-start">
      <Col lg={7}>
        <div className="about-content-card sh-card">
          <h5 className="about-card-heading">Who We Serve</h5>
          <p>
            {COMPANY.name} proudly serves 1500+ clients from government
            organizations, IT companies, manufacturing units, healthcare,
            infrastructure, telecom, data centers, and commercial facilities
            across India.
          </p>
          <ul className="about-bullet-list">
            {SECTORS.map((s) => (
              <li key={s}>
                <span className="about-bullet-icon">✓</span> {s}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn-about-cta">
            Contact Us →
          </Link>
        </div>
      </Col>

      <Col lg={5}>
        <div className="client-logo-grid sh-card">
          <h5 className="about-card-heading">Companies We've Worked With</h5>
          <div className="client-logo-wrap">
            {clients.map((c) => (
              <span key={c} className="client-logo-cell">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  </>
);

export default AboutClientele;
