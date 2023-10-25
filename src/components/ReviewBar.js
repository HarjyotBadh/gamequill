import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../styles/ReviewBar.css";

export const fetchReviewsByGameId = async (gameID) => {
    const reviews = [];

    const q = query(collection(db, "reviews"), where("gameID", "==", gameID));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // Add each review to the reviews array
        reviews.push({ id: doc.id, ...doc.data() });
    });

    return reviews;
};

export const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const starArr = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starArr.push(1);
    }

    // Check for half star
    if (rating - fullStars >= 0.1) {
        starArr.push(0.5);
    }

    // Ensure there are 5 stars in total
    while (starArr.length < 5) {
        starArr.push(0);
    }

    // Render stars based on the values in starArr
    return starArr.map((val, i) => {
        if (val === 1)
            return (
                <span key={i} className="fullStar">
                    ★
                </span>
            );
        else if (val === 0.5)
            return (
                <span key={i} className="halfStar">
                    ★
                </span>
            );
        else
            return (
                <span key={i} className="emptyStar">
                    ★
                </span>
            );
    });
};

export default function ReviewBar({ gameID, userHasReview, gameData }) {
    const [numberOfReviews, setNumberOfReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    // Generate a random number (to the nearest 0.X) between 0 and 5
    const randomRating = Math.round(Math.random() * 5 * 10) / 10;

    useEffect(() => {
        fetchReviewsByGameId(gameID).then((reviews) => {
            setNumberOfReviews(reviews.length);
            setAverageRating(calculateAverageRating(reviews));
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
