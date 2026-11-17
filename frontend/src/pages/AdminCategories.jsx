import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiImage,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getErrorMessage,
} from "../api/services";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  categoryImage: null,
};

const SkeletonRow = () => (
  <tr>
    <td>
      <div
        className="skeleton-line"
        style={{ width: 40, height: 40, borderRadius: 8 }}
      />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "70%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "50%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "40%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: 90, height: 28 }} />
    </td>
  </tr>
);

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // =========================
  // LOAD CATEGORIES
  // =========================
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminCategories();
      setCategories(data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q),
    );
  }, [categories, search]);

  // =========================
  // CREATE
  // =========================
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShow(true);
  };

  // =========================
  // EDIT
  // =========================
  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      icon: cat.icon || "",
      categoryImage: cat.categoryImage || "", // existing URL string, not a File
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShow(true);
  };

  // =========================
  // IMAGE VALIDATION + SET
  // =========================
  const applyImageFile = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");
      return;
    }

    setForm((prev) => ({ ...prev, categoryImage: file }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    applyImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    applyImageFile(file);
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, categoryImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("icon", form.icon);

      // only append if a NEW file was actually picked
      if (form.categoryImage instanceof File) {
        formData.append("categoryImage", form.categoryImage);
      }

      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }

      setShow(false);
      setForm(emptyForm);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await load();
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // =========================
  // IMAGE PREVIEW
  // =========================
  const getImagePreview = () => {
    if (!form.categoryImage) return null;
    if (form.categoryImage instanceof File) {
      return URL.createObjectURL(form.categoryImage);
    }
    return `${import.meta.env.VITE_API_URL}${form.categoryImage}`;
  };

  const imagePreview = getImagePreview();

  return (
    <Container>
      <style>{CATEGORY_STYLES}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Manage Categories</h1>
          <p className="page-subtitle mb-0">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}{" "}
            total
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="search-box">
            <FiSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            className="btn-sh-primary d-flex align-items-center gap-2"
            onClick={openCreate}
          >
            <FiPlus size={16} /> Add Category
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="sh-card categories-card table-responsive">
        <Table hover className="mb-0 categories-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Icon</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.categoryImage ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${c.categoryImage}`}
                        alt={c.name}
                        className="cat-thumb"
                      />
                    ) : (
                      <div className="cat-thumb cat-thumb--empty">
                        <FiImage size={16} />
                      </div>
                    )}
                  </td>
                  <td className="fw-semibold">{c.name}</td>
                  <td>
                    <span className="slug-badge">{c.slug}</span>
                  </td>
                  <td className="text-muted">{c.icon || "—"}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="icon-btn icon-btn--edit"
                        onClick={() => openEdit(c)}
                        title="Edit"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--delete"
                        onClick={() => handleDelete(c.id)}
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
                <td colSpan="5" className="text-center py-5">
                  <div className="empty-state">
                    <FiImage size={28} className="mb-2 text-muted" />
                    <div className="fw-semibold">
                      {search
                        ? "No matching categories"
                        : "No categories found"}
                    </div>
                    <div className="text-muted small">
                      {search
                        ? "Try a different search term"
                        : 'Click "Add Category" to create your first one'}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* CATEGORY MODAL */}
      <Modal show={show} onHide={() => !submitting && setShow(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Edit" : "Add"} Category</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Electronics"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="e.g. electronics"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Short description (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Control
                type="text"
                value={form.icon}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, icon: e.target.value }))
                }
                placeholder="e.g. fi-electronics (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Category Image</Form.Label>

              {imagePreview ? (
                <div className="image-preview-box">
                  <img src={imagePreview} alt="Category Preview" />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={clearImage}
                    title="Remove image"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
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
                    JPG, JPEG, PNG or WEBP · Max 5MB
                  </div>
                  <Form.Control
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="d-none"
                  />
                </label>
              )}
            </Form.Group>
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
    </Container>
  );
};

const CATEGORY_STYLES = `
  .page-title {
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    color: #94a3b8;
    font-size: 0.9rem;
  }

  /* ---- Search box ---- */
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
    min-width: 220px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .search-box input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  /* ---- Table card ---- */
  .categories-card {
    border: 1px solid rgba(15, 23, 42, 0.06);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    padding: 8px;
  }

  .categories-table thead th {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #94a3b8;
    font-weight: 600;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    padding: 12px 16px;
  }

  .categories-table tbody td {
    padding: 12px 16px;
    vertical-align: middle;
    border-bottom: 1px solid rgba(15, 23, 42, 0.045);
    font-size: 0.9rem;
  }

  .categories-table tbody tr:last-child td {
    border-bottom: none;
  }

  .categories-table tbody tr:hover {
    background: #f8fafc;
  }

  .cat-thumb {
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.06);
  }

  .cat-thumb--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    color: #94a3b8;
  }

  .slug-badge {
    background: #f1f5f9;
    color: #475569;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-family: "SFMono-Regular", Consolas, monospace;
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
    padding: 22px 16px;
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
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    display: block;
  }

  .image-remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #dc2626;
    color: #fff;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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

export default AdminCategories;
