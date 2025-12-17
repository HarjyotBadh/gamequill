import React, { useState } from "react";
import ProfileTitleCard from "./ProfileTitleCard";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { fetchGameData } from "../functions/GameFunctions";
import "../styles/EditCurrentlyPlayingGame.css";
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

export default function EditCurrentlyPlayingGame({
  currentlyPlayingGame,
  setCurrentlyPlayingGame,
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameData, setGameData] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const uid = auth.currentUser.uid;

  const search = async (e) => {
    e.preventDefault();
    const ob = {
      igdbquery: `search '${searchQuery}';fields name,cover.url, id; limit:5; where game_type = (0,8,9);`,
    };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

    try {
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
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  const handleSubmit = (e) => {
    search(e);
  };

  const handleSetCurrentlyPlaying = async () => {
    if (selectedGame) {
      const docRef = doc(db, "profileData", uid);
      const gameDataResult = await fetchGameData(selectedGame.id);
      try {
        await updateDoc(docRef, {
          currentlyPlayingGame: gameDataResult.game,
        });
        setCurrentlyPlayingGame(gameDataResult.game);
        handleClose();
      } catch (error) {
        console.error("Error updating currently playing game:", error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    setGameData([]);
    setSelectedGame(null);
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
        maxWidth="sm"
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
        <DialogTitle className="dialog-title">
          Edit Currently Playing
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
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
                <p>Select Game to Set as Currently Playing:</p>
                <div className="search-results-grid">
                  {gameData.map((game, index) => (
                    <div
                      key={index}
                      className={`game-card ${
                        game === selectedGame ? "selected" : ""
                      }`}
                      onClick={() => setSelectedGame(game)}
                    >
                      <ProfileTitleCard
                        gameData={game.coverUrl ? game.coverUrl : null}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="contained"
                  onClick={handleSetCurrentlyPlaying}
                  disabled={!selectedGame}
                  style={{
                    background: selectedGame
                      ? "var(--accent-gradient)"
                      : "grey",
                    color: "white",
                    marginTop: "16px",
                  }}
                >
                  Save
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
