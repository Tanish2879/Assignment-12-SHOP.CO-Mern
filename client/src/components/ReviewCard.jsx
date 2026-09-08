import StarRating from "./StarRating";

const ReviewCard = ({
  name = "",
  rating = 5,
  isVerified = true,
  comment = "",
  date
}) => {
  return (
    <div className="review-card">
      <div className="review-card__header">
        <StarRating rating={rating} showScore={false} />
      </div>

      <div className="review-card__user">
        <h4 className="review-card__name">{name}</h4>
        {isVerified && (
          <span className="review-card__verified-badge" title="Verified Customer">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#01AB31"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </span>
        )}
      </div>

      <p className="review-card__comment">"{comment}"</p>

      {date && <span className="review-card__date">{date}</span>}
    </div>
  );
};

export default ReviewCard;
