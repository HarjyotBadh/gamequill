import React, { useState } from "react";
import ProfileTitleCard from "./ProfileTitleCard";
import "../styles/EditGames.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "var(--rating-color)",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "var(--rating-color)",
    },
  },
});

export default function EditGames({ gameCovers, setGameCovers, gameIds }) {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameData, setGameData] = useState([]);
  const [selectedSearchedGame, setSelectedSearchedGame] = useState(null);
  const auth = getAuth();
  const uid = auth.currentUser.uid;

  const handleReplaceFavorite = async () => {
    if (selectedSearchedGame) {
      const updatedFavorites = [...gameCovers];
      let selectedCardIndex;
      if (selectedGame) {
        selectedCardIndex = gameCovers.indexOf(selectedGame);
      } else {
        selectedCardIndex = gameCovers.findIndex((card) => card === null);
      }
      updatedFavorites[selectedCardIndex] = selectedSearchedGame.coverUrl;
      if (selectedGameId == null) {
        gameIds[selectedCardIndex] = selectedSearchedGame.id;
      } else {
        gameIds[gameIds.indexOf(selectedGameId)] = selectedSearchedGame.id;
      }
      setGameCovers(updatedFavorites);
      setSelectedGame(null);
      setSelectedSearchedGame(null);
      const docRef = doc(db, "profileData", uid);
      try {
        await updateDoc(docRef, {
          favoriteGames: gameIds,
        });
      } catch (error) {
        console.error("Error updating favorite games:", error);
      }
    }
  };

  const search = async (e) => {
    e.preventDefault();
    const ob = {
      igdbquery: `search "${searchQuery}";fields name,cover.url, id; limit:5; where game_type = (0,8,9);`,
    };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: JSON.stringify(ob),
    });
    const data = await response.json();
    const igdbResponse = data.data;
    if (igdbResponse.length) {
      const gamesData = igdbResponse.map((game) => ({
        name: game.name,
        coverUrl: game.cover && game.cover.url ? game.cover.url : null,
        id: game.id,
      }));
      setGameData(gamesData);
    }
  };

  const handleSubmit = (e) => {
    search(e);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedGame(null);
    setSelectedSearchedGame(null);
    setSearchQuery("");
    setGameData([]);
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 edit-icon"
        onClick={() => setOpen(true)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "var(--wrapper)",
            color: "var(--text-color)",
            borderRadius: "16px",
            padding: "10px",
          },
        }}
      >
        <DialogTitle className="dialog-title">Edit Favorite Games</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <p className="dialog-subtitle">
              Select a game to replace, or leave empty to fill the first
              available slot.
            </p>
            <div className="favorite-games-grid">
              {gameCovers.map((game, index) => (
                <div
                  key={index}
                  className={`game-card ${
                    game === selectedGame ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedGame(game);
                    setSelectedGameId(gameIds[index]);
                  }}
                >
                  {game ? (
                    <ProfileTitleCard
                      gameData={game === selectedGame ? selectedGame : game}
                    />
                  ) : (
                    <div className="empty-game-card">
                      <span>Empty</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedGame && (
              <div className="selected-game-section">
                <p>Selected Game:</p>
                <div className="game-card selected-preview">
                  <ProfileTitleCard gameData={selectedGame} />
                </div>
              </div>
            )}

            <div className="search-section">
              <CustomTextField
                type="text"
                name="gameSearch"
                label="Search for a game"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  style: { color: "var(--text-color)" },
                }}
                InputProps={{
                  style: {
                    color: "var(--text-color)",
                    backgroundColor: "var(--background)",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                style={{
                  background: "var(--accent-gradient)",
                  color: "white",
                  marginTop: "8px",
                }}
              >
                Search
              </Button>
            </div>

            {gameData.length > 0 && (
              <div className="search-results-section">
                <p>Select Replacement Game:</p>
                <div className="search-results-grid">
                  {gameData.map((game, index) => (
                    <div
                      key={index}
                      className={`game-card ${
                        game === selectedSearchedGame ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSearchedGame(game)}
                    >
                      {game.coverUrl ? (
                        <ProfileTitleCard gameData={game.coverUrl} />
                      ) : (
                        <div className="no-cover">No Cover</div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="contained"
                  onClick={handleReplaceFavorite}
                  disabled={!selectedSearchedGame}
                  style={{
                    background: selectedSearchedGame
                      ? "var(--accent-gradient)"
                      : "grey",
                    color: "white",
                    marginTop: "16px",
                  }}
                >
                  Replace Selected Favorite
                </Button>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              style={{
                backgroundColor: "var(--rating-color)",
                color: "white",
                borderRadius: "10px",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
