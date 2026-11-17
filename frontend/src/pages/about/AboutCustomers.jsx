import { Row, Col } from "react-bootstrap";
import { COMPANY } from "../../config/company";

const sectors = [
  {
    icon: "🏛",
    title: "Government & PSU",
    desc: "Delhi Metro, NTPC, BHEL, SAIL, GAIL, CPWD",
  },
  {
    icon: "💻",
    title: "IT & Data Centers",
    desc: "Google, Siemens, large IT parks and server rooms",
  },
  {
    icon: "🏥",
    title: "Healthcare",
    desc: "Hospitals, diagnostics, pharma — Zydus, Wockhardt",
  },
  {
    icon: "🏭",
    title: "Manufacturing",
    desc: "Adani, Reliance, UFlex, process industries",
  },
  {
    icon: "🚇",
    title: "Infrastructure",
    desc: "Metro rail, telecom, commercial facilities",
  },
  {
    icon: "🎬",
    title: "Entertainment",
    desc: "PVR INOX multiplexes and large venues",
  },
];

const AboutCustomers = () => (
  <>
    <div className="about-hero-block">
      <span className="about-hero-badge">Industries We Serve</span>
      <h1 className="about-page-title">Clients &amp; Customers</h1>
      <p className="about-hero-subtitle">
        We deliver mission-critical power backup to organizations that cannot
        afford downtime. Our customers trust {COMPANY.name} for transparent
        pricing, prompt service response, and PAN India support.
      </p>
    </div>

    <Row className="g-4">
      {sectors.map((s) => (
        <Col md={6} lg={4} key={s.title}>
          <div className="sector-card sh-card">
            <div className="sector-card-icon">{s.icon}</div>
            <h5 className="sector-card-title">{s.title}</h5>
            <p className="sector-card-desc">{s.desc}</p>
          </div>
        </Col>
      ))}
    </Row>
  </>
);

export default AboutCustomers;
