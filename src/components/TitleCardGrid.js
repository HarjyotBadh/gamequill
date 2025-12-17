import React from "react";
import GameCardList from "./GameCardList";

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
    <>
      {gameDataArray.map((gameData, index) => (
        <div
          key={gameData.game.id}
          className={`game-item flex flex-col items-center ${
            viewMode === "list" ? "w-full" : ""
          }`}
        >
          {listType === "ranked" && (
            <span className="text-2xl font-bold text-gradient mb-2">
              {index + 1}
            </span>
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
    </>
  );
};

export default TitleCardGrid;
