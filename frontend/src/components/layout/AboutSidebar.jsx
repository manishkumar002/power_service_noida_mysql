import { NavLink, useLocation } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";

const SIDEBAR_LINKS = [
  { to: "/about", label: "About Company", end: true },
  { to: "/about/clientele", label: "Clientele" },
  { to: "/about/customers", label: "Clients / Customers" },
  { to: "/about/after-sales", label: "After Sales Service" },
  { to: "/about/philosophy", label: "Our Business Philosophy" },
  { to: "/about/location", label: "About Location" },
];

const PAGE_TITLES = {
  "/about": "About Company",
  "/about/clientele": "Clientele",
  "/about/customers": "Clients / Customers",
  "/about/after-sales": "After Sales Service",
  "/about/philosophy": "Our Business Philosophy",
  "/about/location": "About Location",
};

const AboutSidebar = ({ children }) => {
  const { pathname } = useLocation();
  const pageTitle = PAGE_TITLES[pathname] || "About Us";

  return (
    <div className="about-page-wrap">
      <div className="about-page-inner">
        <aside className="about-sidebar">
          <h6 className="about-sidebar-title">About Us</h6>
          <nav className="about-sidebar-nav">
            {SIDEBAR_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `about-sidebar-link${isActive ? " active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="about-main">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: pageTitle },
            ]}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AboutSidebar;
