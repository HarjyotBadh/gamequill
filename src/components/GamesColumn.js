import React from "react";
import TitleCard from "../components/TitleCard";
const GameColumn = ({ games }) => {
  return (
    <div className="gamesColumn">
      {games.map((game, index) => (
        <div key={game.id} className="gameContainer">
          <TitleCard gameData={game.gameData} className="searchedTitleCard" />
        </div>
      ))}
    </div>
  );
};
export default GameColumn;
