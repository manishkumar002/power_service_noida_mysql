import { COMPANY } from "../config/company";

const REVIEWS = [
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    product: "350kva Online UPS",
    text: "Excellent service and timely delivery. Power Solution Services team installed UPS professionally.",
    date: "Aug 2025",
  },
  {
    name: "Amit Sharma",
    location: "Noida",
    rating: 5,
    product: "10KVA Industrial UPS",
    text: "Very responsive team. Got best quote after OTP verification. Highly recommended for industrial UPS.",
    date: "Jul 2025",
  },
  {
    name: "Priya Singh",
    location: "Gurugram",
    rating: 4,
    product: "UPS Rental Service",
    text: "Good rental service for our data center project. AMC support is also very reliable.",
    date: "Jun 2025",
  },
];

const Stars = ({ count }) => (
  <span className="review-stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= count ? "star on" : "star"}>
        ★
      </span>
    ))}
  </span>
);

const ReviewsSection = () => (
  <section className="reviews-section">
    <div className="reviews-inner">
      <h2 className=" section-heading text-center">
        Ratings <span className="gradient-text">&amp; Reviews</span>
      </h2>
      <div className="reviews-summary sh-card mt-4">
        <div className="review-score-box">
          <div className="review-big-score">
            4.8<span>/5</span>
          </div>
          <Stars count={5} />
          <p className="mb-0 small text-muted">128 Reviews</p>
        </div>
        <div className="review-bars">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="review-bar-row">
              <span>{star}★</span>
              <div className="review-bar-track">
                <div
                  className="review-bar-fill"
                  style={{
                    width: star === 5 ? "78%" : star === 4 ? "15%" : "3%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="review-metrics">
          {[
            { label: "Response", value: 89 },
            { label: "Quality", value: 96 },
            { label: "Delivery", value: 94 },
          ].map((m) => (
            <div key={m.label} className="review-metric">
              <div
                className="review-ring"
                style={{
                  background: `conic-gradient(#059669 ${m.value * 3.6}deg, #e2e8f0 0)`,
                }}
              >
                <span>{m.value}%</span>
              </div>
              <small>{m.label}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-list">
        {REVIEWS.map((r) => (
          <div key={r.name} className="review-card sh-card-review">
            <div className="review-avatar">{r.name[0]}</div>
            <div className="review-body">
              <div className="d-flex flex-wrap justify-content-between gap-1">
                <strong>{r.name}</strong>
                <small className="text-muted" style={{ textAlign: "right" }}>
                  {r.location} · {r.date}
                </small>
              </div>
              <Stars count={r.rating} />
              <p className="review-product mb-1">
                Product: <strong>{r.product}</strong>
              </p>
              <p className="review-text mb-0">{r.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button type="button" className="btn-get-quote">
          View More Reviews
        </button>
      </div>
    </div>
  </section>
);

export default ReviewsSection;
