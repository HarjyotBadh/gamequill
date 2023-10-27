import React from "react";
import TitleCard from "../components/TitleCard";
const GameColumn = ({ games }) => {
  return (
    <div className="gamesColumn">
      {games.map((game, index) => (
        <div key={game.id} className="gameContainer">
          <div
            className="gameLink"
            onClick={() => (window.location.href = `/game?game_id=${game.id}`)}
          >
            <TitleCard gameData={game.gameData} className="searchedTitleCard" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default GameColumn;
