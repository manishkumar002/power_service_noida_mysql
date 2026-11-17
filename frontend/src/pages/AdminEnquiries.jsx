import { useEffect, useMemo, useState } from "react";
import { Container, Table, Form, Modal, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiEye,
  FiInbox,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";

import { formatDate } from "../utils/format";
import {
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getErrorMessage,
} from "../api/services";

const SkeletonRow = () => (
  <tr>
    <td>
      <div className="skeleton-line" style={{ width: 80, height: 12 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "70%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "60%", height: 14 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: "60%", height: 14 }} />
    </td>
    <td>
      <div
        className="skeleton-line"
        style={{ width: 70, height: 20, borderRadius: 999 }}
      />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: 100, height: 28 }} />
    </td>
    <td>
      <div className="skeleton-line" style={{ width: 60, height: 28 }} />
    </td>
  </tr>
);

const statusMeta = {
  new: { label: "New", cls: "status-new" },
  contacted: { label: "Contacted", cls: "status-contacted" },
  closed: { label: "Closed", cls: "status-closed" },
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminEnquiries();
      setEnquiries(data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);
      toast.success("Status updated");
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e)),
      );
      setSelected((prev) =>
        prev && prev.id === id ? { ...prev, status } : prev,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const filteredEnquiries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      const matchesSearch =
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        (e.productName || e.product?.name || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?",
    );

    if (!confirmed) return;

    try {
      await deleteEnquiry(id);

      toast.success("Enquiry deleted successfully");

      setEnquiries((prev) => prev.filter((e) => e.id !== id));

      setSelected((prev) => (prev?.id === id ? null : prev));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Container>
      <style>{ENQUIRY_STYLES}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Customer Enquiries</h1>
          <p className="page-subtitle mb-0">
            {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}{" "}
            total &middot; leads from product clicks
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="search-box">
            <FiSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search name, mobile, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Form.Select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </Form.Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="sh-card enquiries-card table-responsive">
        <Table hover className="mb-0 enquiries-table align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Product</th>
              <th>Type</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((e) => (
                <tr key={e.id}>
                  <td className="small text-nowrap text-muted">
                    {formatDate(e.createdAt)}
                  </td>
                  <td className="fw-semibold">{e.name || "—"}</td>
                  <td className="text-nowrap">+91 {e.phone}</td>
                  <td>{e.productName || e.product?.name || "—"}</td>
                  <td>
                    <span className={`type-badge ${e.serviceType}`}>
                      {e.serviceType}
                    </span>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      className={`status-select ${statusMeta[e.status]?.cls || ""}`}
                      value={e.status}
                      onChange={(ev) => handleStatus(e.id, ev.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </Form.Select>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      {/* View */}
                      <button
                        type="button"
                        className="icon-btn icon-btn--view"
                        onClick={() => setSelected(e)}
                        title="View details"
                      >
                        <FiEye size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="icon-btn icon-btn--delete"
                        onClick={() => handleDelete(e.id)}
                        title="Delete enquiry"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div className="empty-state">
                    <FiInbox size={28} className="mb-2 text-muted" />
                    <div className="fw-semibold">
                      {search || statusFilter !== "all"
                        ? "No matching enquiries"
                        : "No enquiries yet"}
                    </div>
                    <div className="text-muted small">
                      {search || statusFilter !== "all"
                        ? "Try a different search or filter"
                        : "Leads from product clicks will show up here"}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* DETAILS MODAL */}
      <Modal
        show={!!selected}
        onHide={() => setSelected(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Enquiry Details</Modal.Title>
        </Modal.Header>
        {selected && (
          <Modal.Body>
            <div className="detail-grid">
              <DetailRow label="Date" value={formatDate(selected.createdAt)} />
              <DetailRow label="Status">
                <Badge
                  bg={statusColor(selected.status)}
                  className="text-capitalize"
                >
                  {selected.status}
                </Badge>
              </DetailRow>
              <DetailRow
                label="Name"
                value={selected.name || "—"}
                icon={<FiEye size={12} />}
              />
              <DetailRow
                label="Email"
                value={selected.email || "—"}
                icon={<FiMail size={12} />}
              />
              <DetailRow
                label="Mobile"
                value={`+91 ${selected.phone}`}
                icon={<FiPhone size={12} />}
              />
              <DetailRow
                label="Location"
                value={selected.city || "—"}
                icon={<FiMapPin size={12} />}
              />
              <DetailRow
                label="Service Type"
                value={
                  <span className={`type-badge ${selected.serviceType}`}>
                    {selected.serviceType}
                  </span>
                }
              />
              <DetailRow
                label="Product"
                value={selected.productName || selected.product?.name || "—"}
              />
              {selected.product?.price != null && (
                <DetailRow
                  label="Price"
                  value={`₹${selected.product.price}${
                    selected.product.priceUnit
                      ? ` / ${selected.product.priceUnit}`
                      : ""
                  }`}
                />
              )}
              {selected.category?.name && (
                <DetailRow label="Category" value={selected.category.name} />
              )}
            </div>

            {/* {selected.product?.description && (
              <>
                <hr className="my-3" />
                <p className="fw-semibold mb-1">Product Description</p>
                <p
                  className="text-muted mb-0"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {selected.product.description}
                </p>
              </>
            )} */}

            {selected.product?.specs?.length > 0 && (
              <>
                <hr className="my-3" />
                <p className="fw-semibold mb-2">Specifications</p>
                <ul className="spec-list mb-0">
                  {selected.product.specs.map((s) => (
                    <li key={s.key}>
                      <span className="spec-key">{s.key}</span>
                      <span className="spec-val">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <hr className="my-3" />
            <p className="fw-semibold mb-1">Message</p>
            <p className="text-muted mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {selected.message || "No message provided"}
            </p>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const DetailRow = ({ label, value, children, icon }) => (
  <div className="detail-row">
    <span className="detail-label">
      {icon && <span className="detail-icon">{icon}</span>} {label}
    </span>
    <span className="detail-value">{children ?? value}</span>
  </div>
);

const statusColor = (status) => {
  if (status === "contacted") return "warning";
  if (status === "closed") return "secondary";
  return "success";
};

const ENQUIRY_STYLES = `
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
    min-width: 240px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .search-box input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  .status-filter {
    border: 1px solid rgba(15, 23, 42, 0.1) !important;
    border-radius: 10px !important;
    font-size: 0.85rem !important;
    padding: 8px 30px 8px 12px !important;
    min-width: 140px;
  }

  /* ---- Table card ---- */
  .enquiries-card {
    border: 1px solid rgba(15, 23, 42, 0.06);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    padding: 8px;
  }

  .enquiries-table thead th {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #94a3b8;
    font-weight: 600;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    padding: 12px 16px;
  }

  .enquiries-table tbody td {
    padding: 12px 16px;
    vertical-align: middle;
    border-bottom: 1px solid rgba(15, 23, 42, 0.045);
    font-size: 0.88rem;
  }

  .enquiries-table tbody tr:last-child td {
    border-bottom: none;
  }

  .enquiries-table tbody tr:hover {
    background: #f8fafc;
  }

  /* ---- Type badge ---- */
  .type-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  .type-badge.online {
    background: #eef2ff;
    color: #4f46e5;
  }
  .type-badge.offline {
    background: #fff7ed;
    color: #c2410c;
  }

  /* ---- Status select ---- */
  .status-select {
    border-radius: 8px !important;
    font-size: 0.82rem !important;
    font-weight: 600;
    border: 1px solid rgba(15, 23, 42, 0.1) !important;
  }
  .status-select.status-new {
    color: #15803d;
    background-color: #f0fdf4 !important;
  }
  .status-select.status-contacted {
    color: #b45309;
    background-color: #fffbeb !important;
  }
  .status-select.status-closed {
    color: #475569;
    background-color: #f1f5f9 !important;
  }

  /* ---- Action icon button ---- */
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
  .icon-btn--view {
    color: #6366f1;
  }
  .icon-btn--view:hover {
    background: #6366f114;
    border-color: #6366f13a;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #475569;
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

  /* ---- Modal detail grid ---- */
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 24px;
  }
  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-bottom: 1px solid #eef0f3;
    padding-bottom: 8px;
  }
  .detail-label {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #9aa3b0;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .detail-icon {
    display: inline-flex;
    color: #b7bfcb;
  }
  .detail-value {
    font-size: 14.5px;
    color: #1c2430;
    word-break: break-word;
  }
  @media (max-width: 520px) {
    .detail-grid { grid-template-columns: 1fr; }
  }

  .spec-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
  }
  .spec-list li {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 13.5px;
    border-bottom: 1px dashed #e9ecf1;
    padding-bottom: 6px;
  }
  .spec-key { color: #7a8393; }
  .spec-val { color: #1c2430; font-weight: 600; text-align: right; }
  @media (max-width: 520px) {
    .spec-list { grid-template-columns: 1fr; }
  }
`;

export default AdminEnquiries;
