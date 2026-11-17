const nodemailer = require("nodemailer");

const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const adminEmail = () => process.env.ADMIN_EMAIL || "abhion23connect@gmail.com";

// NOTE: default changed to "Abhion Power Solution" as requested.
// Override via COMPANY_NAME env var if you ever need to.
const companyName = () => process.env.COMPANY_NAME || "Abhion Power Solution";

// Base site URL used to build the "View Product" link.
// Set FRONTEND_URL in your .env to your live domain, e.g.
// FRONTEND_URL=https://abhionpower.com
const siteUrl = () =>
  (process.env.FRONTEND_URL || "https://abhionpower.com").replace(/\/$/, "");

// Pulls a product id whether `enquiry.product` is a raw ObjectId/string
// or a populated object ({ _id, name, ... }).
const getProductId = (enquiry) => {
  const p = enquiry.product;
  if (!p) return null;
  if (typeof p === "string") return p;
  return p.id || p.id || null;
};

// Builds the product page URL. Adjust the path below if your
// frontend route isn't "/products/:id".
const buildProductUrl = (enquiry) => {
  const id = getProductId(enquiry);
  if (!id) return null;
  return `${siteUrl()}/products/${id}`;
};

/* =========================================================
   Service type badge — same colors as the admin dashboard
   ========================================================= */
const serviceTypeBadge = (serviceType) => {
  const isOnline = serviceType === "online";
  const bg = isOnline ? "#eef2ff" : "#fff7ed";
  const color = isOnline ? "#4f46e5" : "#c2410c";
  return `<span style="display:inline-block;padding:3px 12px;border-radius:999px;font-size:12.5px;font-weight:700;text-transform:capitalize;background:${bg};color:${color}">${serviceType || "—"}</span>`;
};

/* =========================================================
   ADMIN TEMPLATE — "New Enquiry Alert" (dashboard-card style)
   ========================================================= */
const adminRow = (label, value, isLast = false) => `
  <tr>
    <td style="padding:11px 0;${isLast ? "" : "border-bottom:1px solid #f1f5f9;"}color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.3px;text-transform:uppercase;width:130px;vertical-align:top">${label}</td>
    <td style="padding:11px 0;${isLast ? "" : "border-bottom:1px solid #f1f5f9;"}color:#0f172a;font-size:14.5px;vertical-align:top">${value}</td>
  </tr>
`;

const buildEnquiryHtml = (enquiry, productLabel, productUrl) => `
  <div style="background:#0f172a;padding:36px 16px;font-family:'Segoe UI',Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto">

      <!-- Alert strip -->
      <div style="background:#1e293b;border-radius:14px 14px 0 0;padding:20px 24px;display:flex;align-items:center;border-bottom:3px solid #f59e0b">
        <table style="width:100%"><tr>
          <td style="vertical-align:middle">
            <span style="display:inline-block;background:#f59e0b;color:#1e293b;font-size:11px;font-weight:800;padding:5px 12px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase">🔔 New Enquiry</span>
          </td>
          <td style="text-align:right;vertical-align:middle">
            <span style="color:#94a3b8;font-size:12px">${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
          </td>
        </tr></table>
      </div>

      <!-- Main card -->
      <div style="background:#ffffff;padding:28px 24px">
        <h2 style="margin:0 0 4px;color:#0f172a;font-size:20px">${enquiry.name} is interested in your product</h2>
        <p style="margin:0 0 22px;color:#64748b;font-size:14px">A new lead has come in through your website. Details below.</p>

        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:20px">
          <p style="margin:0;color:#1e40af;font-size:15px;font-weight:700">
            📦 ${productUrl ? `<a href="${productUrl}" style="color:#1e40af;text-decoration:none">${productLabel}</a>` : productLabel}
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse">
          ${adminRow("Customer", enquiry.name)}
          ${adminRow("Phone", `<a href="tel:+91${enquiry.phone}" style="color:#2563eb;text-decoration:none;font-weight:600">+91 ${enquiry.phone}</a>`)}
          ${adminRow("Email", enquiry.email ? `<a href="mailto:${enquiry.email}" style="color:#2563eb;text-decoration:none">${enquiry.email}</a>` : "—")}
          ${adminRow("City", enquiry.city || "—")}
          ${adminRow("Service Type", serviceTypeBadge(enquiry.serviceType))}
          ${adminRow("Message", enquiry.message, true)}
        </table>

        <!-- Action buttons -->
        <table style="width:100%;border-collapse:collapse;margin-top:24px">
          <tr>
            ${
              productUrl
                ? `<td style="padding-right:8px;width:50%">
                    <a href="${productUrl}" style="display:block;text-align:center;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px;border-radius:8px">
                      🔗 View Product
                    </a>
                  </td>`
                : ""
            }
            <td style="padding-left:${productUrl ? "8px" : "0"};width:${productUrl ? "50%" : "100%"}">
              <a href="tel:+91${enquiry.phone}" style="display:block;text-align:center;background:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px;border-radius:8px">
                📞 Call ${enquiry.name} Now
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#1e293b;border-radius:0 0 14px 14px;padding:14px 24px;text-align:center">
        <p style="margin:0;color:#64748b;font-size:11px">Automated alert from ${companyName()} website</p>
      </div>

    </div>
  </div>
`;

