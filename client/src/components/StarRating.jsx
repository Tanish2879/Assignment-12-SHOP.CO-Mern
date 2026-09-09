
import { useId } from "react";

const StarRating = ({
  rating = 0,
  maxStars = 5,
  showScore = true,
  size = 18,
  className = ""
}) => {
  const instanceId = useId();
  const numRating = typeof rating === "number" ? rating : parseFloat(rating) || 0;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (numRating >= i) {
      // Full star
      stars.push(
        <svg
          key={i}
          className="star star--full"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#FFC633"
          aria-hidden="true"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      );
    } else if (numRating >= i - 0.5) {
      // Half star
      const gradId = `half-star-${instanceId.replace(/[:]/g, "")}-${i}`;
      stars.push(
        <svg
          key={i}
          className="star star--half"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#FFC633" />
              <stop offset="50%" stopColor="#E0E0E0" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg
          key={i}
          className="star star--empty"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#E0E0E0"
          aria-hidden="true"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      );
    }
  }

  const displayScore = Number.isInteger(numRating) ? numRating : numRating.toFixed(1);

  return (
    <div
      className={`star-rating ${className}`}
      aria-label={`Rating: ${displayScore} out of ${maxStars}`}
    >
      <div className="star-rating__stars">{stars}</div>
      {showScore && (
        <span className="star-rating__score">
          {displayScore}
          <span className="star-rating__max">/{maxStars}</span>
        </span>
      )}
    </div>
  );
};

export default StarRating;
