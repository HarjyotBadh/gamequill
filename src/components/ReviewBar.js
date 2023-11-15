import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ReviewBar.css";
import { generateStars } from "../functions/RatingFunctions";
import { fetchReviewsByGameId, fetchFriendsRecentReviews } from "../functions/ReviewFunctions";
import { calculateAverageRating } from "../functions/RatingFunctions";
import { auth } from "../firebase";

export default function ReviewBar({
    gameID,
    userHasReview,
    gameData,
    showFriendReviews,
    setShowFriendReviews,
    showSpoilers,
    setShowSpoilers,
    currentUserId
}) {
    const [numberOfReviews, setNumberOfReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [numberOfFriendReviews, setNumberOfFriendReviews] = useState(0);
    const [friendAverageRating, setFriendAverageRating] = useState(0);
    // const currentUserId = auth.currentUser.uid;

    useEffect(() => {
        fetchReviewsByGameId(gameID).then((reviews) => {
            setNumberOfReviews(reviews.length);
            const reviewRating = calculateAverageRating(reviews);
            setAverageRating(reviewRating === "NaN" ? "0.0" : reviewRating);
        });
    
        // Fetch friend reviews and update the state values
        fetchFriendsRecentReviews(-1, currentUserId).then((allFriendReviews) => {
            // Filter out reviews to match the current gameID
            const relevantFriendReviews = allFriendReviews.filter(review => review.gameID === gameID);
            
            setNumberOfFriendReviews(relevantFriendReviews.length);
            const friendReviewRating = calculateAverageRating(relevantFriendReviews);
            setFriendAverageRating(friendReviewRating === "NaN" ? "0.0" : friendReviewRating);
        });
    
    }, [gameID, currentUserId]);
    

    return (
        <div className="review-bar">
            <div className="review-header-header">
                <h1 className="review-title">Reviews</h1>
                <div className="toggle-container">
                    <label className="toggle-label">
                        Show Spoilers
                        <input
                            type="checkbox"
                            className="toggle-input"
                            checked={showSpoilers}
                            onChange={() => setShowSpoilers((prev) => !prev)}
                        />
                        <span className="slider"></span>
                    </label>
                    <label className="toggle-label">
                        Friend Reviews Only
                        <input
                            type="checkbox"
                            className="toggle-input"
                            checked={showFriendReviews}
                            onChange={() =>
                                setShowFriendReviews((prev) => !prev)
                            }
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                {!userHasReview && (
                    <Link
                        to="/reviewcreation"
                        state={{ gameData }}
                        className="review-bar-button"
                    >
                        Create Review
                    </Link>
                )}
            </div>
            <div className="review-stats-container">
                <div className="review-stat">
                    <span className="stat-title">Total Reviews:</span>
                    <span className="stat-value">{numberOfReviews}</span>
                </div>
                <div className="review-stat">
                    <span className="stat-title">Average Rating:</span>
                    <div className="stat-value">
                        {generateStars(averageRating)}
                        <span className="numericRating">{averageRating}</span>
                    </div>
                </div>
                <div className="review-stat">
                    <span className="stat-title">Friends' Reviews:</span>
                    <div className="stat-value">
                    {generateStars(friendAverageRating)}
                        <span className="numericRating">{friendAverageRating}</span>
                        <span>({numberOfFriendReviews} Reviews)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
