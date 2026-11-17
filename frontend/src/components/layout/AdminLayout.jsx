import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { usePageMeta } from "../../hooks/usePageMeta";

const ADMIN_TITLES = {
  "/admin": "Dashboard",
  "/admin/categories": "Manage Categories",
  "/admin/products": "Manage Products",
  "/admin/enquiries": "Customer Enquiries",
};

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/enquiries", label: "Enquiries" },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  usePageMeta(ADMIN_TITLES[pathname] || "Admin Panel", "Admin panel — Power Solution Services");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Admin Panel</div>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="admin-nav-link">
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/" className="small d-block mb-2">
            ← View Website
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-outline-light w-100"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout {user?.fullName ? `(${user.fullName})` : ""}
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