/* =========================================================
   USER TEMPLATE — "Success" confirmation (celebratory style)
   ========================================================= */
const buildUserConfirmationHtml = (enquiry, productLabel, productUrl) => `
  <div style="background:#f0fdf4;padding:36px 16px;font-family:'Segoe UI',Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(22,163,74,0.12)">

      <!-- Success header -->
      <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:38px 24px;text-align:center">
        <div style="width:64px;height:64px;background:#ffffff;border-radius:50%;margin:0 auto 14px;line-height:64px;font-size:32px">✅</div>
        <h1 style="margin:0;color:#ffffff;font-size:22px">Enquiry Submitted Successfully!</h1>
        <p style="margin:8px 0 0;color:#dcfce7;font-size:14px">We've got your request — you're all set.</p>
      </div>

      <!-- Body -->
      <div style="padding:30px 26px">
        <p style="margin:0 0 14px;color:#0f172a;font-size:15px">Dear <strong>${enquiry.name}</strong>,</p>
        <p style="margin:0 0 20px;color:#334155;font-size:14.5px;line-height:1.7">
          Thank you for your enquiry about <strong style="color:#16a34a">${productLabel}</strong>.
          Our team has received your details and will connect with you shortly.
        </p>

        <!-- Summary card -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 20px;margin-bottom:22px">
          <p style="margin:0 0 10px;color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px">Your Enquiry Summary</p>
          <p style="margin:0 0 8px;color:#0f172a;font-size:14px">
            <strong>Product:</strong> ${productUrl ? `<a href="${productUrl}" style="color:#16a34a;text-decoration:none;font-weight:700">${productLabel}</a>` : productLabel}
          </p>
          <p style="margin:0 0 8px;color:#0f172a;font-size:14px"><strong>Service Type:</strong> ${serviceTypeBadge(enquiry.serviceType)}</p>
          <p style="margin:0;color:#0f172a;font-size:14px"><strong>We'll call you on:</strong> +91 ${enquiry.phone}</p>
        </div>

        ${
          productUrl
            ? `<a href="${productUrl}" style="display:block;text-align:center;margin-bottom:24px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px;border-radius:8px">
                🔗 View Product Details
              </a>`
            : ""
        }

        <!-- Steps -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <tr>
            <td style="width:34px;vertical-align:top"><span style="display:inline-block;width:26px;height:26px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:26px;font-size:13px;font-weight:700">1</span></td>
            <td style="padding-bottom:14px;color:#334155;font-size:13.5px">Our team reviews your enquiry</td>
          </tr>
          <tr>
            <td style="width:34px;vertical-align:top"><span style="display:inline-block;width:26px;height:26px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:26px;font-size:13px;font-weight:700">2</span></td>
            <td style="padding-bottom:14px;color:#334155;font-size:13.5px">A representative calls you on your registered number</td>
          </tr>
          <tr>
            <td style="width:34px;vertical-align:top"><span style="display:inline-block;width:26px;height:26px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:26px;font-size:13px;font-weight:700">3</span></td>
            <td style="color:#334155;font-size:13.5px">We help you with the best solution for your needs</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:18px 24px;text-align:center;border-top:1px solid #e2e8f0">
        <p style="margin:0 0 4px;color:#0f172a;font-size:13px;font-weight:700">${companyName()}</p>
        <p style="margin:0;color:#94a3b8;font-size:11.5px">This is an automated confirmation. Please do not reply to this email.</p>
      </div>

    </div>
  </div>
`;

