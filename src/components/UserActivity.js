import React, { useState, useEffect } from 'react';
import "../styles/UserActivity.css";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { parseReviewWithSpoilersToHTML } from "../functions/ReviewFunctions";
import { generateStars } from "../functions/RatingFunctions";

export default function UserActivity({ cover, username, rating, note, id, reviewId }) {

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
        <div className={`user-container ${darkMode ? "dark" : "light"}`} data-theme={darkMode ? "dark" : "light"}>
            <div className="user-cover">
                <Link to={`/game?game_id=${id}`}>
                    <img className="user-cover-rounded" src={cover} alt="Game Cover" />
                </Link>
            </div>
            <div className="user-text">
                <h5 className="user-name-rating">
                    {username} - 
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
                        {/* Content will be inserted by dangerouslySetInnerHTML */}
                    </p>
                    <span className="user-note-more"> More ⇒</span>
                </Link>
            </div>
        </div>
    );
}
