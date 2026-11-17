const parseSpecs = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* fall through to line format */
  }
  return String(raw)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return { key: key.trim(), value: rest.join(":").trim() };
    })
    .filter((s) => s.key && s.value);
};

exports.parseProductBody = (body) => {
  const specs = parseSpecs(body.specs);
  const existingImages = body.existingImages
    ? (Array.isArray(body.existingImages)
        ? body.existingImages
        : JSON.parse(body.existingImages))
    : [];

  return {
    name: body.name?.trim(),
    slug: body.slug?.toLowerCase().trim(),
    description: body.description?.trim() || "",
    technicalDetails: body.technicalDetails?.trim() || "",
    price: Number(body.price),
    priceUnit: body.priceUnit || "Piece",
    category:
      body.category !== undefined && body.category !== ""
        ? Number(body.category)
        : undefined,
    minOrderQuantity: Number(body.minOrderQuantity) || 1,
    specs,
    isActive: body.isActive === "false" || body.isActive === false ? false : body.isActive !== "false",
    isFeatured:
      body.isFeatured === "true" || body.isFeatured === true,
    existingImages,
  };
};

exports.mapUploadedFiles = (files = {}) => {
  const images = (files.images || []).map((f) => `/uploads/products/${f.filename}`);
  const brochure = files.brochure?.[0]
    ? `/uploads/products/${files.brochure[0].filename}`
    : null;
  return { images, brochure };
};
