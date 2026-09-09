import { useState } from "react";
import ReviewCard from "./ReviewCard";

const Testimonials = ({
  title = "OUR HAPPY CUSTOMERS",
  testimonials = []
}) => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, testimonials.length - 3)));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 3 < testimonials.length ? prev + 1 : 0));
  };

  const visibleTestimonials = testimonials && testimonials.length > 0
    ? testimonials.slice(startIndex, startIndex + 3).concat(
        testimonials.length < 3 ? [] : testimonials.slice(0, Math.max(0, 3 - (testimonials.length - startIndex)))
      )
    : [];

  return (
    <section className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <h2 className="testimonials__title">{title}</h2>

          <div className="testimonials__controls">
            <button
              type="button"
              className="testimonials__arrow"
              onClick={handlePrev}
              aria-label="Previous testimonials"
            >
              ←
            </button>
            <button
              type="button"
              className="testimonials__arrow"
              onClick={handleNext}
              aria-label="Next testimonials"
            >
              →
            </button>
          </div>
        </div>

        {/* Dynamic reviews container */}
        <div className="testimonials__grid">
          {visibleTestimonials && visibleTestimonials.length > 0 ? (
            visibleTestimonials.map((review, index) => (
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
