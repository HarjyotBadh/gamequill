// LikedReviews.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import ReviewCard from "./ReviewCard";

const RepostedReviews = ({ userId, showAllReviews, reviewsToShow }) => {
  const [repostedReviews, setRepostedReviews] = useState([]);

  useEffect(() => {
    const fetchRepostedReviews = async () => {
      try {
        const repostedReviewsQuery = query(
          collection(db, "reviews"),
          where("userReposts", "array-contains", userId),
        );
        const repostedReviewsSnapshot = await getDocs(repostedReviewsQuery);
        const repostedReviewsData = repostedReviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRepostedReviews(repostedReviewsData);
      } catch (error) {
        console.error("Error fetching reposted reviews:", error);
      }
    };

    if (userId) {
      fetchRepostedReviews();
    }
  }, [userId]);

  return (
    <div>
      <h2>Your Reposted Reviews</h2>
      <div className="review-list">
        {repostedReviews
          .slice(0, showAllReviews ? repostedReviews.length : reviewsToShow)
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

export default RepostedReviews;
