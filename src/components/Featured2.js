import React from 'react';
import '../styles/Featured2.css';
import tempscreenshot from "../images/temp_images/tempscreenshot.png";

export default function Featured1({ gameData, screenshots }) {
    
    if (!gameData) {
        return (
            <div class="image-cont rounded-corners">
                <div class="image-container2">
                    <img src={tempscreenshot} alt="Pikmin Test"/>
                </div>
            </div>
        )
    }
    var imageUrl = screenshots[0];
    var company = gameData.involved_companies[0].company.name;

    // Find the image element with the id "game-screenshot"
    var imageElement = document.getElementById("game-screenshot");

    // Set the src attribute of the image element to your variable
    // imageElement.src = imageUrl;


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
        <div class="image-cont rounded-corners">
            <div class="image-container2">
                <img src={imageUrl} alt="Pikmin Test"/>
            </div>
            <div class="overlay"></div>
            <div class="text-overlay">
                <div class="game-name2">{gameData.name}</div>
                <div class="developer">{company}</div>
            </div>
        </div>
    );
}