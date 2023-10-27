import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/ReviewCard.css'; // Import the same CSS as in ReviewCard

function ReviewDetail() {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        // Fetch the review document from Firestore based on the reviewId
        const reviewDocRef = doc(db, 'reviews', reviewId);
        const reviewDoc = await getDoc(reviewDocRef);

        if (reviewDoc.exists()) {
          const reviewData = reviewDoc.data();
          setReview(reviewData);
        } else {
          console.log('Review not found');
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    fetchReviewData();
  }, [reviewId]);

  if (!review) {
    return <div>Loading...</div>;
  }

  const getColorByRating = (rating) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'gold';
    return 'red';
  };

  const ratingColor = getColorByRating(review.starRating);

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
    <div className="review-card" style={{ borderColor: ratingColor }}>
      <div className="game-name">{review.gameName}</div>
      <div className="stars-rating">{stars}</div>
      <div className="review-text">{review.reviewText}</div>
      <div className="timestamp">Posted on {review.timestamp.toDate().toDateString()}</div>
    </div>
  );
}

export default ReviewDetail;
