import React from "react";
import { Spinner } from "@material-tailwind/react";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import GameInteractionButtons from "./GameInterationButtons";
import AddToList from "./AddToList";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  calculateAverageRating,
} from "../functions/RatingFunctions";

export default function GameCardList({
  gameDataArray,
  gameData,
  viewMode,
  list_id,
  setGameIds,
  setGameDataArray,
  listOwner,
  index,
  onDrop,
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
    } catch (error) {
      console.error("Error removing game from list:", error);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (!isListOwner) return;
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const hoverIndex = index;

    if (draggedIndex === hoverIndex) return;

    const newDataArray = [...gameDataArray];
    const [draggedItem] = newDataArray.splice(draggedIndex, 1);
    newDataArray.splice(hoverIndex, 0, draggedItem);

    setGameDataArray(newDataArray);
    const newGameIds = newDataArray.map((data) => data.game.id);
    setGameIds(newGameIds);
    const listDocRef = doc(db, "lists", list_id);
    await updateDoc(listDocRef, {
      games: newGameIds,
    });
    onDrop(draggedIndex, hoverIndex);
  };

  return (
    <Card
      className={`game-card-list ${darkMode ? "dark" : "light"} ${viewMode}`}
      sx={{
        bgcolor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "20px",
      }}
      data-theme={darkMode ? "dark" : "light"}
      draggable={isListOwner ? "true" : "false"}
      onDragStart={isListOwner ? handleDragStart : null}
      onDragOver={isListOwner ? handleDragOver : null}
      onDrop={isListOwner ? handleDrop : null}
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
      <CardContent>
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
        <div className="play-buttons-container">
          <GameInteractionButtons gameID={gameData.id} />
        </div>
        <AddToList gameID={gameData.id} />
        {isListOwner ? (
          <button
            className="removeFromListButton"
            onClick={() => handleRemoveFromList(gameData.id)}
          >
            Remove from List
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}
