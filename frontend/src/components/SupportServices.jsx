import {
  Wrench,
  BatteryCharging,
  Wifi,
  PackageCheck,
  Gauge,
  Settings2,
} from "lucide-react";

const SERVICES = [
  {
    Icon: Wrench,
    title: "UPS Maintenance Contracts",
    points: [
      "Tailored UPS maintenance contracts designed for your specific power needs.",
      "Reliable UPS service, annual maintenance, and expert guidance included.",
      "Flexible service levels to minimize risks and costs.",
      "Timely repairs or replacements before faults occur.",
      "Immediate spares availability through our extensive inventory.",
    ],
  },
  {
    Icon: BatteryCharging,
    title: "Battery Monitoring",
    points: [
      "Ensure UPS battery health with our advanced UPTIME+ system.",
      "Sequentially check internal resistance, temperature, and voltage for each battery.",
      "Continuous monitoring and control of individual charging voltages guarantee battery availability.",
      "Run on-site reports using UPTIME+ viewer for constant system monitoring.",
    ],
  },
  {
    Icon: Wifi,
    title: "Remote UPS Monitoring",
    points: [
      "Effortlessly monitor and manage UPS systems remotely with our advanced service.",
      "Benefit from APC remote UPS monitoring for proactive maintenance and uninterrupted power protection.",
      "In case of an incident, it connects to our Service Centre via email, sharing a status message and fault details.",
    ],
  },
  {
    Icon: PackageCheck,
    title: "UPS Rental Contracts",
    points: [
      "Power up confidently with our flexible UPhire service, offering solutions from 1–500kVA.",
      "We cater to diverse needs, providing reliable UPS systems with suitable batteries for uninterrupted power supply.",
      "Specializing in Industrial UPS and APC, Schneider, and Luminous.",
    ],
  },
  {
    Icon: Gauge,
    title: "Load Bank Testing",
    points: [
      "Ensure UPS system reliability through meticulous load bank testing.",
      "Industry-standard procedures validate performance and prevent potential issues.",
      "Comprehensive approach includes commissioning, regular testing, and maintenance.",
    ],
  },
  {
    Icon: Settings2,
    title: "Integrated System Testing",
    points: [
      "Streamline your integrated systems with our comprehensive testing service.",
      "Ensure smooth coordination and optimal functionality across all components.",
      "Evaluate high availability, performance and recovery capabilities effectively.",
    ],
  },
];

const SupportServices = () => (
  <section className="support-services-section">
    <div className="ss-banner-text">
      <h2 className="section-heading">
        Support <span className="gradient-text">Services</span>
      </h2>
      <p>Flexible, Structured Services</p>
    </div>
    <span className="ss-banner-shape" />

    <div className="ss-grid mt-4">
      {SERVICES.map(({ Icon, title, points }) => (
        <div className="ss-card" key={title}>
          <div className="ss-card-header">
            <span className="ss-card-icon">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            {title}
          </div>
          <ul className="ss-card-list">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default SupportServices;