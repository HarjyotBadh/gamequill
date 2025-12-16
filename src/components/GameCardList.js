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
import { calculateAverageRating } from "../functions/RatingFunctions";

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
      className={`card-global overflow-hidden ${
        viewMode === "list" ? "flex-row w-full max-w-4xl p-2" : "flex-col w-64"
      }`}
      sx={{
        bgcolor: "transparent", // Use our global card bg
        display: "flex",
        alignItems: "center",
        borderRadius: "16px",
        boxShadow: "none", // Let card-global handle shadow
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
      draggable={isListOwner ? "true" : "false"}
      onDragStart={isListOwner ? handleDragStart : null}
      onDragOver={isListOwner ? handleDragOver : null}
      onDrop={isListOwner ? handleDrop : null}
    >
      {bigCoverUrl && (
        <Link
          to={`/game?game_id=${gameData.id}`}
          className={
            viewMode === "list" ? "w-32 h-44 flex-shrink-0" : "w-full h-80"
          }
        >
          <CardMedia
            component="img"
            image={bigCoverUrl}
            alt={gameData.name}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              borderRadius: viewMode === "list" ? "8px" : "0",
            }}
          />
        </Link>
      )}
      <CardContent className="w-full flex flex-col items-center text-center">
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          className="line-clamp-2"
          sx={{
            color: "var(--text-color)",
            fontWeight: "bold",
            fontSize: "1.1rem",
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {gameData.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "var(--secondary-text-color)",
            fontSize: "0.85rem",
            mb: 1,
          }}
        >
          {gameData.involved_companies?.[0]?.company?.name || "N/A"}
        </Typography>

        <div className="flex items-center gap-1 mb-2">
          <Typography
            variant="h6"
            sx={{
              color: "var(--rating-color)",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {averageRating}
          </Typography>
          <Rating
            name="read-only"
            value={averageRating}
            readOnly
            size="small"
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

        <div className="play-buttons-container scale-90 origin-center mb-2">
          <GameInteractionButtons gameID={gameData.id} />
        </div>
        <div className="scale-90 origin-center">
          <AddToList gameID={gameData.id} />
        </div>

        {isListOwner ? (
          <button
            className="mt-2 text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider border border-red-500 hover:bg-red-500/10 px-3 py-1 rounded-full transition-colors"
            onClick={() => handleRemoveFromList(gameData.id)}
          >
            Remove
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}
