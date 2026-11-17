import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mount this ONCE, right inside <BrowserRouter>, above/alongside <Routes>.
// It listens for route (pathname) changes and scrolls the window to top
// every time a new page is navigated to (via <Link>, navigate(), etc.)
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // agar smooth scroll chahiye to "instant" ko "smooth" kar dein,
    // lekin page-change par usually "instant" hi better UX deta hai.
  }, [pathname]);

  return null; // ye component kuch render nahi karta, sirf side-effect hai
};

export default ScrollToTop;
