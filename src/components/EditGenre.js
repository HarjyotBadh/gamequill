import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import "../styles/EditGenre.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";

export default function EditGenre({ genres, setGenres }) {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const gameGenres = [
    "Point-and-Click",
    "Fighting",
    "Shooter",
    "Music",
    "Platform",
    "Puzzle",
    "Racing",
    "Real Time Strategy (RTS)",
    "Role-playing (RPG)",
    "Simulator",
    "Sport",
    "Strategy",
    "Turn-based Strategy (TBS)",
    "Tactical",
    "Quiz/Trivia",
    "Hack and Slash/Beat 'em Up",
    "Pinball",
    "Adventure",
    "Arcade",
    "Visual Novel",
    "Indie",
    "Card & Board Game",
    "MOBA",
  ];

  const [open, setOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(genres || []);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  if (!uid) {
    window.location.href = "/login";
    return null;
  }

  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      setError(false);
    } else if (selectedGenres.length < 4) {
      setSelectedGenres([...selectedGenres, genre]);
      setError(false);
    } else {
      setError(true);
    }
    setSaved(false);
  };

  const handleSave = async () => {
    const docRef = doc(db, "profileData", uid);
    try {
      await updateDoc(docRef, {
        favoriteGenres: selectedGenres,
      });
      setGenres(selectedGenres);
      setSaved(true);
    } catch (err) {
      console.error("Error updating favorite genres:", err);
    }
  };

  const handleClose = () => {
    if (saved) window.location.reload();
    setOpen(false);
  };

  const handleOpen = () => {
    setSelectedGenres(genres || []);
    setSaved(false);
    setError(false);
    setOpen(true);
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
        onClick={handleOpen}
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
        <DialogTitle className="dialog-title">Edit Favorite Genres</DialogTitle>
        <DialogContent>
          <div className="selected-count">
            <span className={selectedGenres.length >= 4 ? "at-limit" : ""}>
              {selectedGenres.length}/4 selected
            </span>
          </div>

          {selectedGenres.length > 0 && (
            <div className="selected-genres-section">
              <p className="section-label">Your Favorites:</p>
              <div className="genre-chips selected">
                {selectedGenres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onDelete={() => handleGenreToggle(genre)}
                    sx={{
                      background: "var(--accent-gradient)",
                      color: "white",
                      fontWeight: 600,
                      "& .MuiChip-deleteIcon": {
                        color: "rgba(255,255,255,0.7)",
                        "&:hover": {
                          color: "white",
                        },
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="all-genres-section">
            <p className="section-label">All Genres:</p>
            <div className="genre-chips">
              {gameGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <Chip
                    key={genre}
                    label={genre}
                    onClick={() => handleGenreToggle(genre)}
                    variant={isSelected ? "filled" : "outlined"}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: isSelected
                        ? "var(--accent-gradient)"
                        : "transparent",
                      color: isSelected ? "white" : "var(--text-color)",
                      borderColor: isSelected
                        ? "transparent"
                        : "var(--secondary-text-color)",
                      fontWeight: isSelected ? 600 : 400,
                      "&:hover": {
                        background: isSelected
                          ? "var(--accent-gradient)"
                          : "rgba(87, 202, 201, 0.15)",
                        borderColor: "var(--primary)",
                        transform: "scale(1.02)",
                      },
                    }}
                  />
                );
              })}
            </div>
          </div>

          {error && (
            <div className="error-message">
              Maximum 4 genres allowed. Remove one to add another.
            </div>
          )}
          {saved && (
            <div className="success-message">Genres saved successfully!</div>
          )}
        </DialogContent>
        <DialogActions className="genre-actions">
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={selectedGenres.length === 0}
            style={{
              background:
                selectedGenres.length > 0 ? "var(--accent-gradient)" : "grey",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Save
          </Button>
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
      </Dialog>
    </>
  );
}
