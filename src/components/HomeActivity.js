import React, { useState, useEffect } from 'react';
import "../styles/HomeActivity.css";
import UserActivity from "./UserActivity";
import { fetchFriendsRecentReviews } from "../functions/ReviewFunctions";
import { auth } from "../firebase";

function App() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                const theUserId = authObj.uid;

                fetchFriendsRecentReviews(2, theUserId)
                    .then(data => {
                        setReviews(data);
                    })
                    .catch(err => {
                        console.error(err);
                    });

            } else {
                // Handle the case when the user is not logged in if needed
            }

            // Clean up the listener
            return () => unsub();
        });
    }, []);

    return (
        <div>
            <div class="activity-container">
                <h1 class="user-head">YOUR FRIENDS HAVE LIKED...</h1>
                {reviews.map((review, index) => (
                    <div class="user-activity" key={index}>
                        <UserActivity
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
        </div>
    );
}
export default App;
