import React from 'react';
import "../styles/UserActivity.css";

export default function Featured1({ cover }) {
    console.log("cover:  " + cover);
    return (
        
        <div class="user-container">
            <div class="user-cover">
                <img class="user-rounded" src={cover} alt="Pikmin Test"/>
            </div>
            <div class="user-cover2">
                <h5>woAh</h5>
            </div>
        </div>
    );
}