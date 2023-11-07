import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { generateStars } from "../functions/RatingFunctions";
import {
    fetchReviewsByGameId,
    parseReviewWithSpoilersToHTML,
    fetchFriendsRecentReviews,
} from "../functions/ReviewFunctions";
import "../styles/ReviewSnapshot.css";
import DOMPurify from "dompurify";

/**
 * Renders a snapshot of reviews for a given game, with options to filter by spoilers and friends' reviews.
 * @param {string} game_id - The ID of the game to fetch reviews for.
 * @param {boolean} showSpoilers - Whether to show reviews containing spoilers or not.
 * @param {boolean} showFriendReviews - Whether to show only reviews from friends or not.
 * @param {string} currentUserId - The ID of the current user.
 * @returns {JSX.Element} A div containing the rendered reviews.
 */
export default function ReviewSnapshot({
    game_id,
    showFriendReviews,
    showSpoilers,
}) {
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
        async function getData() {
            let reviewsData = await fetchReviewsByGameId(game_id);

            // Filter out reviews that contain spoilers if showSpoilers is false
            if (!showSpoilers) {
                reviewsData = reviewsData.filter(
                    (review) => !review.containsSpoiler
                );
            }

            // If showing only friends' reviews, fetch and filter those based on game_id
            if (showFriendReviews) {
                const friendReviews = await fetchFriendsRecentReviews(
                    -1,
                    currentUserId
                );
                const friendReviewIds = friendReviews.map(
                    (review) => review.id
                );
                reviewsData = reviewsData.filter((review) =>
                    friendReviewIds.includes(review.id)
                );
            }

            setReviews(reviewsData);
        }

        getData();
    }, [game_id, showSpoilers, showFriendReviews, currentUserId]);

    return (
        <div className="review-snapshot">
            {reviews.map((review) => {
                // Check and truncate the review if necessary
                let displayText = review.reviewText;
                if (review.reviewText.length > 1000) {
                    displayText = `${review.reviewText.substring(0, 997)}...`;
                }

                return (
                    <div key={review.id} className="review-box">
                        <div className="review-header">
                            <div className="review-rating-container">
                                {review.containsSpoiler && (
                                    <div className="spoiler-indicator">
                                        Contains Spoilers
                                    </div>
                                )}
                                <div className="ratings-likes">
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
                                                review.userLikes.includes(
                                                    currentUserId
                                                )
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

                            <Link
                                to={`/Profile?user_id=${review.uid}`}
                                className="user-info-container"
                            >
                                <Avatar
                                    className="custom-avatarr medium-avatarr"
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
                        </div>

                        <Link to={`/review/${review.id}`}>
                            <p
                                className="review-text-snapshott"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        parseReviewWithSpoilersToHTML(
                                            displayText
                                        )
                                    ),
                                }}
                            >
                                {/* Content will be inserted by dangerouslySetInnerHTML */}
                            </p>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
