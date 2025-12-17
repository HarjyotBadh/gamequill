import React from "react";
import TitleCard from "../components/TitleCard";
const GameColumn = ({ games }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
      {games.map((game, index) => (
        <div key={game.id} className="w-full">
          <TitleCard gameData={game.gameData} className="w-full" />
        </div>
      ))}
    </div>
  );
};
export default GameColumn;
