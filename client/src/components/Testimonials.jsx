import ReviewCard from "./ReviewCard";

const Testimonials = ({
  title = "OUR HAPPY CUSTOMERS",
  testimonials = []
}) => {
  return (
    <section className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <h2 className="testimonials__title">{title}</h2>
        </div>

        {/* Dynamic reviews container */}
        <div className="testimonials__grid">
          {testimonials && testimonials.length > 0 ? (
            testimonials.map((review, index) => (
              <div key={review._id || review.id || index} className="testimonials__item">
                <ReviewCard
                  name={review.name || review.userName || review.user?.name || "Customer"}
                  rating={review.rating || 5}
                  isVerified={review.isVerified ?? true}
                  comment={review.comment || review.review || ""}
                  date={review.date || review.createdAt}
                />
              </div>
            ))
          ) : (
            <p className="testimonials__empty">No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
