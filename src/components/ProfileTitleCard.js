import React from "react";
import "../styles/ProfileTitleCard.css";

export default function ProfileTitleCard({ gameData }) {
  if (!gameData) return <div>Loading...</div>;

  const bigCoverUrl = gameData.cover
    ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/")
    : null;
  // console.log("this - " + bigCoverUrl);

  return (
    <div className="game-card">
      {bigCoverUrl && <img src={bigCoverUrl} alt={gameData.name} />}
    </div>
  );
}
