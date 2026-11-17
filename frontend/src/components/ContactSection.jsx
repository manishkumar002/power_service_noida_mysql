import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { COMPANY } from "../config/company";
import { submitContact, getErrorMessage } from "../api/services";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      toast.success("Message sent! We will contact you soon.");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section-dark mt-5">
      <div className="contact-section-inner">
        <div className="section-heading">
          <h2>
            <span className="gradient-text">Contact Us </span>
          </h2>
          <p className="gradient-text">{COMPANY.name}</p>
          <p className="contact-address">{COMPANY.address}</p>
          <div className="contact-actions-list">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              📍 Get Directions
            </a>
            <a href={`mailto:${COMPANY.email}`}>✉ Send Email</a>
            <a href={`tel:${COMPANY.phone}`}>📞 {COMPANY.phoneDisplay}</a>
          </div>
          <div className="contact-social">
            <span>Share:</span>
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="LinkedIn">
              in
            </a>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
          </div>
        </div>

        <div className="contact-form-col">
          <div className="contact-form-box sh-card">
            <h5>Describe Your Requirement</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Control
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="sh-input"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  placeholder="Mobile Number (10 digits)"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  required
                  className="sh-input"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="I would like to..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  className="sh-input"
                />
              </Form.Group>
              <Button
                type="submit"
                className="btn-get-quote w-100"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Submit"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
