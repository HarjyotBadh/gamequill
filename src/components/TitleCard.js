import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { Spinner } from "@material-tailwind/react";
import GameInteractionButtons from "./GameInterationButtons";
import AddToList from "./AddToList";
import { calculateAverageRating } from "../functions/RatingFunctions";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";
import "../styles/TitleCard.css";

export default function TitleCard({ gameData }) {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (gameData.id) {
      fetchReviewsByGameId(gameData.id).then((reviews) => {
        setAverageRating(calculateAverageRating(reviews));
      });
    }
  }, [gameData]);

  if (!gameData) return <Spinner color="blue" />;

  const bigCoverUrl = gameData.cover
    ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/")
    : null;

  return (
    <div
      className="card-global title-card-container"
      style={{
        maxWidth: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        width: "100%",
      }}
    >
      {bigCoverUrl && (
        <Link
          to={`/game?game_id=${gameData.id}`}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <img
            src={bigCoverUrl}
            alt={gameData.name}
            style={{
              borderRadius: "12px",
              width: "100%",
              maxWidth: "200px",
              objectFit: "cover",
            }}
          />
        </Link>
      )}
      <div style={{ textAlign: "center", width: "100%", marginTop: "16px" }}>
        <h2
          className="text-gradient"
          style={{ fontSize: "1.5rem", margin: "0 0 8px 0" }}
        >
          {gameData.name}
        </h2>
        <p
          style={{ color: "var(--secondary-text-color)", margin: "0 0 16px 0" }}
        >
          {gameData.involved_companies?.[0]?.company?.name || "N/A"}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span
            style={{
              color: "var(--rating-color)",
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            {averageRating}
          </span>
          <Rating
            name="read-only"
            value={Number(averageRating)}
            precision={0.2}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": {
                color: "var(--rating-color)",
              },
              "& .MuiRating-iconEmpty": {
                color: "var(--star-color)",
              },
            }}
          />
        </div>

        <div
          className="title-play-buttons-container"
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <GameInteractionButtons gameID={gameData.id} />
        </div>
        <div style={{ marginTop: "16px", w: "100%" }}>
          <AddToList gameID={gameData.id} />
        </div>
      </div>
    </div>
  );
}
