import React from 'react';
import "../styles/UserRecommend.css";
import tempcover from "../images/temp_images/tempcover.png";


export default function UserRecommend({ c1, c2, c3, c4 }) {

    if (!cover) {
        cover = tempcover;
    }

    username = "furmanek"
    rating = 5
    note = truncateString("The Legend of Zelda: Breath of the Wild’s sheer freedom and sense of adventure is a remarkable achievement. Right from the start, the vast landscape of Hyrule is thrown completely open to you, and it constantly finds ways to pique your curiosity with mysterious landmarks, complex hidden puzzles, and enemy camps to raid for treasure and weapons. The fact that you can tackle any one of these things at your own pace and almost never get");
    console.log("cover:  " + cover);
    return (
        
        <div class="user-container">
            <div class="user-cover">
                <img class="user-cover-rounded" src={cover} alt="Pikmin Test"/>
            </div>
            <div class="user-text">
                <h5 class="user-name-rating">{username} - {rating}</h5>
                <h5 class="user-note">{note} <span class="user-note-more"> More ⇒</span> </h5>
            </div>
        </div>
    );
}