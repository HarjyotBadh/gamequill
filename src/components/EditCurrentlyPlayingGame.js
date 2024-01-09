import React, { useState } from "react";
import Popup from "reactjs-popup";
import ProfileTitleCard from "./ProfileTitleCard";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { fetchGameData } from "../functions/GameFunctions";
import "../styles/EditCurrentlyPlayingGame.css";
export default function EditCurrentlyPlayingGame({
  currentlyPlayingGame,
  setCurrentlyPlayingGame,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gameData, setGameData] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const uid = auth.currentUser.uid;

  const search = (e) => {
    //e.preventDefault();
    const ob = {
      body: `search "${searchQuery}";fields name,cover.url, id; limit:5; where category = (0,8,9);`,
    };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/fetchIGDBGames";
    fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: ob }),
    })
      .then((response) => {
        console.log("Request successful", response);
        if (response.length) {
          const gamesData = response.map((game) => ({
            name: game.name,
            coverUrl: game.cover && game.cover.url ? game.cover.url : null,
            id: game.id,
          }));
          setGameData(gamesData);
        }
      })
      .catch((error) => {
        console.error("Request failed", error);
      });
  };
  // const apiUrl = "http://localhost:8080/https://api.igdb.com/v4/games";
  //   const apiUrl = "https://api.igdb.com/v4/games";

  //   fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
  //       Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo",
  //     },
  //     body: `search "${searchQuery}";fields name,cover.url, id; limit:5; where category = (0,8,9);`,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.length) {
  //         const gamesData = data.map((game) => ({
  //           name: game.name,
  //           coverUrl: game.cover && game.cover.url ? game.cover.url : null,
  //           id: game.id,
  //         }));
  //         setGameData(gamesData);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  const handleSubmit = (e) => {
    search(e);
  };

  const handleSetCurrentlyPlaying = async () => {
    if (selectedGame) {
      const docRef = doc(db, "profileData", uid);
      const gameData = await fetchGameData(selectedGame.id);
      try {
        await updateDoc(docRef, {
          currentlyPlayingGame: gameData.game,
        });
        setCurrentlyPlayingGame(gameData.game);
      } catch (error) {
        console.error("Error updating currently playing game:", error);
      }
    }
  };

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
        height: 550,
        width: 550,
        backgroundColor: "grey",
      }}
    >
      {(close) => (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <div className="SearchBar">
              <input
                type="text"
                name="gameSearch"
                placeholder="Enter Game"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300 }}
              />
              <button type="submit">Search</button>
            </div>
            {gameData[0] && (
              <div>
                Select Game to Set as Currently Playing:
                <div className="searchedGamesBox">
                  {gameData.map((game, index) => (
                    <div
                      key={index}
                      className={`EditGameCard SearchedGames ${
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
                <button
                  className="saveButton"
                  type="button"
                  onClick={handleSetCurrentlyPlaying}
                >
                  Save
                </button>
              </div>
            )}
            <button
              type="close"
              onClick={() => {
                close();
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </Popup>
  );
}
