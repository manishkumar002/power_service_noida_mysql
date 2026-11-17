require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { createCategory } = require("../models/category");
const { createProduct } = require("../models/product");
const { getUserByEmail, createUser } = require("../models/users");

const categories = [
  {
    name: "Online UPS",
    slug: "online-ups",
    icon: "⚡",
    description:
      "High-performance online double conversion UPS systems for IT & data centers",
  },
  {
    name: "Three Phase UPS",
    slug: "three-phase-ups",
    icon: "🔌",
    description: "Industrial three phase UPS for critical power backup",
  },
  {
    name: "Industrial UPS Systems",
    slug: "industrial-ups-systems",
    icon: "🏭",
    description: "Heavy-duty industrial UPS for manufacturing & data centers",
  },
  {
    name: "IGBT Online UPS",
    slug: "igbt-online-ups",
    icon: "🔋",
    description: "Advanced IGBT-based online UPS systems with high efficiency",
  },
  {
    name: "Refurbished UPS",
    slug: "refurbished-ups",
    icon: "♻️",
    description: "Quality refurbished UPS with warranty at competitive prices",
  },
  {
    name: "UPS Rental",
    slug: "ups-rental",
    icon: "📦",
    description: "Industrial UPS on rent across Delhi NCR & PAN India",
  },
  {
    name: "Used UPS",
    slug: "used-ups",
    icon: "🔄",
    description: "Pre-owned UPS systems tested and certified",
  },
  {
    name: "UPS Repairing Services",
    slug: "ups-repairing-services",
    icon: "🔧",
    description: "Expert UPS repair, AMC and maintenance services",
  },
  {
    name: "UPS Batteries & Accessories",
    slug: "ups-batteries-accessories",
    icon: "🔋",
    description: "SMF VRLA batteries, battery banks and UPS accessories",
  },
  {
    name: "Servo Stabilizers",
    slug: "servo-stabilizers",
    icon: "📊",
    description: "Single & three phase servo voltage stabilizers",
  },
];

const productTemplates = {
  "online-ups": [
    { cap: "1 kVA", price: 18500 },
    { cap: "3 kVA", price: 42000 },
    { cap: "6 kVA", price: 68000 },
    { cap: "10 kVA", price: 95000 },
    { cap: "20 kVA", price: 185000 },
  ],
  "three-phase-ups": [
    { cap: "10 kVA", price: 125000 },
    { cap: "20 kVA", price: 220000 },
    { cap: "30 kVA", price: 310000 },
    { cap: "40 kVA", price: 395000 },
    { cap: "60 kVA", price: 520000 },
  ],
  "industrial-ups-systems": [
    { cap: "20 kVA", price: 245000 },
    { cap: "40 kVA", price: 420000 },
    { cap: "60 kVA", price: 580000 },
    { cap: "80 kVA", price: 720000 },
    { cap: "100 kVA", price: 890000 },
  ],
  "igbt-online-ups": [
    { cap: "6 kVA", price: 72000 },
    { cap: "10 kVA", price: 98000 },
    { cap: "15 kVA", price: 142000 },
    { cap: "20 kVA", price: 188000 },
    { cap: "30 kVA", price: 265000 },
  ],
  "refurbished-ups": [
    { cap: "3 kVA", price: 22000 },
    { cap: "6 kVA", price: 38000 },
    { cap: "10 kVA", price: 55000 },
    { cap: "20 kVA", price: 95000 },
    { cap: "40 kVA", price: 165000 },
  ],
  "ups-rental": [
    { cap: "10 kVA / Month", price: 8500 },
    { cap: "20 kVA / Month", price: 15000 },
    { cap: "40 kVA / Month", price: 28000 },
    { cap: "60 kVA / Month", price: 42000 },
    { cap: "100 kVA / Month", price: 65000 },
  ],
  "used-ups": [
    { cap: "3 kVA", price: 15000 },
    { cap: "6 kVA", price: 28000 },
    { cap: "10 kVA", price: 42000 },
    { cap: "20 kVA", price: 78000 },
    { cap: "40 kVA", price: 135000 },
  ],
  "ups-repairing-services": [
    { cap: "AMC Basic", price: 3500 },
    { cap: "AMC Standard", price: 6500 },
    { cap: "AMC Premium", price: 12000 },
    { cap: "On-site Repair", price: 2500 },
    { cap: "Battery Replacement", price: 8500 },
  ],
  "ups-batteries-accessories": [
    { cap: "12V 7Ah SMF", price: 850 },
    { cap: "12V 42Ah SMF", price: 4200 },
    { cap: "12V 100Ah SMF", price: 9800 },
    { cap: "Battery Bank 20Ah", price: 18500 },
    { cap: "Battery Bank 40Ah", price: 32000 },
  ],
  "servo-stabilizers": [
    { cap: "1 kVA Single Phase", price: 8500 },
    { cap: "3 kVA Single Phase", price: 14500 },
    { cap: "5 kVA Single Phase", price: 22000 },
    { cap: "10 kVA Three Phase", price: 45000 },
    { cap: "20 kVA Three Phase", price: 78000 },
  ],
};

function buildProducts(categorySlug, categoryName) {
  const templates = productTemplates[categorySlug] || [];

  return templates.map((t, index) => {
    const slug = `${categorySlug}-${t.cap.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    return {
      categorySlug,
      name: `${categoryName} ${t.cap}`,
      slug,
      description: `${categoryName} — ${t.cap}. Contact us for best price and installation.`,
      price: t.price,
      priceUnit: categorySlug === "ups-rental" ? "Month" : "Piece",
      specs: [
        { key: "Capacity", value: t.cap },
        { key: "Category", value: categoryName },
      ],
      technicalDetails:
        "* Input Phase: 3 Phase\n* Output Phase: 1 Phase\n* Frequency: 50 Hz ± 0.1%\n* Waveform: Pure Sine Wave\n* Protection: Overload, Short Circuit, Over Temperature\n* Display: LCD with LED indicators\n* Communication: RS232 / SNMP (optional)",
    };
  });
}

async function seed() {
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("TRUNCATE TABLE product_specs");
  await db.execute("TRUNCATE TABLE products");
  await db.execute("TRUNCATE TABLE categories");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");

  const createdCategories = {};

  for (const cat of categories) {
    const doc = await createCategory({
      ...cat,
      isActive: true,
    });
    createdCategories[cat.slug] = doc.id;
  }

  let productCount = 0;

  for (const cat of categories) {
    const prods = buildProducts(cat.slug, cat.name);

    for (const prod of prods) {
      const { categorySlug, ...rest } = prod;

      await createProduct({
        ...rest,
        category_id: createdCategories[categorySlug],
        images: [],
        isActive: true,
        isFeatured: productCount < 6,
      });

      productCount++;
    }
  }

  const adminEmail = "admin@powersolutions.com";
  const existingAdmin = await getUserByEmail(adminEmail);

  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 10);

    await createUser({
      role: "admin",
      name: "Admin",
      email: adminEmail,
      phone: "9876543210",
      password: hashed,
    });

    console.log("Admin created: admin@powersolutions.com / admin123");
  } else {
    console.log("Admin already exists");
  }

  console.log(
    `Seeded ${categories.length} categories and ${productCount} products`,
  );

  await db.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
