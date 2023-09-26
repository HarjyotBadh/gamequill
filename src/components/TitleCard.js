import React from 'react';
import '../styles/TitleCard.css';

export default function TitleCard({ gameData }) {
    if (!gameData) return <div>Loading...</div>;

    const bigCoverUrl = gameData.cover ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/") : null;

    // @TODO: Replace rating with our rating system.
    var rating = gameData.aggregated_rating;
    const starAverage = rating ? rating / 20 : 0;  // Convert to a scale of 5
    const fullStars = Math.floor(starAverage);
    const starArr = [];

    for (let i = 1; i <= fullStars; i++) {
        starArr.push(1);
    }

    if (starAverage < 5) {
        const partialStar = starAverage - fullStars;
        starArr.push(partialStar);
        const emptyStars = 5 - starArr.length;
        for (let i = 1; i <= emptyStars; i++) {
            starArr.push(0);
        }
    }

    const stars = starArr.map((val, i) => {
        if (val === 1) return <span key={i} className="fullStar">★</span>;
        else if (val > 0) return <span key={i} className="halfStar">★</span>;
        else return <span key={i} className="emptyStar">★</span>;
    });
    
    
    
    // Rating logic ends

    return (
        <div className="game-card">
            {bigCoverUrl && <img src={bigCoverUrl} alt={gameData.name} />}
            <h2>{gameData.name}</h2>
            <p>{gameData.involved_companies?.[0]?.company?.name || "N/A"}</p>
            <p className="numericRating">{starAverage.toFixed(1)}</p>
            <div className="rating">{stars}</div>
        </div>
    );
}