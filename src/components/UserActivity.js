import React from 'react';
import "../styles/UserActivity.css";


function truncateString(str, maxLength = 165) {
    if (str.length <= maxLength) {
      return str;
    }
    str = str.slice(0, maxLength);
    str = str.slice(0, str.lastIndexOf(' '));
    return str + '...';
  }

export default function Featured1({ cover, username, rating, note }) {
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