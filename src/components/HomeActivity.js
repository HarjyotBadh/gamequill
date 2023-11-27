import React, { useState, useEffect } from "react";
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

                fetchFriendsRecentReviews(3, theUserId)
                    .then((data) => {
                        setReviews(data);
                    })
                    .catch((err) => {
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
            {reviews.length > 0 && (
                <div className="activity-container">
                    <h1 className="user-head">YOUR FRIENDS HAVE REVIEWED...</h1>
                    {reviews.map((review, index) => (
                        <div className="user-activity" key={index}>
                            <UserActivity
                                cover={review.gameCover.replace(
                                    "t_thumb",
                                    "t_1080p"
                                )}
                                username={review.username}
                                rating={review.starRating}
                                note={review.reviewText}
                                id={review.gameID}
                                reviewId={review.id}
                                uid={review.uid}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default App;
