// TitleCardGrid.jsx
import React from "react";
import GameCardList from "./GameCardList";
import { useDrop } from "react-dnd";

import "../styles/ListPage.css";

const TitleCardGrid = ({
  gameDataArray,
  list_id,
  setGameDataArray,
  setGameIds,
  listData,
  viewMode,
  listType,
}) => {
  return (
    <div className={`list ${viewMode === "list" ? "list-view" : ""}`}>
      {gameDataArray.map((gameData, index) => (
        <div key={gameData.id} className="game-item text-black dark:text-white">
          {listType === "ranked" && (
            <span className="rank-number">{index + 1}</span>
          )}
          <GameCardList
            gameDataArray={gameDataArray}
            setGameDataArray={setGameDataArray}
            gameData={gameData.game}
            viewMode={viewMode}
            list_id={list_id}
            setGameIds={setGameIds}
            listOwner={listData.owner}
            index={index} // Pass the index to GameCardList
          />
        </div>
      ))}
    </div>
  );
};

export default TitleCardGrid;
