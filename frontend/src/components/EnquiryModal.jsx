// import { useState, useEffect } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { COMPANY } from "../config/company";
// import { formatPrice } from "../utils/format";
// import { getProductImages, getImageUrl } from "../utils/image";
// import { submitEnquiry, getErrorMessage } from "../api/services";

// const STEPS = { DETAILS: 1, TYPE: 2, MESSAGE: 3, DONE: 4 };

// const EnquiryModal = ({ show, onHide, product }) => {
//   const [step, setStep] = useState(STEPS.DETAILS);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [serviceType, setServiceType] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!show) {
//       setStep(STEPS.DETAILS);
//       setName("");
//       setEmail("");
//       setPhone("");
//       setServiceType("");
//       setMessage("");
//     }
//   }, [show]);

//   if (!product) return null;

//   const images = getProductImages(product);
//   const mainImage = images[0];

//   const handleDetailsSubmit = (e) => {
//     e.preventDefault();
//     if (!name.trim()) {
//       toast.error("Please enter your name");
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       toast.error("Enter valid email address");
//       return;
//     }
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       toast.error("Enter valid 10-digit mobile number");
//       return;
//     }
//     setStep(STEPS.TYPE);
//   };

//   const handleSelectType = (type) => {
//     setServiceType(type);
//     setStep(STEPS.MESSAGE);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) {
//       toast.error("Please enter your message");
//       return;
//     }
//     setLoading(true);
//     try {
//       await submitEnquiry({
//         name: name.trim(),
//         email: email.trim(),
//         phone,
//         message: message.trim(),
//         serviceType,
//         product: product._id,
//         category: product.category?._id || product.category,
//         productName: product.name,
//       });
//       setStep(STEPS.DONE);
//       toast.success("Enquiry submitted! Check your email for confirmation.");
//     } catch (err) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered size="lg" className="enquiry-modal">
//       <Modal.Header closeButton className="border-0 pb-0">
//         <Modal.Title className="fs-6 fw-bold text-muted">
//           Connect with {COMPANY.name}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="pt-2">
//         <div className="enquiry-modal-grid">
//           <div className="enquiry-product-panel">
//             <div className="enquiry-product-img">
//               {mainImage ? (
//                 <img src={getImageUrl(mainImage)} alt={product.name} />
//               ) : (
//                 <div className="enquiry-product-placeholder">⚡</div>
//               )}
//             </div>
//             <h5 className="fw-bold mt-3">{product.name}</h5>
//             <p className="enquiry-price mb-1">{formatPrice(product.price, product.priceUnit)}</p>
//             <p className="small text-muted mb-2">Sold By — {COMPANY.name}</p>
//             {product.specs?.length > 0 && (
//               <ul className="enquiry-specs small mb-0">
//                 {product.specs.slice(0, 5).map((s) => (
//                   <li key={s.key}>
//                     <strong>{s.key}:</strong> {s.value}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="enquiry-form-panel">
//             <div className="step-dots mb-3">
//               {[1, 2, 3].map((n) => (
//                 <span key={n} className={`step-dot ${step >= n ? "active" : ""}`} />
//               ))}
//             </div>

//             {step === STEPS.DETAILS && (
//               <form onSubmit={handleDetailsSubmit}>
//                 <p className="small text-muted mb-3">
//                   Get details of <strong>{product.name}</strong>. Email confirmation bheja jayega.
//                 </p>
//                 <Form.Group className="mb-2">
//                   <Form.Label className="fw-semibold">Your Name</Form.Label>
//                   <Form.Control
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Full name"
//                     className="sh-input"
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-2">
//                   <Form.Label className="fw-semibold">Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="your@email.com"
//                     className="sh-input"
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold">Mobile Number</Form.Label>
//                   <div className="phone-input-wrap">
//                     <span className="phone-prefix">🇮🇳 +91</span>
//                     <Form.Control
//                       type="tel"
//                       maxLength={10}
//                       placeholder="10-digit mobile"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
//                       className="sh-input phone-input"
//                       required
//                     />
//                   </div>
//                 </Form.Group>
//                 <Button type="submit" className="btn-enquiry w-100">
//                   Continue
//                 </Button>
//               </form>
//             )}

