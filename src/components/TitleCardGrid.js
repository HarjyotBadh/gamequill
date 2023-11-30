// TitleCardGrid.jsx
import React from "react";
import GameCardList from "./GameCardList";
import "../styles/ListPage.css";

const TitleCardGrid = ({
  gameDataArray,
  list_id,
  setGameDataArray,
  setGameIds,
  listData,
  viewMode,
  listType,
  isUser,
}) => {
  const handleDrop = (draggedIndex, hoverIndex) => {
    const newDataArray = [...gameDataArray];
    const [draggedItem] = newDataArray.splice(draggedIndex, 1);
    newDataArray.splice(hoverIndex, 0, draggedItem);
    setGameDataArray(newDataArray);
    const newGameIds = newDataArray.map((data) => data.game.id);
    setGameIds(newGameIds);
    // Perform any other necessary actions
  };
  return (
    <div className={`list ${viewMode === "list" ? "list-view" : ""}`}>
      {gameDataArray.map((gameData, index) => (
        <div
          key={gameData.game.id}
          className="game-item text-black dark:text-white"
        >
          {listType === "ranked" && (
            <span className="rank-number">{index + 1}</span>
          )}
          <GameCardList
            key={gameData.game.id}
            gameDataArray={gameDataArray}
            setGameDataArray={setGameDataArray}
            gameData={gameData.game}
            viewMode={viewMode}
            list_id={list_id}
            setGameIds={setGameIds}
            listOwner={listData.owner}
            index={index} // Pass the index to GameCardList
            onDrop={handleDrop}
          />
        </div>
      ))}
    </div>
  );
};

export default TitleCardGrid;
