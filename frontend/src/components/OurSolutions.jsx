import { ShieldCheck, Cpu, Server } from "lucide-react";

const SOLUTIONS = [
  {
    Icon: ShieldCheck,
    title: "Power Management",
    text: "Reliable UPS, battery backup and power protection solutions tailored for your business-critical infrastructure.",
    image:
      "https://www.racksolutions.com/news//app/uploads/AdobeStock_129750837.jpeg",
  },
  {
    Icon: Cpu,
    title: "ELV Surveillance System",
    text: "Integrated CCTV, access control and low-voltage security systems for complete site monitoring and safety.",
    image: "https://aeropack.in/assets/img/services/elv.jpg",
  },
  {
    Icon: Server,
    title: "IT Infrastructure",
    text: "End-to-end IT infrastructure design, deployment and management for scalable and secure business operations.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2D3lWVzi6yGprvtHJJm3yIIsQ5fWQPSbZZJbwUqg1ozsFhL-RBm__koH8&s=10",
  },
];

const OurSolutions = () => {
  return (
    <section className="our-solutions-section mt-4">
      {/* Banner with background image + angled orange shape */}
      <div className="os-banner">
        <img
          src="https://t3.ftcdn.net/jpg/04/78/80/14/360_F_478801437_L6euBIK8dEm10QpPjb6DuehtLSJRSnBg.jpg"
          alt="Our Solutions"
          className="os-banner-img"
        />

        <span className="os-banner-shape">
          OUR
          <br />
          SOLUTIONS
        </span>
      </div>

      <div className="os-grid">
        {SOLUTIONS.map(({ Icon, title, text, image }) => (
          <div className="os-card" key={title}>
            <div className="os-card-media">
              <img src={image} alt={title} loading="lazy" />
            </div>

            <div className="bg-danger">
              <h5 className="os-card-title">{title}</h5>
              <p className="os-card-text">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurSolutions;
