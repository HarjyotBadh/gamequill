import React, { useState, useEffect } from 'react';
import "../styles/RecentReview.css";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { parseReviewWithSpoilersToHTML } from "../functions/ReviewFunctions";
import { generateStars } from "../functions/RatingFunctions";

export default function RecentReview({ cover, username, rating, note, id, reviewId }) {

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
        <div class="rr-container">

        </div>
    );
}
