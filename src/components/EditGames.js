// Import necessary dependencies and components
import React, { useState } from "react";
import Popup from "reactjs-popup";
import ProfileTitleCard from "./ProfileTitleCard";
import "../styles/EditGames.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

// Define the functional component EditGames and pass it the props gameCovers and setGameCovers
export default function EditGames({ gameCovers, setGameCovers, gameIds }) {
  // Define state variables using the useState hook
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameData, setGameData] = useState([]);
  const [selectedSearchedGame, setSelectedSearchedGame] = useState(null);
  //const uid = "GPiU3AHpvyOhnbsVSzap";
  const auth = getAuth();
  var uid;
  // if (auth.currentUser == null) {
  //   window.location.href = "/login";
  //   //uid = "GPiU3AHpvyOhnbsVSzap";
  // } else {
  uid = auth.currentUser.uid;
  // }

  // Define a function to handle replacing a favorite game
  const handleReplaceFavorite = async () => {
    if (selectedSearchedGame) {
      const updatedFavorites = [...gameCovers];
      let selectedCardIndex;
      if (selectedGame) {
        selectedCardIndex = gameCovers.indexOf(selectedGame);
      } else {
        // If no game is selected, find the first empty slot
        selectedCardIndex = gameCovers.findIndex((card) => card === null);
      }
      updatedFavorites[selectedCardIndex] = selectedSearchedGame.coverUrl;
      // updatedFavorites[gameCovers.indexOf(selectedGame)] =
      //   selectedSearchedGame.coverUrl;
      if (selectedGameId == null) {
        gameIds[selectedCardIndex] = selectedSearchedGame.id;
      } else {
        gameIds[gameIds.indexOf(selectedGameId)] = selectedSearchedGame.id;
      }
      setGameCovers(updatedFavorites);
      setSelectedGame(null);
      setSelectedSearchedGame(null); // Reset selected searched game
      const docRef = doc(db, "profileData", uid);
      try {
        await updateDoc(docRef, {
          favoriteGames: gameIds,
        });
        console.log("Fåavorite games updated successfully");
      } catch (error) {
        console.error("Error updating favorite games:", error);
      }
    }
  };

  // Define a function to handle the search functionality
  const search = (e) => {
    e.preventDefault();
    const corsAnywhereUrl = "http://localhost:8080/";
    const apiUrl = "https://api.igdb.com/v4/games";
    console.log("Search: ", searchQuery);

    fetch(corsAnywhereUrl + apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo",
      },
      body: `search "${searchQuery}";fields name,cover.url, id; limit:5; where category = (0,8,9);`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          const gamesData = data.map((game) => ({
            name: game.name,
            coverUrl: game.cover && game.cover.url ? game.cover.url : null,
            id: game.id,
          }));
          setGameData(gamesData);
          console.log("gamesData", gamesData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Define a function to handle the form submission
  const handleSubmit = (e) => {
    search(e);
  };

  // Return the JSX for the component
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
          onClick={() => console.log("clicked")}
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
        <div className="modal">
          <form onSubmit={handleSubmit}>
            {/* Form to handle game replacement */}
            Choose Game To Replace<br></br>
            If no game is selected, the first empty slot will be replaced.
            <div className="FavoriteGames">
              {/* Map over gameCovers to display favorite games */}
              {gameCovers.map((game, index) => (
                <div
                  key={index}
                  className={`EditGameCard Game${index + 1}`}
                  onClick={() => {
                    setSelectedGame(game);
                    setSelectedGameId(gameIds[index]);
                  }}
                >
                  {/* Display the ProfileTitleCard for the game */}
                  {game ? (
                    <ProfileTitleCard
                      gameData={game === selectedGame ? selectedGame : game}
                    />
                  ) : (
                    <div className="EmptyGameCard">
                      <span>Empty</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              {selectedGame ? (
                <div>
                  {/* Display the selected favorite game */}
                  Selected Game:
                  <div
                    className="EditGameCard SelectedGame"
                    style={{
                      border: "1px solid white",
                      width: 100,
                      height: 125,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileTitleCard gameData={selectedGame} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="SearchBar">
              {/* Input field for game search */}
              <input
                type="text"
                name="gameSearch"
                placeholder="Enter Game"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            <button type="submit">Search</button>
            {gameData[0] ? (
              <div>
                {/* Display searched games */}
                Select Replacement Game
                <div className="searchedGamesBox">
                  {/* Map over gameData to display searched games */}
                  {gameData.map((game, index) => (
                    <div
                      key={index}
                      className={`EditGameCard SearchedGames ${
                        game === selectedSearchedGame ? "selected" : ""
                      }`}
                      style={{
                        width: 100,
                        height: 125,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedSearchedGame(game)}
                    >
                      {/* Display the ProfileTitleCard for the searched game */}
                      {game.coverUrl ? (
                        <ProfileTitleCard gameData={game.coverUrl} />
                      ) : (
                        <div>No Cover Image Available</div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Button to replace selected favorite */}
                <button
                  type="submit"
                  onClick={handleReplaceFavorite}
                  // disabled={!selectedGame}
                >
                  Replace Selected Favorite
                </button>
              </div>
            ) : null}
            {/* Button to close the modal */}
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
