import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import '../styles/CommentDisplay.css';
import { fetchCommentsByReviewId, parseReviewWithSpoilersToHTML } from '../functions/ReviewFunctions';
import DOMPurify from 'dompurify';

export default function CommentDisplay({ review_id, hasCommented }) {
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

    return (
        <div className="comment-display">
            {comments.map((comment) => (
                <div key={comment.id} className="comment-box">
                    <div className="comment-header">
                        <Link to={`/Profile?user_id=${comment.uid}`} className="user-info-container">
                            <Avatar className="custom-avatarr medium-avatarr" src={comment.profilePicture} />
                            <div className="user-info">
                                <span className="comment-username">{comment.username}</span>
                                <span className="comment-time">
                                    {new Date(comment.timestamp?.seconds * 1000).toLocaleString(undefined, {
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
                    <p
                                className="comment-text"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        parseReviewWithSpoilersToHTML(
                                            comment.text
                                        )
                                    ),
                                }}
                            >
                                {/* Content will be inserted by dangerouslySetInnerHTML */}
                            </p>
                </div>
            ))}
        </div>
    );
}
