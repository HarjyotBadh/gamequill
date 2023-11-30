import React, { useState, useEffect } from "react";
import { fetchUserRecentReviews } from "../functions/ReviewFunctions";
import { auth } from "../firebase";
import RecentReview from "./RecentReview";
import "../styles/FiveRecentReviews.css";

export default function FiveRecentReviews({ user_id }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {

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
            <div class="frr-text text-black dark:text-white">
                Recent Activity
            </div>
            {reviews.map((review, index) => (
                <div key={review}>
                    <RecentReview
                        class="rr"
                        cover={review.gameCover.replace("t_thumb", "t_1080p")}
                        username={review.username}
                        rating={review.starRating}
                        note={review.reviewText}
                        id={review.gameID}
                        reviewId={review.id}
                        time={review.timestamp}
                    />
                </div>
            ))}
        </div>
    );
}
