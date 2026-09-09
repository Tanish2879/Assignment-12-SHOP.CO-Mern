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
        <StarRating rating={rating} showScore={false} size={20} />
      </div>

      <div className="review-card__user">
        <h4 className="review-card__name">{name}</h4>
        {isVerified && (
          <span className="review-card__verified-badge" title="Verified Customer">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" fill="#01AB31" />
              <path
                d="M8 12.5L10.5 15L16 9.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
