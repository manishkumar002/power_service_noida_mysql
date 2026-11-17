import { Row, Col } from "react-bootstrap";
import {
  Award,
  ClipboardList,
  Cpu,
  Clock,
  Scale,
  Wrench,
  Handshake,
  Presentation,
} from "lucide-react";
import { COMPANY } from "../../config/company";

const ASPECTS = [
  { Icon: Award, label: "Quality Services" },
  { Icon: ClipboardList, label: "Domain Expertise" },
  { Icon: Cpu, label: "Use of Advanced Technology" },
  { Icon: Clock, label: "Timely Execution" },
  { Icon: Scale, label: "Competitive Pricing" },
  { Icon: Wrench, label: "Customization" },
  { Icon: Handshake, label: "After Sale Services" },
  { Icon: Presentation, label: "Ethical Business Practices" },
];

const AboutPhilosophy = () => (
  <>
    {/* Hero */}
    <div className="about-hero-block">
      <span className="about-hero-badge">Why Choose Us</span>
      <h1 className="about-page-title">Our Business Philosophy</h1>
      <p className="about-hero-subtitle">
        A right choice that makes the difference to others — {COMPANY.name} is
        successful when your business is successful. That is our fundamental
        business philosophy.
      </p>
    </div>

    {/* Intro + Quality Commitment */}
    <div className="about-content-card sh-card bg-white">
      <p>
        {COMPANY.name} understands that having your computing system available
        when you need to use it is critical to the success of your business. Not
        to mention the emotional angst. {COMPANY.name} only recommends reliable
        computing hardware and software appropriate for your business
        environment. In short, we enjoy technical challenges. However, our main
        challenge is helping your business become outstanding in your industry.
      </p>

      <h5 className="about-card-heading mt-4">Quality Commitment</h5>
      <p className="mb-0">
        {COMPANY.name} has always strived to differentiate itself from the
        competition on the basis of the quality of its products and services. In
        fact, {COMPANY.name} Quality Management System processes are applied to
        each and every business unit&apos;s products and services.{" "}
        {COMPANY.name} attributes a very high importance to its quality
        assurance and has incorporated internal and external quality auditing
        practices not only to preserve but also to continuously improve its
        processes.
      </p>
    </div>

    {/* Aspects grid */}
    <h5 className="about-card-heading mt-5 mb-1">
      What sets us ahead of our competitors
    </h5>
    <p className="text-muted mb-4">
      Following are some of the aspects on which we outperform the rest.
    </p>

    <Row className="g-4">
      {ASPECTS.map(({ Icon, label }) => (
        <Col xs={6} md={3} key={label}>
          <div className="aspect-card sh-card h-100 text-center">
            <div className="aspect-card-icon">
              <Icon size={26} strokeWidth={1.75} />
            </div>
            <div className="aspect-card-label">{label}</div>
          </div>
        </Col>
      ))}
    </Row>
  </>
);

export default AboutPhilosophy;
