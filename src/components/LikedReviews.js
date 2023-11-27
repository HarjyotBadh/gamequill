// LikedReviews.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ReviewCard from "./ReviewCard";

const LikedReviews = ({ userId, showAllReviews, reviewsToShow }) => {
  const [likedReviews, setLikedReviews] = useState([]);

  useEffect(() => {
    const fetchLikedReviews = async () => {
      try {
        const likedReviewsQuery = query(
          collection(db, "reviews"),
          where("userLikes", "array-contains", userId)
        );
        const likedReviewsSnapshot = await getDocs(likedReviewsQuery);
        const likedReviewsData = likedReviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikedReviews(likedReviewsData);
      } catch (error) {
        console.error("Error fetching liked reviews:", error);
      }
    };

    if (userId) {
      fetchLikedReviews();
    }
  }, [userId]);

  return (
    <div>
      <h2>Your Liked Reviews</h2>
      <div className="review-list">
        {likedReviews
          .slice(0, showAllReviews ? likedReviews.length : reviewsToShow)
          .map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              gameName={review.gameName}
              starAverage={review.starRating}
            />
          ))}
      </div>
    </div>
  );
};

export default LikedReviews;
