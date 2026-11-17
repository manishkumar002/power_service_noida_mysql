import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainLayout from "./components/layout/MainLayout";
import AboutLayout from "./components/layout/AboutLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AboutCompany from "./pages/about/AboutCompany";
import AboutClientele from "./pages/about/AboutClientele";
import AboutCustomers from "./pages/about/AboutCustomers";
import AboutAfterSales from "./pages/about/AboutAfterSales";
import AboutPhilosophy from "./pages/about/AboutPhilosophy";
import AboutLocation from "./pages/about/AboutLocation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategories from "./pages/AdminCategories";
import AdminProducts from "./pages/AdminProducts";
import AdminEnquiries from "./pages/AdminEnquiries";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin/login" element={<Login />} />

          <Route path="about" element={<AboutLayout />}>
            <Route index element={<AboutCompany />} />
            <Route path="clientele" element={<AboutClientele />} />
            <Route path="customers" element={<AboutCustomers />} />
            <Route path="after-sales" element={<AboutAfterSales />} />
            <Route path="philosophy" element={<AboutPhilosophy />} />
            <Route path="location" element={<AboutLocation />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
