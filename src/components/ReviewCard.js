import React, { useState } from "react";
import "../styles/ReviewCard.css";
import { Link } from 'react-router-dom';
import DOMPurify from "dompurify";
import { parseReviewWithSpoilersToHTML } from "../functions/ReviewFunctions";

const ReviewCard = ({ review, gameName }) => {
  const { reviewText, timestamp, gameCover } = review;

  const getColorByRating = (rating) => {
    if (rating < 3) return "red";
    if (rating > 3) return "green";
    if (rating = 3) return "gold";
  };

  const ratingColor = getColorByRating(review.starRating);

  const [showFullText, setShowFullText] = useState(false);

  const reviewPreview = reviewText.slice(0, 200);
  const reviewFullText = showFullText ? reviewText : "";

  const starArr = [];

  const fullStars = Math.floor(review.starRating);

  for (let i = 1; i <= fullStars; i++) {
    starArr.push(1);
  }

  if (review.starRating - fullStars > 0) {
    starArr.push(review.starRating - fullStars);
  }

  const emptyStars = 5 - starArr.length;
  for (let i = 1; i <= emptyStars; i++) {
    starArr.push(0);
  }

  const stars = starArr.map((val, i) => {
    if (val === 1)
      return (
        <span key={i} className="fullStar">
          ★
        </span>
      );
    else if (val > 0)
      return (
        <span key={i} className="halfStar">
          ★
        </span>
      );
    else
      return (
        <span key={i} className="emptyStar">
          ★
        </span>
      );
  });

  return (
    <Link
      to={`/review/${review.id}`}
      className="review-card"
      style={{ borderColor: ratingColor }}
    >
      <div className="game-info">
        <div className="game-name">{gameName}</div>
        <div className="review-card-game-cover">
          {gameCover && <img src={gameCover} alt={gameName} />}
        </div>
      </div>
      <div className="stars-rating">{stars}</div>
      <div className="review-text">
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              parseReviewWithSpoilersToHTML(showFullText ? reviewFullText : reviewPreview)
            ),
          }}
        >
          {/* Content will be inserted by dangerouslySetInnerHTML */}
        </p>
        {reviewText.length > 200 && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="more-button"
          >
            {showFullText ? "Less" : "...More"}
          </button>
        )}
      </div>

      <div className="timestamp">Posted on {timestamp.toDate().toDateString()}</div>
    </Link>
  );
};

export default ReviewCard;
