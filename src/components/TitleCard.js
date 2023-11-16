import React from "react";
import { Spinner } from "@material-tailwind/react";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";
import { Link } from "react-router-dom";
import "../styles/TitleCard.css";
import GameInteractionButtons from "./GameInterationButtons";
import AddToList from "./AddToList";
import {
    calculateAverageRating,
    generateStars,
} from "../functions/RatingFunctions";

export default function TitleCard({ gameData }) {
    const [averageRating, setAverageRating] = React.useState(0);

    React.useEffect(() => {
        if (gameData.id) {
            fetchReviewsByGameId(gameData.id).then((reviews) => {
                setAverageRating(calculateAverageRating(reviews));
            });
        }
    }, [gameData]);

    if (!gameData) return <Spinner color="blue" />;

    const bigCoverUrl = gameData.cover ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/") : null;

    return (
        <div className={`game-card`}>
            {bigCoverUrl && (
                <Link to={`/game?game_id=${gameData.id}`}>
                    <img src={bigCoverUrl} alt={gameData.name} />
                </Link>
            )}
            <h2 className="title-card-text">{gameData.name}</h2>
            <p>{gameData.involved_companies?.[0]?.company?.name || "N/A"}</p>
            <p className="numericRating">{averageRating}</p>
            <div className="rating">{generateStars(averageRating)}</div>

            <div class="play-buttons-container flex flex-row">
            <GameInteractionButtons gameID={gameData.id} />
        </div>
            <div class="add-to-list flex flex-row text-black dark:text-white">
                Add to list
                <AddToList gameID={gameData.id} />
            </div>
        </div>
    );
}
