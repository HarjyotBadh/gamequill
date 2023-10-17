import React from 'react';
import '../styles/Featured1.css';
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
    var rating = Math.floor((gameData.aggregated_rating / 20) * 100) / 100
    
    
    
    // Rating logic ends

    return (
        
        <div class="image-cont rounded-corners">
            <div class="image-container2">
                <img src={imageUrl} alt="Pikmin Test"/>
            </div>
            <div class="overlay"></div>
            <div class="text-overlay">
                <div class="game-name1">{gameData.name}</div>
                <div class="developer1">{company} - {rating}</div>
            </div>
        </div>
    );
}