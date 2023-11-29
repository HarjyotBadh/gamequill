import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplayIcon from "@mui/icons-material/Replay";
import Rating from "@mui/material/Rating";
import {
    fetchReviewsByGameId,
    parseReviewWithSpoilersToHTML,
    fetchFriendsRecentReviews,
} from "../functions/ReviewFunctions";
import "../styles/ReviewSnapshot.css";
import DOMPurify from "dompurify";
import { sendLikeNotification } from "../functions/NotificationFunctions";

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
    currentUserId,
}) {
    const [reviews, setReviews] = useState([]);
    // const currentUserId = auth.currentUser.uid;

    async function handleLike(review) {
        // Check if the review has been liked by the current user
        const isLiked =
            review.userLikes && review.userLikes.includes(currentUserId);

        // Clone the userLikes array
        let updatedUserLikes = [...(review.userLikes || [])];

        // Construct the review object to pass to the notification function
        const reviewObject = {
            reviewID: review.id,
            gameID: review.gameID, // Make sure the review object contains the gameId
            gameName: review.gameName, // Make sure the review object contains the gameName
            gameCoverUrl: review.gameCover, // Make sure the review object contains the gameCoverUrl
        };

        // Add or remove the user's ID based on the current like status
        if (isLiked) {
            updatedUserLikes = updatedUserLikes.filter(
                (uid) => uid !== currentUserId
            );
        } else {
            updatedUserLikes.push(currentUserId);

            // Send the like notification only if it's a new like
            await sendLikeNotification(review.uid, currentUserId, reviewObject);
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

    async function handleRepost(review) {
        // Check if the review has been reposted by the current user
        const isReposted =
            review.userReposts && review.userReposts.includes(currentUserId);
    
        // Clone the userReposts array
        let updatedUserReposts = [...(review.userReposts || [])];
    
        
        // Construct the review object to pass to the notification function
        const reviewObject = {
            reviewID: review.id,
            gameID: review.gameID, // Make sure the review object contains the gameId
            gameName: review.gameName, // Make sure the review object contains the gameName
            gameCoverUrl: review.gameCover, // Make sure the review object contains the gameCoverUrl
        };
    
        // Add or remove the user's ID based on the current repost status
        if (isReposted) {
            updatedUserReposts = updatedUserReposts.filter(
                (uid) => uid !== currentUserId
            );
        } else {
            updatedUserReposts.push(currentUserId);
            
        }
    
        // Update the review in the database
        const reviewRef = doc(db, "reviews", review.id);
        await updateDoc(reviewRef, {
            userReposts: updatedUserReposts,
        });
    
        // Update the state to re-render the component
        setReviews((prevReviews) => {
            return prevReviews.map((r) => {
                if (r.id === review.id) {
                    return {
                        ...r,
                        userReposts: updatedUserReposts,
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
                // Truncating long review texts
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
                                        <Rating
                                            name="read-only"
                                            value={review.starRating}
                                            precision={0.5}
                                            readOnly
                                            sx={{
                                                "& .MuiRating-iconFilled": {
                                                    color: "var(--rating-color)",
                                                },
                                                "& .MuiRating-iconEmpty": {
                                                    color: "var(--star-color)",
                                                },
                                            }}
                                        />

                                    </div>
                                </div>
                                <div className="like-repost-container">
                                    <Tooltip title="Like">
                                        <IconButton
                                            onClick={() => handleLike(review)}
                                        >
                                            <ThumbUpIcon
                                                className={
                                                    review.userLikes?.includes(
                                                        currentUserId
                                                    )
                                                        ? "liked"
                                                        : "not-liked"
                                                }
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <span className="like-count">
                                        {review.userLikes?.length || 0}
                                    </span>
                                    <Tooltip title="Repost">
                                        <IconButton
                                            onClick={() => handleRepost(review)}
                                        >
                                            <ReplayIcon
                                                className={
                                                    review.userReposts?.includes(
                                                        currentUserId
                                                    )
                                                        ? "reposted-icon"
                                                        : "not-reposted-icon"
                                                }
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <span className="repost-count">
                                        {review.userReposts?.length || 0}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to={`/Profile?user_id=${review.uid}`}
                                className="review-user-info-container"
                            >
                                <Avatar
                                    src={review.profilePicture}
                                    className="custom-avatar medium-avatar"
                                />
                                <div className="review-user-info">
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
                                className="review-text-snapshot"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        parseReviewWithSpoilersToHTML(
                                            displayText
                                        )
                                    ),
                                }}
                            />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
