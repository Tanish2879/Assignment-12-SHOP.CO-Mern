
const StarRating = ({ rating = 0, maxStars = 5, showScore = true, size = 18, className = "" }) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      // Full star
      stars.push(
        <span key={i} className="star star--full" style={{ fontSize: `${size}px` }} aria-hidden="true">
          ★
        </span>
      );
    } else if (rating >= i - 0.5) {
      // Half star
      stars.push(
        <span key={i} className="star star--half" style={{ fontSize: `${size}px` }} aria-hidden="true">
          ★
        </span>
      );
    } else {
      // Empty star
      stars.push(
        <span key={i} className="star star--empty" style={{ fontSize: `${size}px` }} aria-hidden="true">
          ★
        </span>
      );
    }
  }

  return (
    <div className={`star-rating ${className}`} aria-label={`Rating: ${rating} out of ${maxStars}`}>
      <div className="star-rating__stars">{stars}</div>
      {showScore && (
        <span className="star-rating__score">
          {rating}
          <span className="star-rating__max">/{maxStars}</span>
        </span>
      )}
    </div>
  );
};

export default StarRating;
