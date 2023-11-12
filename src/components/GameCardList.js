import React from "react";
import { Spinner } from "@material-tailwind/react";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";
import { Link } from "react-router-dom";
import "../styles/GameCardList.css";
import GameLog from "./GameLog";
import GameLike from "./GameLike";
import AddWishlistButton from "./AddWishlistButton";
import AddToList from "./AddToList";
import {
  calculateAverageRating,
  generateStars,
} from "../functions/RatingFunctions";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function TitleCard({
  gameData,
  viewMode,
  list_id,
  setGameIds,
  setGameDataArray,
  listOwner,
}) {
  const [averageRating, setAverageRating] = React.useState(0);
  const [darkMode, setDarkMode] = React.useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

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
        setAverageRating(calculateAverageRating(reviews));
      });
    }
  }, [gameData]);

  if (!gameData) return <Spinner color="blue" />;

  const bigCoverUrl = gameData.cover
    ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/")
    : null;
  // const textSizeClass = gameData.name.length > 25 ? "text-xl" : "text-4xl";

  const stars = generateStars(averageRating);
  const isListOwner = auth.currentUser && auth.currentUser.uid === listOwner;

  const handleRemoveFromList = async (gameId) => {
    try {
      const listDocRef = doc(db, "lists", list_id);
      await updateDoc(listDocRef, {
        games: arrayRemove(gameId),
      });
      setGameIds((prevIds) => prevIds.filter((id) => id !== gameId));
      setGameDataArray((prevData) =>
        prevData.filter((data) => data.id !== gameId)
      );
      //window.location.reload();
    } catch (error) {
      console.error("Error removing game from list:", error);
    }
  };

  return (
    <div
      className={`game-card-list ${darkMode ? "dark" : "light"} ${viewMode}`}
      data-theme={darkMode ? "dark" : "light"}
    >
      {bigCoverUrl && (
        <Link to={`/game?game_id=${gameData.id}`}>
          {" "}
          {/* Wrap the image in a Link */}
          <img src={bigCoverUrl} alt={gameData.name} />
        </Link>
      )}
      <h2 className="title-card-text">{gameData.name}</h2>
      <p>{gameData.involved_companies?.[0]?.company?.name || "N/A"}</p>
      <p className="numericRating">{averageRating}</p>
      <div className="rating">{stars}</div>

      <div class="play-buttons-container flex flex-row">
        <div class="play-button">
          <GameLog gameID={gameData.id} />
        </div>
        <div class="play-button">
          <GameLike gameID={gameData.id} />
        </div>
      </div>
      <div class="play-button">
        <AddWishlistButton gameID={gameData.id} />
      </div>
      {isListOwner ? (
        <button
          className="removeFromListButton"
          onClick={() => handleRemoveFromList(gameData.id)}
        >
          Remove from List
        </button>
      ) : (
        <AddToList gameID={gameData.id} />
      )}
    </div>
  );
}
