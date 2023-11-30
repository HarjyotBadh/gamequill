import React from 'react'
import { Link } from 'react-router-dom';
import UpcomingCountdown from "./UpcomingCountdown"
import "../styles/UpcomingItem.css"

export default function UpcomingItem({cover, gameid, ti}) {

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
