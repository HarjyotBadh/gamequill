import React from "react";
import "../styles/UserRecommend.css";
import tempcover from "../images/temp_images/tempcover.png";
import GenreIcon from "./GenreIcon";
import { Link } from "react-router-dom";

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

  if (!genre) {
    return null;
  }

  return (
    <div className="user-recommend-container">
      <h4 className="recommend-genre">
        <GenreIcon g={genre} />
        <span>{genre.charAt(0).toUpperCase() + genre.slice(1)}</span>
      </h4>
      <div className="recommend-cover">
        <Link to={`/game?game_id=${i1}`}>
          <img className="recommend-cover-rounded" src={c1} alt="Game Cover" />
        </Link>
      </div>
      <div className="recommend-cover">
        <Link to={`/game?game_id=${i2}`}>
          <img className="recommend-cover-rounded" src={c2} alt="Game Cover" />
        </Link>
      </div>
      <div className="recommend-cover right-mar">
        <Link to={`/game?game_id=${i3}`}>
          <img className="recommend-cover-rounded" src={c3} alt="Game Cover" />
        </Link>
      </div>
    </div>
  );
}
