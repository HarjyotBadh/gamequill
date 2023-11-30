import React from "react";
import "../styles/ProfileTitleCard.css";

export default function ProfileTitleCard({ gameData }) {
  if (!gameData) return <div></div>;

  const bigCoverUrl = gameData
    ? gameData.replace("/t_thumb/", "/t_cover_big/")
    : null;

  return (
    <div className="profile-game-card">
      {bigCoverUrl && <img src={bigCoverUrl} alt={gameData.name} />}
    </div>
  );
}