//             {step === STEPS.TYPE && (
//               <div>
//                 <p className="fw-bold mb-1">{product.name}</p>
//                 <p className="small text-muted mb-3">Aapko ye product kaise chahiye?</p>
//                 <div className="d-grid gap-2">
//                   <Button className="btn-type-select" onClick={() => handleSelectType("online")}>
//                     Online chahiye
//                   </Button>
//                   <Button className="btn-type-select offline" onClick={() => handleSelectType("offline")}>
//                     Offline chahiye
//                   </Button>
//                 </div>
//                 <Button
//                   type="button"
//                   variant="link"
//                   className="p-0 small mt-2"
//                   onClick={() => setStep(STEPS.DETAILS)}
//                 >
//                   Change details
//                 </Button>
//               </div>
//             )}

//             {step === STEPS.MESSAGE && (
//               <form onSubmit={handleSubmit}>
//                 <p className="small mb-2">
//                   <strong>{product.name}</strong> —{" "}
//                   <span className="badge bg-primary text-capitalize">{serviceType}</span>
//                 </p>
//                 <Form.Label className="fw-semibold">Your Message</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={4}
//                   placeholder="Quantity, location, requirement likhiye..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="sh-input mb-3"
//                   required
//                 />
//                 <Button type="submit" className="btn-enquiry w-100" disabled={loading}>
//                   {loading ? <Spinner size="sm" /> : "Submit Enquiry"}
//                 </Button>
//               </form>
//             )}

//             {step === STEPS.DONE && (
//               <div className="text-center py-3">
//                 <div className="success-icon mb-3">✓</div>
//                 <h5 className="fw-bold">Thank you, {name}!</h5>
//                 <p className="text-muted small mb-3">
//                   Enquiry submit ho gayi. Confirmation email <strong>{email}</strong> par bheja gaya hai.
//                   Hum +91 {phone} par contact karenge.
//                 </p>
//                 <Button className="btn-enquiry" onClick={onHide}>Close</Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default EnquiryModal;

import { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { COMPANY } from "../config/company";
import { submitEnquiry, getErrorMessage } from "../api/services";

const EnquiryModal = ({ show, onHide, product }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("online");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!show) {
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setServiceType("online");
      setMessage("");
      setDone(false);
    }
  }, [show]);

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Enter a valid email address");
    if (!/^[6-9]\d{9}$/.test(phone))
      return toast.error("Enter a valid 10-digit mobile number");
    if (!city.trim()) return toast.error("Please enter your location");

    setLoading(true);
    try {
      await submitEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone,
        city: city.trim(),
        message: message.trim(),
        serviceType,
        product: product.id,
        category: product.category?.id || product.category,
        productName: product.name,
      });
      setDone(true);
      toast.success("Enquiry submitted! Check your email for confirmation.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="eq-modal">
      <style>{`
        .eq-modal .modal-content {
          border: none;
          border-radius: 18px;
          overflow: hidden;
        }
        .eq-wrap {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          background: #ffffff;
        }
        .eq-head {
        background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
          padding: 22px 28px 20px;
          position: relative;
        }
        .eq-head-eyebrow {
          color: #070707;
          font-size: 12.5px;
          margin: 0 0 4px;
        }
        .eq-head-title {
          color: #fff;
          font-size: 19px;
          font-weight: 650;
          margin: 0;
          line-height: 1.3;
          padding-right: 30px;
        }
        .eq-head-close {
          position: absolute;
          top: 16px;
          right: 18px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #dbe4f2;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .eq-head-close:hover { background: rgba(255,255,255,0.2); }

        .eq-body { padding: 24px 28px 26px; }

        .eq-field { margin-bottom: 16px; }
        .eq-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #10233f;
          margin-bottom: 6px;
        }
        .eq-input, .eq-textarea {
          width: 100%;
          border: 1.5px solid #dfe4ec;
          border-radius: 10px;
          padding: 10px 13px;
          font-size: 14.5px;
          color: #10233f;
          background: #fbfcfe;
          transition: border-color 0.15s ease, background 0.15s ease;
          outline: none;
        }
        .eq-input:focus, .eq-textarea:focus {
          border-color: #e08c1a;
          background: #fff;
        }
        .eq-textarea { resize: none; }

        .eq-phone-row {
          display: flex;
          border: 1.5px solid #dfe4ec;
          border-radius: 10px;
          background: #fbfcfe;
          overflow: hidden;
        }
        .eq-phone-row:focus-within {
          border-color: #e08c1a;
          background: #fff;
        }
        .eq-phone-prefix {
          padding: 10px 12px;
          font-size: 14px;
          color: #5c6b82;
          border-right: 1.5px solid #dfe4ec;
          background: #f2f4f8;
          white-space: nowrap;
        }
        .eq-phone-row input {
          border: none;
          background: transparent;
          padding: 10px 12px;
          font-size: 14.5px;
          color: #10233f;
          width: 100%;
          outline: none;
        }

        .eq-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .eq-toggle-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .eq-toggle {
          position: relative;
          border: 1.5px solid #dfe4ec;
          border-radius: 10px;
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          background: #fbfcfe;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .eq-toggle.checked {
          border-color: #e08c1a;
          background: #fff6ea;
        }
        .eq-toggle-box {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid #b8c1cf;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .eq-toggle.checked .eq-toggle-box {
          border-color: #e08c1a;
          background: #e08c1a;
        }
        .eq-toggle-box svg { display: none; }
        .eq-toggle.checked .eq-toggle-box svg { display: block; }
        .eq-toggle-text { font-size: 13.5px; font-weight: 600; color: #10233f; }

        .eq-submit {
          width: 100%;
          border: none;
          border-radius: 10px;
      background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
          color: #fff;
          font-weight: 650;
          font-size: 14.5px;
          padding: 12px;
          cursor: pointer;
          transition: background 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
       .eq-submit:hover {  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);}
        .eq-submit:disabled { opacity: 0.7; cursor: default; }

        .eq-done {
          text-align: center;
          padding: 20px 6px 8px;
        }
        .eq-done-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #eaf7ee;
          color: #1f9d55;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 14px;
        }
        .eq-done h5 { font-weight: 650; color: #10233f; margin-bottom: 8px; }
        .eq-done p { color: #6b7686; font-size: 13.5px; margin-bottom: 20px; }
        .eq-done-btn {
          border: none;
          border-radius: 10px;
          background: #10233f;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 22px;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .eq-row-two { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="eq-wrap">
        <div className="eq-head">
          <p className="eq-head-eyebrow">Enquire with {COMPANY.name}</p>
          <h3 className="eq-head-title">{product.name}</h3>
          <button className="eq-head-close" onClick={onHide} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="eq-body">
          {!done ? (
            <form onSubmit={handleSubmit}>
              <div className="eq-field">
                <label className="eq-label">Full Name</label>
                <input
                  className="eq-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="eq-row-two">
                <div className="eq-field">
                  <label className="eq-label">Email</label>
                  <input
                    type="email"
                    className="eq-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="eq-field">
                  <label className="eq-label">Mobile Number</label>
                  <div className="eq-phone-row">
                    <span className="eq-phone-prefix">🇮🇳 +91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
              </div>

              <div className="eq-field">
                <label className="eq-label">Location</label>
                <input
                  className="eq-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / area"
                />
              </div>

              <div className="eq-field">
                <label className="eq-label">
                  How do you want this product?
                </label>
                <div className="eq-toggle-group">
                  <label
                    className={`eq-toggle ${serviceType === "online" ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={serviceType === "online"}
                      onChange={() => setServiceType("online")}
                      hidden
                    />
                    <span className="eq-toggle-box">
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4.5L4 7.5L10 1.5"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="eq-toggle-text">Online</span>
                  </label>
                  <label
                    className={`eq-toggle ${serviceType === "offline" ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={serviceType === "offline"}
                      onChange={() => setServiceType("offline")}
                      hidden
                    />
                    <span className="eq-toggle-box">
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4.5L4 7.5L10 1.5"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="eq-toggle-text">Offline</span>
                  </label>
                </div>
              </div>

              <div className="eq-field" style={{ marginBottom: 20 }}>
                <label className="eq-label">Message (optional)</label>
                <textarea
                  className="eq-textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Quantity, requirement, anything else to share"
                />
              </div>

              <button type="submit" className="eq-submit" disabled={loading}>
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Submit Enquiry"
                )}
              </button>
            </form>
          ) : (
            <div className="eq-done">
              <div className="eq-done-icon">✓</div>
              <h5>Thank you, {name}!</h5>
              <p>
                We've received your enquiry for <strong>{product.name}</strong>.
                A confirmation has been sent to {email}, and our team will reach
                out on +91 {phone} soon.
              </p>
              <button className="eq-done-btn" onClick={onHide}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EnquiryModal;
