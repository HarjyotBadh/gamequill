import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ReviewBar.css";
import { generateStars } from "../functions/RatingFunctions";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";

// export const fetchReviewsByGameId = async (gameID) => {
//     const reviews = [];

//     const q = query(collection(db, "reviews"), where("gameID", "==", gameID));

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         // Add each review to the reviews array
//         reviews.push({ id: doc.id, ...doc.data() });
//     });

//     return reviews;
// };

export default function ReviewBar({ gameID, userHasReview, gameData }) {
    const [numberOfReviews, setNumberOfReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    // Generate a random number (to the nearest 0.X) between 0 and 5
    const randomRating = Math.round(Math.random() * 5 * 10) / 10;

    useEffect(() => {
        fetchReviewsByGameId(gameID).then((reviews) => {
            setNumberOfReviews(reviews.length);
            const reviewRating = calculateAverageRating(reviews);
            if (reviewRating === "NaN") {
                setAverageRating("0.0");
            } else {
                setAverageRating(reviewRating);
            }
        });
    }, [gameID]);

    const calculateAverageRating = (reviews) => {
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.starRating,
            0
        );
        return (totalRating / reviews.length).toFixed(1);
    };

    return (
        <div className="review-bar">
            <div className="review-header">
                <h1 className="review-title">Reviews</h1>
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
                        {generateStars(randomRating)}
                        <span className="numericRating">{randomRating}</span>
                        <span>({7} Reviews)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
