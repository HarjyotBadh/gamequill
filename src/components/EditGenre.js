import Popup from "reactjs-popup";
import React, { useState } from "react";
import Select from "react-select";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import "../styles/EditGenre.css";
export default function EditGenre({ genres, setGenres }) {
  //const uid = "GPiU3AHpvyOhnbsVSzap";
  const auth = getAuth();
  var uid;
  if (auth.currentUser == null) {
    window.location.href = "/login";
    //uid = "GPiU3AHpvyOhnbsVSzap";
  } else {
    uid = auth.currentUser.uid;
  }

  const gameGenres = [
    { label: "Point-and-Click", value: "Point-and-Click" },
    { label: "Fighting", value: "Fighting" },
    { label: "Shooter", value: "Shooter" },
    { label: "Music", value: "Music" },
    { label: "Platform", value: "Platform" },
    { label: "Puzzle", value: "Puzzle" },
    { label: "Racing", value: "Racing" },
    { label: "Real Time Strategy (RTS)", value: "Real Time Strategy (RTS)" },
    { label: "Role-playing (RPG)", value: "Role-playing (RPG)" },
    { label: "Simulator", value: "Simulator" },
    { label: "Sport", value: "Sport" },
    { label: "Strategy", value: "Strategy" },
    { label: "Turn-based Strategy (TBS)", value: "Turn-based Strategy (TBS)" },
    { label: "Tactical", value: "Tactical" },
    { label: "Quiz/Trivia", value: "Quiz/Trivia" },
    {
      label: "Hack and Slash/Beat 'em Up",
      value: "Hack and Slash/Beat 'em Up",
    },
    { label: "Pinball", value: "Pinball" },
    { label: "Adventure", value: "Adventure" },
    { label: "Arcade", value: "Arcade" },
    { label: "Visual Novel", value: "Visual Novel" },
    { label: "Indie", value: "Indie" },
    { label: "Card & Board Game", value: "Card & Board Game" },
    { label: "MOBA", value: "MOBA" },
  ];

  const [selectedOptions, setSelectedOptions] = useState(
    genres.map((genre) => gameGenres.find((g) => g.value === genre))
  );

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const handleSelectChange = async (selectedOptions) => {
    if (selectedOptions.length <= 4) {
      setSelectedOptions(selectedOptions);
      await setGenres(selectedOptions.map((option) => option.value));
      setSaved(false);
    } else {
      setError(true);
    }
  };
  const handleSave = async () => {
    const updatedGenres = selectedOptions.map((option) => option.value);
    const docRef = doc(db, "profileData", uid);
    try {
      await updateDoc(docRef, {
        favoriteGenres: updatedGenres, // Updated to favoriteGenres
      });
      console.log("Favorite genres updated successfully");
      setSaved(true);
    } catch (error) {
      console.error("Error updating favorite genres:", error);
    }
  };

  //const [selectedOption, setSelectedOption] = useState(null);
  return (
    <Popup
      trigger={
        // Render a trigger element (SVG) for the Popup component
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
          cursor={"pointer"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      }
      modal
      nested
      contentStyle={{
        border: "2px solid white",
        //color: "white",
        height: 800,
        width: 800,
        backgroundColor: "grey",
      }}
    >
      {(close) => (
        // Render the Popup component with a function as its child
        <div className="genre-modal">
          <Select
            isMulti
            value={selectedOptions}
            onChange={handleSelectChange}
            options={gameGenres}
          />
          {error && (
            <div className="error-message">
              You can only select a maximum of 4 genres.
            </div>
          )}
          <div className="button-container">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button
              type="close"
              className="close-button"
              onClick={() => {
                if (saved) window.location.reload();
                close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
