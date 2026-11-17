import api from "./axios";

const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).join(", ");
  }
  return data?.message || err.message || "Something went wrong";
};

export { getErrorMessage };

export const loginUser = (payload) => api.post("/login", payload);
export const getProfile = () => api.get("/profile");

export const getCategories = () => api.get("/categories");
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const getAdminCategories = () => api.get("/admin/categories");
export const createCategory = (payload) =>
  api.post("/categories", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategory = (id, payload) =>
  api.put(`/categories/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getAdminProducts = () => api.get("/admin/products");
export const createProduct = (formData) =>
  api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProduct = (id, formData) =>
  api.put(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

// export const sendEnquiryOtp = (phone) =>
//   api.post("/enquiry/send-otp", { phone });
// export const verifyEnquiryOtp = (phone, otp) =>
//   api.post("/enquiry/verify-otp", { phone, otp });
export const submitEnquiry = (payload) => api.post("/enquiry/submit", payload);
export const submitContact = (payload) => api.post("/contact/submit", payload);

export const getAdminEnquiries = () => api.get("/admin/enquiries");

export const updateEnquiryStatus = (id, status) =>
  api.put(`/admin/enquiries/${id}/status`, { status });

export const deleteEnquiry = (id) => api.delete(`/admin/enquiries/${id}`);

export const getAdminDashboard = () => api.get("/admin/dashboard");
