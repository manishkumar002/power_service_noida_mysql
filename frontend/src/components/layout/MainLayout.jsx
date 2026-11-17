import { useState, useEffect } from "react";
import { Outlet, useSearchParams, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ReviewsSection from "../ReviewsSection";
import ContactSection from "../ContactSection";
import { usePageMeta } from "../../hooks/usePageMeta";
// import NetworkBackground from "../../components/NetworkBackground";
const STATIC_TITLES = {
  "/": {
    title: "Home",
    desc: "Online UPS, Industrial UPS & power backup solutions — trusted by 1500+ clients across India.",
  },
  "/products": {
    title: "Products & Services",
    desc: "Browse Online UPS, Three Phase UPS, Refurbished UPS, Rental & AMC services.",
  },
  "/contact": {
    title: "Contact Us",
    desc: "Contact Power Solution Services for UPS sales, rental, AMC and repair in Noida & PAN India.",
  },
  "/admin/login": {
    title: "Admin Login",
    desc: "Admin panel login for Power Solution Services.",
  },
  "/about": {
    title: "About Company",
    desc: "About Power Solution Services — 25+ years of trusted power backup expertise.",
  },
  "/about/clientele": {
    title: "Clientele",
    desc: "Our clients include Delhi Metro, Google, Adani, NTPC, Siemens and 1500+ organizations.",
  },
  "/about/customers": {
    title: "Clients & Customers",
    desc: "Industries we serve — government, IT, healthcare, manufacturing & infrastructure.",
  },
  "/about/after-sales": {
    title: "After Sales Service",
    desc: "24×7 UPS after-sales support, AMC, repair & maintenance across India.",
  },
  "/about/philosophy": {
    title: "Our Business Philosophy",
    desc: "Quality, transparency and customer-centric power backup solutions.",
  },
  "/about/location": {
    title: "About Location",
    desc: "Head office in Noida with PAN India UPS service network.",
  },
};

const MainLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const location = useLocation();

  const isAdminLogin = location.pathname === "/admin/login";
  const showPageBottom = !isAdminLogin;
  const isCategory = location.pathname.startsWith("/category/");

  const staticMeta = STATIC_TITLES[location.pathname];
  usePageMeta(
    isCategory ? null : staticMeta?.title,
    isCategory ? undefined : staticMeta?.desc,
  );

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (q) => {
    if (q) setSearchParams({ q });
    else setSearchParams({});
  };

  return (
    <div className="app-shell home-hero">
      {/* <NetworkBackground /> */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <main className="page-main">
        <Outlet context={{ searchQuery }} />
      </main>
      {showPageBottom && (
        <>
          {!location.pathname.startsWith("/contact") && <ReviewsSection />}
          <ContactSection />
        </>
      )}
      <Footer />
    </div>
  );
};

export default MainLayout;
