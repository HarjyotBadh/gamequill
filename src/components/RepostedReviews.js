// RepostedReviews.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ReviewCard from "./ReviewCard";

const RepostedReviews = ({ userId, showAllReviews, reviewsToShow }) => {
  const [repostedReviews, setRepostedReviews] = useState([]);

  useEffect(() => {
    const fetchRepostedReviews = async () => {
      try {
        // Query the "Reposts" collection to get documents where userId matches
        const repostsQuery = query(
          collection(db, "reposts"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc") // Assuming you have a timestamp field in Reposts
        );
        
        const repostsSnapshot = await getDocs(repostsQuery);

        // Fetch the corresponding review data for each repost
        const repostedReviewsData = [];
        for (const repostDoc of repostsSnapshot.docs) {
          const reviewId = repostDoc.data().reviewId;
          const reviewRef = doc(db, "reviews", reviewId);
          const reviewDoc = await getDoc(reviewRef);

          if (reviewDoc.exists()) {
            repostedReviewsData.push({
              id: reviewDoc.id,
              ...reviewDoc.data(),
            });
          }
        }

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
