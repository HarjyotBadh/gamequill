import React, { useState, useEffect } from 'react';
import "../styles/RecentReview.css";
import Rating from "@mui/material/Rating";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { parseReviewWithSpoilersToHTML } from "../functions/ReviewFunctions";

export default function RecentReview({ cover, username, rating, note, id, reviewId, time }) {
    const date = time.toDate();
    const dateString = date.toLocaleString();

    if (!cover) {
        cover = tempcover;
    }
    const displayText = note.length > 250 ? note.slice(0, 250) + '...' : note;

    return (
        <div>
            <div className={`rr-container`}>
                <div className="rr-cover">
                    <Link to={`/game?game_id=${id}`}>
                        <img className="rr-cover-rounded" src={cover} alt="Game Cover" />
                    </Link>
                </div>
                <div className="rr-text">
                    <h5 className="user-name-rating">
                    {username} -
                    <Rating
                            name="read-only"
                            value={rating}
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
                    </h5>
                    <Link to={`/review/${reviewId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <p
                            className="review-text-snapshot"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(parseReviewWithSpoilersToHTML(displayText))
                            }}
                        >
                        </p>
                        <span className="rr-note-more">More ⇒</span>
                    </Link>
                </div>
            </div>
            <h5 class="rr-timestamp">
                <i>Posted: {dateString}</i>
            </h5>
        </div>
    );
}
