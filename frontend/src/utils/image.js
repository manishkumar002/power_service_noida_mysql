export const getProductImages = (product) => {
  if (!product) return [];

  if (product.images?.length) {
    return product.images;
  }
  if (product.image) {
    return [product.image];
  }

  return [];
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = import.meta.env.VITE_API_URL || "";

  return `${baseUrl}${imagePath}`;
};

export const getCategoryImage = (category) => {
  if (!category) return "";

  if (category.categoryImage) {
    return category.categoryImage;
  }

  return "";
};
