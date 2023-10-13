import React from 'react';
import "../styles/UserActivity.css";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from 'react-router-dom';


function truncateString(str) {
    const maxLength = 165;
    if (str.length <= maxLength) {
      return str;
    }
    str = str.slice(0, maxLength);
    str = str.slice(0, str.lastIndexOf(' '));
    return str + '...';
  }

export default function UserActivity({ cover, username, rating, note, id }) {

    if (!cover) {
        cover = tempcover;
    }

    return (
        <div class="user-container">
            <div class="user-cover">
                <Link to={`/game?game_id=${id}`}>
                    <img class="user-cover-rounded" src={cover} alt="Pikmin Test"/>
                </Link>
            </div>
            <div class="user-text">
                <h5 class="user-name-rating">{username} - {rating}</h5>
                <h5 class="user-note">{note} <span class="user-note-more"> More ⇒</span> </h5>
            </div>
        </div>
    );
}