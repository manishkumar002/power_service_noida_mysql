import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/services";

const Login = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const data = await login({ email: form.email, password: form.password });
      if (data.role !== "admin") {
        logout();
        toast.error("Only admin can login here");
        return;
      }
      toast.success("Welcome, Admin!");
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="sh-card auth-card">
        <h2 className="text-center mb-1">Admin Login</h2>
        <p className="text-center text-muted mb-4">
          Manage categories, products &amp; enquiries
        </p>
        <Alert variant="light" className="small border">
          Demo: <strong>admin@powersolutions.com</strong> / <strong>admin123</strong>
          <br />
          Run <code>npm run seed</code> once if admin is missing.
        </Alert>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              isInvalid={!!errors.email}
              required
              className="sh-input"
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              isInvalid={!!errors.password}
              required
              className="sh-input"
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="w-100 btn-sh-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
