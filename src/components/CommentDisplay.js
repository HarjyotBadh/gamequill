import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import "../styles/CommentDisplay.css";
import {
    fetchCommentsByReviewId,
    parseReviewWithSpoilersToHTML,
} from "../functions/ReviewFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import DOMPurify from "dompurify";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import ReplyCreator from "./ReplyCreator";

export default function CommentDisplay({
    review_id,
    hasCommented,
    currentUserUid,
}) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsData = await fetchCommentsByReviewId(review_id);
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments: ", error);
                // Handle the error appropriately
            }
        };

        fetchData();
    }, [review_id, hasCommented]);

    async function handleCommentLike(comment, currentUserUid) {
        // Initialize userLikes as an empty array if it doesn't exist
        const userLikes = comment.userLikes || [];

        // Check if the comment has been liked by the current user
        const isLiked = userLikes.includes(currentUserUid);

        // Add or remove the user's ID based on the current like status
        let updatedUserLikes = isLiked
            ? userLikes.filter((uid) => uid !== currentUserUid)
            : [...userLikes, currentUserUid];

        // Update the comment in the database
        const commentRef = doc(
            db,
            "reviews",
            review_id,
            "comments",
            comment.id
        );
        await updateDoc(commentRef, { userLikes: updatedUserLikes });

        // Update the local state to reflect the change
        setComments(
            comments.map((c) => {
                if (c.id === comment.id) {
                    return { ...c, userLikes: updatedUserLikes };
                }
                return c;
            })
        );

        // TODO : Add a notification to the user who was liked
    }

    return (
        <div className="comment-display">
            {comments.map((comment) => (
                <div key={comment.id} className="comment-and-reply-container">
                <div className="comment-box">
                    
                    <div className="comment-header">
                        <Link
                            to={`/Profile?user_id=${comment.uid}`}
                            className="user-info-container"
                        >
                            <Avatar
                                className="custom-avatarr medium-avatarr"
                                src={comment.profilePicture}
                            />
                            <div className="user-info">
                                <span className="comment-username">
                                    {comment.username}
                                </span>
                                <span className="comment-time">
                                    {new Date(
                                        comment.timestamp?.seconds * 1000
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

                        <div className="like-button-container">
                            <HandThumbUpIcon
                                className={
                                    comment.userLikes?.includes(currentUserUid)
                                        ? "liked"
                                        : "not-liked"
                                }
                                onClick={() =>
                                    handleCommentLike(comment, currentUserUid)
                                }
                            />
                            <span className="like-count">{`${
                                comment.userLikes?.length || 0
                            } likes`}</span>
                        </div>
                    </div>
                    <p
                        className="comment-text"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                parseReviewWithSpoilersToHTML(comment.text)
                            ),
                        }}
                    >
                        {/* Content will be inserted by dangerouslySetInnerHTML */}
                    </p>

                    

                </div>
                <div className="reply-box">
                <ReplyCreator
                        review_id={review_id}
                        comment_id={comment.id}
                        currentUserUID={currentUserUid}
                    />

                    </div>

                </div>
                
            ))}
            
        </div>
    );
}
