import { NavLink } from "react-router-dom";

const links = [
  { to: "/about", label: "About Company", end: true },
  { to: "/about/clientele", label: "Clientele" },
  { to: "/about/customers", label: "Clients / Customers" },
  { to: "/about/after-sales", label: "After Sales Service" },
  { to: "/about/philosophy", label: "Our Business Philosophy" },
  { to: "/about/location", label: "About Location" },
];

const AboutSubNav = () => (
  <div className="about-subnav">
    <div className="about-subnav-inner">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `about-subnav-link${isActive ? " active" : ""}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </div>
  </div>
);

export default AboutSubNav;
