import React, { useState, useEffect } from "react";
import { fetchFriendsRecentReviews } from "../functions/ReviewFunctions";
import { fetchUserRecentReviews } from "../functions/ReviewFunctions";
import { auth } from "../firebase";
import RecentReview from "./RecentReview";
import UserActivity from "./UserActivity";
import "../styles/FiveRecentReviews.css";

export default function FiveRecentReviews({user_id}) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        const theUserId = authObj.uid;

        fetchUserRecentReviews(5, user_id)
          .then((data) => {
            setReviews(data);
          })
          .catch((err) => {
            console.error(err);
          });
      }

      // Clean up the listener
      return () => unsub();
    });
  }, [user_id]);

  return (
    <div>
      <div class="frr-text text-black dark:text-white">Five Recent Reviews</div>
      {reviews.map((review, index) => (
        <div key={review}>
          <RecentReview
            class="rr"
            cover={review.gameCover.replace("t_thumb", "t_1080p")}
            username={review.username} // Assuming review object has username
            rating={review.starRating}
            note={review.reviewText}
            id={review.gameID} // Assuming review object has gameId
            reviewId={review.id} // Assuming review object has id
            time={review.timestamp}
          />
        </div>
      ))}
    </div>
  );
}
