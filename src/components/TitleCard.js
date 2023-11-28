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
        <Card
            className="game-cardd"
            sx={{
                maxWidth: 250,
                bgcolor: "var(--background)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "20px",
            }}
        >
            {bigCoverUrl && (
                <Link to={`/game?game_id=${gameData.id}`}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={bigCoverUrl}
                        alt={gameData.name}
                    />
                </Link>
            )}
            <CardContent sx={{ textAlign: "center", width: "100%" }}>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: "var(--text-color)" }}
                >
                    {gameData.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "var(--secondary-text-color)" }}
                >
                    {gameData.involved_companies?.[0]?.company?.name || "N/A"}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: "var(--rating-color)",
                        fontSize: 25,
                        fontWeight: "bold",
                    }}
                >
                    {averageRating}
                </Typography>
                <Rating
                    name="read-only"
                    value={averageRating}
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
                <div className="title-play-buttons-container">
                    <GameInteractionButtons gameID={gameData.id} />
                </div>
                <AddToList gameID={gameData.id} />{" "}
            </CardContent>
        </Card>
    );
}
