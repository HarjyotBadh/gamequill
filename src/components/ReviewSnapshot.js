import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    getDocs,
    query,
    where,
    getDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { generateStars } from "./ReviewBar";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import "../styles/ReviewSnapshot.css";

// This is your reusable function
export async function fetchReviewsByGameId(game_id) {
    const reviewsQuery = query(
        collection(db, "reviews"),
        where("gameID", "==", game_id)
    );
    const querySnapshot = await getDocs(reviewsQuery);

    const fetchedReviews = [];
    for (let document of querySnapshot.docs) {
        const userRef = doc(
            db,
            "profileData",
            document.data().uid.toString()
        );
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        fetchedReviews.push({
            id: document.id,
            username: userData.username,
            profilePicture: userData.profilePicture,
            ...document.data(),
        });
    }

    // Sort reviews by timestamp (most recent first)
    fetchedReviews.sort((a, b) => {
        return b.timestamp.seconds - a.timestamp.seconds;
    });

    return fetchedReviews;
}

export default function ReviewSnapshot({ game_id }) {
    const [reviews, setReviews] = useState([]);
    const currentUserId = auth.currentUser.uid;

    async function handleLike(review) {
        // Check if the review has been liked by the current user
        const isLiked =
            review.userLikes && review.userLikes.includes(currentUserId);

        // Clone the userLikes array
        let updatedUserLikes = [...(review.userLikes || [])];

        // Add or remove the user's ID based on the current like status
        if (isLiked) {
            updatedUserLikes = updatedUserLikes.filter(
                (uid) => uid !== currentUserId
            );
        } else {
            updatedUserLikes.push(currentUserId);
        }

        // Update the review in the database
        const reviewRef = doc(db, "reviews", review.id);
        await updateDoc(reviewRef, {
            userLikes: updatedUserLikes,
        });

        // Update the state to re-render the component
        setReviews((prevReviews) => {
            return prevReviews.map((r) => {
                if (r.id === review.id) {
                    return {
                        ...r,
                        userLikes: updatedUserLikes,
                    };
                }
                return r;
            });
        });
    }

    useEffect(() => {
        // Use the extracted function here
        async function getData() {
            const reviewsData = await fetchReviewsByGameId(game_id);
            setReviews(reviewsData);
        }
        getData();
    }, [game_id]);

    return (
        <div className="review-snapshot">
            {reviews.map((review) => (
                <div key={review.id} className="review-box">
                    <div className="review-header">
                        <Link
                            to={`/Profile?user_id=${review.uid}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Avatar
                                className="custom-avatar medium-avatar"
                                src={review.profilePicture}
                            />
                            <div className="user-info">
                                <span className="review-username">
                                    {review.username}
                                </span>
                                <span className="review-time">
                                    {new Date(
                                        review.timestamp?.seconds * 1000
                                    ).toLocaleString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </Link>
                        <div className="review-rating-container">
                            <span className="numericRating">
                                {review.starRating.toFixed(1)}
                            </span>
                            <div className="rating">
                                {generateStars(review.starRating)}
                            </div>
                            <div className="like-button-container">
                                <HandThumbUpIcon
                                    className={
                                        review.userLikes &&
                                        review.userLikes.includes(currentUserId)
                                            ? "liked"
                                            : "not-liked"
                                    }
                                    onClick={() => handleLike(review)}
                                />
                                <span className="like-count">
                                    {(review.userLikes
                                        ? review.userLikes.length
                                        : 0) + " likes"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="review-text">
                        {review.reviewText.substring(0, 1000)}...
                    </p>
                </div>
            ))}
        </div>
    );
}
