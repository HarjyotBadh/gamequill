import React, { useState, useEffect } from 'react';
import { fetchFriendsRecentReviews } from "../functions/ReviewFunctions";
import { fetchUserRecentReviews } from '../functions/ReviewFunctions';
import { auth } from "../firebase";
import RecentReview from "./RecentReview";
import UserActivity from "./UserActivity";

export default function FiveRecentReviews() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                const theUserId = authObj.uid;

                fetchUserRecentReviews(5, theUserId)
                    .then(data => {
                        setReviews(data);
                    })
                    .catch(err => {
                        console.error(err);
                    });

            }

            // Clean up the listener
            return () => unsub();
        });
    }, []);


    return (
        <div>
            {reviews.map((review, index) => (
                <div key={review}>

                    <RecentReview
                        cover={review.gameCover.replace('t_thumb', 't_1080p')}
                        username={review.username} // Assuming review object has username
                        rating={review.starRating}
                        note={review.reviewText}
                        id={review.gameID} // Assuming review object has gameId
                        reviewId={review.id} // Assuming review object has id
                    />
                </div>
            ))}
        </div>
    )
}
