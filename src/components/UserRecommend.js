import React from 'react';
import "../styles/UserRecommend.css";
import tempcover from "../images/temp_images/tempcover.png";
import { Link } from 'react-router-dom';


export default function UserRecommend({ genre, c1, c2, c3, i1, i2, i3 }) {

    if (!c1) {
        c1 = tempcover;
    }
    if (!c2) {
        c2 = tempcover;
    }
    if (!c3) {
        c3 = tempcover;
    }
    

    return (
        
        <div class="user-recommend-container">
            <h4 class="recommend-genre">{genre}</h4>
            <div class="recommend-cover">
                <Link to={`/game?game_id=${i1}`}>
                    <img class="recommend-cover-rounded" src={c1} alt="Pikmin Test"/>
                </Link>
            </div>
            <div class="recommend-cover">
            <Link to={`/game?game_id=${i2}`}>
                    <img class="recommend-cover-rounded" src={c2} alt="Pikmin Test"/>
                </Link>
            </div>
            <div class="recommend-cover right-mar">
            <Link to={`/game?game_id=${i3}`}>
                    <img class="recommend-cover-rounded" src={c3} alt="Pikmin Test"/>
                </Link>
            </div>
        </div>
    );
}