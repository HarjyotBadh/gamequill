import React from 'react'
import { Link } from 'react-router-dom';
import tempcover from "../images/temp_images/tempcover.png";
import UpcomingCountdown from "./UpcomingCountdown"
import "../styles/HomeUpcoming.css"

export default function HomeUpcoming() {
  return (
    <div class="upcoming-container">
        <h1 className="trending-head">UPCOMING GAMES</h1>
        <div class="upcoming-grid">
            <Link to={`/game?game_id=${96437}`}>
                <div class="upcoming-item">
                    <img class="upcoming-cover-rounded" src={tempcover} alt="Game"/>
                    <UpcomingCountdown time={1701370999} />
                </div>
            </Link>
            <Link to={`/game?game_id=${96437}`}>
                <div class="upcoming-item">
                    <img class="upcoming-cover-rounded" src={tempcover} alt="Game"/>
                    <UpcomingCountdown time={1701370999} />
                </div>
            </Link>
            <Link to={`/game?game_id=${96437}`}>
                <div class="upcoming-item">
                    <img class="upcoming-cover-rounded" src={tempcover} alt="Game"/>
                    <UpcomingCountdown time={1701370999} />
                </div>
            </Link>
            <Link to={`/game?game_id=${96437}`}>
                <div class="upcoming-item">
                    <img class="upcoming-cover-rounded" src={tempcover} alt="Game"/>
                    <UpcomingCountdown time={1701370999} />
                </div>
            </Link>
            <Link to={`/game?game_id=${96437}`}>
                <div class="upcoming-item">
                    <img class="upcoming-cover-rounded" src={tempcover} alt="Game"/>
                    <UpcomingCountdown time={1701370999} />
                </div>
            </Link>
            <Link to={`/game?game_id=${96437}`}>
                <div class="upcoming-item">
                    <img class="upcoming-cover-rounded" src={tempcover} alt="Game"/>
                    <UpcomingCountdown time={1701370999} />
                </div>
            </Link>
            
        </div>
    </div>
  )
}
