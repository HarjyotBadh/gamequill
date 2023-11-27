import React, { useState, useEffect } from "react";
import "../styles/UserActivity.css";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { parseReviewWithSpoilersToHTML } from "../functions/ReviewFunctions";
import Rating from "@mui/material/Rating";

export default function UserActivity({
    cover,
    username,
    rating,
    note,
    id,
    reviewId,
    uid,
}) {
    if (!cover) {
        cover = tempcover;
    }

    const displayText = note.length > 250 ? note.slice(0, 250) + "..." : note;

    return (
        <div className={`user-container`}>
            <div className="user-cover">
                <Link to={`/game?game_id=${id}`}>
                    <img
                        className="user-cover-rounded"
                        src={cover}
                        alt="Game Cover"
                    />
                </Link>
            </div>
            <div className="user-text">
                <h5 className="user-name-rating">
                    <Link to={`/Profile?user_id=${uid}`}>
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
                    </Link>
                </h5>

                <Link
                    to={`/review/${reviewId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <p
                        className="review-text-snapshot"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                parseReviewWithSpoilersToHTML(displayText)
                            ),
                        }}
                    >
                        {/* Content will be inserted by dangerouslySetInnerHTML */}
                    </p>
                </Link>
            </div>
        </div>
    );
}
