import React, { useState, useEffect } from 'react';
import "../styles/RecentReview.css";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { parseReviewWithSpoilersToHTML } from "../functions/ReviewFunctions";
import { generateStars } from "../functions/RatingFunctions";

export default function RecentReview({ cover, username, rating, note, id, reviewId, time }) {
    const date = time.toDate();
    const dateString = date.toLocaleString();

    if (!cover) {
        cover = tempcover;
    }

    const [darkMode, setDarkMode] = useState(
        () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const matcher = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e) => setDarkMode(e.matches);

        matcher.addListener(onChange);

        return () => {
            matcher.removeListener(onChange);
        };
    }, []);

    const displayText = note.length > 250 ? note.slice(0, 250) + '...' : note;
    const stars = generateStars(rating);

    return (
        <div>
            <div className={`rr-container ${darkMode ? "dark" : "light"}`} data-theme={darkMode ? "dark" : "light"}>
                <div className="rr-cover">
                    <Link to={`/game?game_id=${id}`}>
                        <img className="rr-cover-rounded" src={cover} alt="Game Cover" />
                    </Link>
                </div>
                <div className="rr-text">
                    <h5 className="user-name-rating">
                        {stars.map((star, index) => (
                            <span key={index}>{star}</span>
                        ))}
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
