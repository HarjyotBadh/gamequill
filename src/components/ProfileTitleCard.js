import React from "react";
import "../styles/ProfileTitleCard.css";

export default function ProfileTitleCard({ gameData }) {
  if (!gameData) return <div>Loading...</div>;
  console.log("gameData", gameData);

  const bigCoverUrl = gameData
    ? gameData.replace("/t_thumb/", "/t_cover_big/")
    : null;
  // console.log("this - " + bigCoverUrl);

  return (
    <div>{bigCoverUrl && <img src={bigCoverUrl} alt={gameData.name} />}</div>
  );
}