exports.sendEnquiryEmails = async (enquiry, productLabel) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "Email not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS in .env",
    );
    return { sent: false, reason: "not_configured" };
  }

  const from = `"${companyName()}" <${process.env.SMTP_USER}>`;
  const label = productLabel || enquiry.productName || "Product Enquiry";
  const productUrl = buildProductUrl(enquiry);

  try {
    await transporter.sendMail({
      from,
      to: adminEmail(),
      subject: `🔔 New Enquiry: ${label} — ${enquiry.name}`,
      html: buildEnquiryHtml(enquiry, label, productUrl),
    });

    if (enquiry.email) {
      await transporter.sendMail({
        from,
        to: enquiry.email,
        subject: `✅ Enquiry Received — ${label}`,
        html: buildUserConfirmationHtml(enquiry, label, productUrl),
      });
    }

    return { sent: true };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { sent: false, reason: err.message };
  }
};

/* =========================================================
   CONTACT FORM — same two-template pattern
   ========================================================= */
const buildContactAdminHtml = (contact) => `
  <div style="background:#0f172a;padding:36px 16px;font-family:'Segoe UI',Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto">
      <div style="background:#1e293b;border-radius:14px 14px 0 0;padding:20px 24px;border-bottom:3px solid #f59e0b">
        <span style="display:inline-block;background:#f59e0b;color:#1e293b;font-size:11px;font-weight:800;padding:5px 12px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase">💬 Website Contact</span>
      </div>
      <div style="background:#ffffff;padding:28px 24px">
        <h2 style="margin:0 0 20px;color:#0f172a;font-size:19px">New message from ${contact.name}</h2>
        <table style="width:100%;border-collapse:collapse">
          ${adminRow("Name", contact.name)}
          ${adminRow("Phone", `<a href="tel:+91${contact.phone}" style="color:#2563eb;text-decoration:none;font-weight:600">+91 ${contact.phone}</a>`)}
          ${adminRow("Email", contact.email ? `<a href="mailto:${contact.email}" style="color:#2563eb;text-decoration:none">${contact.email}</a>` : "—")}
          ${adminRow("Message", contact.message, true)}
        </table>
      </div>
      <div style="background:#1e293b;border-radius:0 0 14px 14px;padding:14px 24px;text-align:center">
        <p style="margin:0;color:#64748b;font-size:11px">Automated alert from ${companyName()} website</p>
      </div>
    </div>
  </div>
`;

const buildContactUserHtml = (contact) => `
  <div style="background:#f0fdf4;padding:36px 16px;font-family:'Segoe UI',Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(22,163,74,0.12)">
      <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:38px 24px;text-align:center">
        <div style="width:64px;height:64px;background:#ffffff;border-radius:50%;margin:0 auto 14px;line-height:64px;font-size:32px">✅</div>
        <h1 style="margin:0;color:#ffffff;font-size:22px">Message Received Successfully!</h1>
      </div>
      <div style="padding:30px 26px">
        <p style="margin:0 0 14px;color:#0f172a;font-size:15px">Dear <strong>${contact.name}</strong>,</p>
        <p style="margin:0;color:#334155;font-size:14.5px;line-height:1.7">
          Thank you for reaching out to ${companyName()}. We've received your message and our team will get back to you shortly.
        </p>
      </div>
      <div style="background:#f8fafc;padding:18px 24px;text-align:center;border-top:1px solid #e2e8f0">
        <p style="margin:0 0 4px;color:#0f172a;font-size:13px;font-weight:700">${companyName()}</p>
        <p style="margin:0;color:#94a3b8;font-size:11.5px">This is an automated confirmation. Please do not reply to this email.</p>
      </div>
    </div>
  </div>
`;

exports.sendContactEmails = async (contact) => {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "not_configured" };

  const from = `"${companyName()}" <${process.env.SMTP_USER}>`;

  try {
    await transporter.sendMail({
      from,
      to: adminEmail(),
      subject: `💬 Contact Form: ${contact.name}`,
      html: buildContactAdminHtml(contact),
    });

    if (contact.email) {
      await transporter.sendMail({
        from,
        to: contact.email,
        subject: "✅ We received your message",
        html: buildContactUserHtml(contact),
      });
    }

    return { sent: true };
  } catch (err) {
    console.error("Contact email failed:", err.message);
    return { sent: false, reason: err.message };
  }
};
