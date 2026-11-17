import { Row, Col } from "react-bootstrap";
import { COMPANY } from "../../config/company";

const FACTS = [
  { icon: "📍", label: "Location", value: COMPANY.location },
  { icon: "✓", label: "GST Number", value: COMPANY.gst },
  { icon: "👥", label: "Team Size", value: "26 to 50 People" },
  { icon: "📅", label: "Established", value: "2001" },
  { icon: "⚡", label: "Capacity Range", value: "1 kVA to 1200 kVA" },
];

const HIGHLIGHTS = [
  "Reliability",
  "Cost Effectiveness",
  "Data Confidentiality",
  "Timely Execution",
];

const AboutCompany = () => (
  <>
    <div className="about-hero-block">
      <span className="about-hero-badge">Est. 2001 · 25+ Years</span>
      <h1 className="about-page-title">About {COMPANY.name}</h1>
      <p className="about-hero-subtitle">
        A trusted name in the power backup industry, delivering reliable power
        solutions across India for over two decades.
      </p>
    </div>

    <Row className="g-4">
      <Col lg={8}>
        <div className="about-content-card sh-card bg-white">
          <h5 className="about-card-heading">Who We Are</h5>
          <p>
            Established in the year 2025, {COMPANY.name} is widely considered
            among the best in the industry for providing solutions and
            services, and is engaged in offering high-end power backup
            services for Online UPS Systems, Industrial UPS, Battery
            Solutions, UPS Sales, Repairs, and Annual Maintenance Contracts
            (AMC). Our wide spectrum of solutions is performed by a team of
            expert professionals who have vast experience in this sphere of
            business.
          </p>
          <p>
            <em>
              "Our Motto is to serve the customer in a way such that every
              customer becomes our helping hand to success in our journey."
            </em>
          </p>
          <p>
            We are a team of skilled professionals who love to play with
            technology. The power backup industry has a lot of potential — we
            believe in using renewable energy resources, making energy
            accessible by providing clean and green power to every business.
            We strongly believe in the concept of creating simple yet
            powerful and accessible technology, and it is our vision to
            support every business without interruption.
          </p>
          <p className="mb-0">{COMPANY.about}</p>

          <h5 className="about-card-heading mt-4">
            High lighting Features of Our Services
          </h5>
          <ul className="about-highlights-list">
            {HIGHLIGHTS.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </Col>

      <Col lg={4}>
        <div className="about-content-card sh-card h-100 bg-white">
          <h5 className="about-card-heading">Company Facts</h5>
          <ul className="about-facts-list">
            {FACTS.map((f) => (
              <li key={f.label}>
                <span className="about-fact-icon">{f.icon}</span>
                <div>
                  <span className="about-fact-label">{f.label}</span>
                  <span className="about-fact-value">{f.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Col>
    </Row>
  </>
);

export default AboutCompany;