import { useEffect, useMemo, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiImage,
  FiUploadCloud,
  FiX,
  FiStar,
} from "react-icons/fi";

import {
  getAdminProducts,
  getAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getErrorMessage,
} from "../api/services";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  priceUnit: "Piece",
  category: "",
  images: [],
  isFeatured: false,
  isActive: true,
  specsText: "",
};

const SkeletonRow = () => (
  <tr>
    <td>
      <div className="d-flex gap-2">
        <div
          className="skeleton-line"
          style={{ width: 46, height: 46, borderRadius: 8 }}
        />
        <div
          className="skeleton-line"
          style={{ width: 46, height: 46, borderRadius: 8 }}
        />
      </div>
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "70%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "55%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "50%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: 50, height: 18 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: 90, height: 28 }} />
    </td>
  </tr>
);

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ===============================
  // LOAD PRODUCTS + CATEGORIES
  // ===============================
  const load = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ]);
      setProducts(p.data.data || []);
      setCategories(c.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q);
      const matchesCategory =
        !categoryFilter || (p.category?.id || p.category) === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  // ===============================
  // PARSE SPECS
  // ===============================
  const parseSpecs = (text) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return { key: key.trim(), value: rest.join(":").trim() };
      })
      .filter((s) => s.key && s.value);

  // ===============================
  // CREATE
  // ===============================
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, images: [] });
    setShow(true);
  };

  // ===============================
  // EDIT
  // ===============================
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      slug: p.slug || "",
      description: p.description || "",
      price: String(p.price || ""),
      priceUnit: p.priceUnit || "Piece",
      category: p.category?.id || p.category || "",
      images: p.images || [], // existing image URLs
      isFeatured: !!p.isFeatured,
      isActive: p.isActive !== false,
      specsText: (p.specs || []).map((s) => `${s.key}: ${s.value}`).join("\n"),
    });
    setShow(true);
  };

  // ===============================
  // IMAGE VALIDATION + ADD
  // ===============================
  const addImages = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const combined = [...form.images, ...incoming];
    if (combined.length > 10) {
      toast.error("You can upload maximum 10 images");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFile = incoming.find(
      (file) => !allowedTypes.includes(file.type),
    );
    if (invalidFile) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");
      return;
    }

    const largeFile = incoming.find((file) => file.size > 5 * 1024 * 1024);
    if (largeFile) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    setForm((prev) => ({ ...prev, images: combined }));
  };

  const handleImageChange = (e) => {
    addImages(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addImages(e.dataTransfer.files);
  };

  const removeImageAt = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("priceUnit", form.priceUnit);
      formData.append("category", form.category);
      formData.append("isFeatured", form.isFeatured);
      formData.append("isActive", form.isActive);
      formData.append("specs", JSON.stringify(parseSpecs(form.specsText)));

      // Only upload newly selected files
      form.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      if (editingId) {
        await updateProduct(editingId, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }

      setShow(false);
      setEditingId(null);
      setForm(emptyForm);

      await load();
    } catch (err) {
      console.error("Product Submit Error:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ===============================
  // IMAGE URL
  // ===============================
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  return (
    <>
      <style>{PRODUCT_STYLES}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Products</h1>
          <p className="page-subtitle mb-0">
            {products.length} product{products.length === 1 ? "" : "s"} total
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="search-box">
            <FiSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Form.Select
            className="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>

          <Button
            className="btn-sh-primary d-flex align-items-center gap-2"
            onClick={openCreate}
          >
            <FiPlus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="sh-card products-card table-responsive">
        <Table hover className="mb-0 align-middle products-table">
          <thead>
            <tr>
              <th>Images</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {(p.images || []).slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={getImageUrl(image)}
                          alt={`${p.name}-${index + 1}`}
                          className="prod-thumb"
                        />
                      ))}
                      {p.images?.length > 3 && (
                        <div className="prod-thumb prod-thumb--more">
                          +{p.images.length - 3}
                        </div>
                      )}
                      {!p.images?.length && (
                        <div className="prod-thumb prod-thumb--empty">
                          <FiImage size={16} />
                        </div>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {p.isFeatured && (
                        <FiStar
                          size={14}
                          className="featured-star"
                          title="Featured"
                        />
                      )}
                      <span className="fw-semibold">{p.name}</span>
                    </div>
                  </td>

                  <td>
                    {p.category?.name ? (
                      <span className="cat-badge">{p.category.name}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  <td className="fw-semibold">
                    ₹ {p.price?.toLocaleString("en-IN")}
                    <span className="text-muted fw-normal">/{p.priceUnit}</span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${p.isActive !== false ? "is-active" : "is-inactive"}`}
                    >
                      {p.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="icon-btn icon-btn--edit"
                        onClick={() => openEdit(p)}
                        title="Edit"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--delete"
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="empty-state">
                    <FiImage size={28} className="mb-2 text-muted" />
                    <div className="fw-semibold">
                      {search || categoryFilter
                        ? "No matching products"
                        : "No products found"}
                    </div>
                    <div className="text-muted small">
                      {search || categoryFilter
                        ? "Try a different search or filter"
                        : 'Click "Add Product" to create your first one'}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PRODUCT MODAL */}
      <Modal
        show={show}
        onHide={() => !submitting && setShow(false)}
        size="lg"
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Edit" : "Add"} Product</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <div className="price-input">
                    <span>₹</span>
                    <Form.Control
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    value={form.priceUnit}
                    onChange={(e) =>
                      setForm({ ...form, priceUnit: e.target.value })
                    }
                  >
                    <option>Piece</option>
                    <option>Month</option>
                    <option>Unit</option>
                    <option>Set</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              {/* MULTIPLE IMAGES */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Product Images</Form.Label>

                  <label
                    className={`dropzone ${dragOver ? "dropzone--active" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <FiUploadCloud size={22} />
                    <div className="dropzone-text">
                      <strong>Click to upload</strong> or drag and drop
                    </div>
                    <div className="text-muted small">
                      Up to 10 images · JPG, JPEG, PNG, WEBP · Max 5MB each
                    </div>
                    <Form.Control
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleImageChange}
                      className="d-none"
                    />
                  </label>
                </Form.Group>

                {/* IMAGE PREVIEW */}
                {form.images?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {form.images.map((image, index) => (
                      <div key={index} className="image-preview-box">
                        <img
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : getImageUrl(image)
                          }
                          alt={`Preview ${index + 1}`}
                        />
                        <button
                          type="button"
                          className="image-remove-btn"
                          onClick={() => removeImageAt(index)}
                          title="Remove image"
                        >
                          <FiX size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Specs (one per line: Key: Value)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={form.specsText}
                    onChange={(e) =>
                      setForm({ ...form, specsText: e.target.value })
                    }
                    placeholder={
                      "Capacity: 350 KVA\nPhase: 3 Phase In 3 Phase Out"
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <div className="toggle-row">
                  <Form.Check
                    type="switch"
                    id="isFeatured"
                    label="Featured on homepage"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                  />
                  <Form.Check
                    type="switch"
                    id="isActive"
                    label="Active"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                </div>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShow(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-sh-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

const PRODUCT_STYLES = `
  .page-title {
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    color: #94a3b8;
    font-size: 0.9rem;
  }

  /* ---- Search + filter ---- */
  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-box .search-icon {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    pointer-events: none;
  }

  .search-box input {
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 10px;
    padding: 8px 12px 8px 36px;
    font-size: 0.88rem;
    outline: none;
    min-width: 200px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .search-box input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  .category-filter {
    max-width: 170px;
    border-radius: 10px !important;
    font-size: 0.88rem !important;
  }

  /* ---- Table card ---- */
  .products-card {
    border: 1px solid rgba(15, 23, 42, 0.06);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    padding: 8px;
  }

  .products-table thead th {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #94a3b8;
    font-weight: 600;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    padding: 12px 16px;
  }

  .products-table tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.045);
    font-size: 0.9rem;
  }

  .products-table tbody tr:last-child td {
    border-bottom: none;
  }

  .products-table tbody tr:hover {
    background: #f8fafc;
  }

  .prod-thumb {
    width: 46px;
    height: 46px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.06);
  }

  .prod-thumb--empty,
  .prod-thumb--more {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .featured-star {
    color: #f59e0b;
    fill: #f59e0b;
  }

  .cat-badge {
    background: #6366f114;
    color: #6366f1;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  .status-badge {
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  .status-badge.is-active {
    background: #16a34a14;
    color: #16a34a;
  }

  .status-badge.is-inactive {
    background: #94a3b814;
    color: #64748b;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    cursor: pointer;
  }

  .icon-btn--edit {
    color: #6366f1;
  }
  .icon-btn--edit:hover {
    background: #6366f114;
    border-color: #6366f13a;
  }

  .icon-btn--delete {
    color: #dc2626;
  }
  .icon-btn--delete:hover {
    background: #dc262614;
    border-color: #dc26263a;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #475569;
  }

  /* ---- Price input ---- */
  .price-input {
    position: relative;
  }

  .price-input span {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .price-input input {
    padding-left: 26px !important;
  }

  /* ---- Image upload ---- */
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 4px;
    border: 1.5px dashed rgba(15, 23, 42, 0.18);
    border-radius: 12px;
    padding: 20px 16px;
    cursor: pointer;
    color: #6366f1;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .dropzone:hover,
  .dropzone--active {
    border-color: #6366f1;
    background: #6366f10a;
  }

  .dropzone-text {
    font-size: 0.85rem;
    color: #334155;
  }

  .image-preview-box {
    position: relative;
    width: fit-content;
  }

  .image-preview-box img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    display: block;
  }

  .image-remove-btn {
    position: absolute;
    top: -7px;
    right: -7px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #dc2626;
    color: #fff;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .toggle-row {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
    background: #f8fafc;
    border-radius: 12px;
    padding: 14px 16px;
  }

  /* ---- Skeleton ---- */
  .skeleton-line {
    background: linear-gradient(90deg, #eef1f6 25%, #e2e6ee 37%, #eef1f6 63%);
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease infinite;
    border-radius: 6px;
  }

  @keyframes skeleton-shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
`;

export default AdminProducts;
