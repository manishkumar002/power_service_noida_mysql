// import { Link } from "react-router-dom";

// const CategorySidebar = ({
//   categories,
//   products,
//   productCounts,
//   activeSlug,
// }) => {
//   const scrollToProduct = (productId) => {
//     const el = document.getElementById(`product-${productId}`);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   return (
//     <aside className="category-sidebar">
//       <h6 className="category-sidebar-heading">Products &amp; Services</h6>

//       <nav className="category-sidebar-nav">
//         {categories.map((cat) => {
//           const count = productCounts[cat.id] || 0;
//           const isActive = cat.slug === activeSlug;

//           const categoryProducts = products
//             .filter(
//               (product) =>
//                 (product.category?.id || product.category)?.toString() ===
//                 cat.id.toString(),
//             )
//             .slice(0, 5);

//           return (
//             <div key={cat.id} className="category-sidebar-group">
//               {/* Category */}
//               <Link
//                 to={`/category/${cat.slug}`}
//                 className={`category-sidebar-item ${isActive ? "active" : ""}`}
//               >
//                 <span className="category-sidebar-name">
//                   {cat.icon && (
//                     <span className="cat-side-icon">{cat.icon}</span>
//                   )}

//                   <span>
//                     {cat.name} ({count})
//                   </span>
//                 </span>

//                 {/* Chevron */}
//                 <span className={`category-chevron ${isActive ? "open" : ""}`}>
//                   <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="6 9 12 15 18 9" />
//                   </svg>
//                 </span>
//               </Link>

//               {/* Products - click scrolls to product on this page, does NOT navigate */}
//               {isActive && categoryProducts.length > 0 && (
//                 <div className="category-sidebar-products">
//                   {categoryProducts.map((product) => (
//                     <button
//                       key={product.id}
//                       type="button"
//                       className="category-sidebar-product"
//                       onClick={() => scrollToProduct(product.id)}
//                     >
//                       {product.name}
//                     </button>
//                   ))}

//                   {/* View More still navigates to full category page */}
//                   {count > 5 && (
//                     <Link
//                       to={`/category/${cat.slug}`}
//                       className="category-sidebar-view-all"
//                     >
//                       View More
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default CategorySidebar;

import { Link } from "react-router-dom";

const CategorySidebar = ({
  categories,
  products,
  productCounts,
  activeSlug,
}) => {
  const scrollToProduct = (productId) => {
    const el = document.getElementById(`product-${productId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Active category sabse upar, baaki apne order me
  const sortedCategories = [
    ...categories.filter((c) => c.slug === activeSlug),
    ...categories.filter((c) => c.slug !== activeSlug),
  ];

  return (
    <aside className="category-sidebar">
      <h6 className="category-sidebar-heading">Products &amp; Services</h6>

      <nav className="category-sidebar-nav">
        {sortedCategories.map((cat) => {
          const count = productCounts[cat.id] || 0;
          const isActive = cat.slug === activeSlug;

          const categoryProducts = products
            .filter(
              (product) =>
                (product.category?.id || product.category)?.toString() ===
                cat.id.toString(),
            )
            .slice(0, 5);

          return (
            <div key={cat.id} className="category-sidebar-group">
              {/* Category */}
              <Link
                to={`/category/${cat.slug}`}
                className={`category-sidebar-item ${isActive ? "active" : ""}`}
              >
                <span className="category-sidebar-name">
                  {cat.icon && (
                    <span className="cat-side-icon">{cat.icon}</span>
                  )}

                  <span>
                    {cat.name} ({count})
                  </span>
                </span>

                {/* Chevron */}
                <span className={`category-chevron ${isActive ? "open" : ""}`}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </Link>

              {/* Products - click scrolls to product on this page, does NOT navigate */}
              {isActive && categoryProducts.length > 0 && (
                <div className="category-sidebar-products">
                  {categoryProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="category-sidebar-product"
                      onClick={() => scrollToProduct(product.id)}
                    >
                      {product.name}
                    </button>
                  ))}

                  {/* View More still navigates to full category page */}
                  {count > 5 && (
                    <Link
                      to={`/category/${cat.slug}`}
                      className="category-sidebar-view-all"
                    >
                      View More
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default CategorySidebar;
