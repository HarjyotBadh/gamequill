import React from 'react'
import { Link } from 'react-router-dom';
import tempcover from "../images/temp_images/tempcover.png";
import UpcomingCountdown from "./UpcomingCountdown"
import "../styles/UpcomingItem.css"

export default function UpcomingItem({name, cover, gameid, ti}) {

  return (
    <div>
        <Link to={`/game?game_id=${gameid}`}>
            <div class="upcoming-item">
                <img class="upcoming-cover-rounded" src={cover} alt="Game"/>
                <UpcomingCountdown time={ti} />
            </div>
        </Link>
    </div>
  )
}
