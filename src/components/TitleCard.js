import React from "react";
import { Spinner } from "@material-tailwind/react";
import { fetchReviewsByGameId, generateStars } from "./ReviewBar";
import { Link } from "react-router-dom";
import "../styles/TitleCard.css";
import GameLog from "./GameLog";
import GameLike from "./GameLike";

export default function TitleCard({ gameData }) {
    const [averageRating, setAverageRating] = React.useState(0);
    const [darkMode, setDarkMode] = React.useState(
        () =>
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    console.log("gameData: ", gameData);

    React.useEffect(() => {
        const matcher = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e) => setDarkMode(e.matches);

        matcher.addListener(onChange);

        return () => {
            matcher.removeListener(onChange);
        };
    }, []);

    React.useEffect(() => {
        if (gameData.id) {
            fetchReviewsByGameId(gameData.id).then((reviews) => {
                if (reviews.length === 0) {
                    setAverageRating("0.0");
                } else {
                    const totalRating = reviews.reduce(
                        (sum, review) => sum + review.starRating,
                        0
                    );
                    setAverageRating((totalRating / reviews.length).toFixed(1));
                }
            });
        }
    }, [gameData]);

    if (!gameData) return <Spinner color="blue" />;

    const bigCoverUrl = gameData.cover
        ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/")
        : null;
    const textSizeClass = gameData.name.length > 25 ? "text-xl" : "text-4xl";

    const stars = generateStars(averageRating);

    return (
        <div
            className={`game-card ${darkMode ? "dark" : "light"}`}
            data-theme={darkMode ? "dark" : "light"}
        >
            {bigCoverUrl && (
                <Link to={`/game?game_id=${gameData.id}`}>  {/* Wrap the image in a Link */}
                    <img src={bigCoverUrl} alt={gameData.name} />
                </Link>
            )}
            <h2 className={textSizeClass}>{gameData.name}</h2>
            <p>{gameData.involved_companies?.[0]?.company?.name || "N/A"}</p>
            <p className="numericRating">{averageRating}</p>
            <div className="rating">{stars}</div>

            <div class="play-buttons-container">
                <div class="play-button">
                    <GameLog />
                </div>
                <div class="play-button">
                    <GameLike />
                </div>
            </div>
        </div>
    );
}
