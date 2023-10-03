import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import ProfileTitleCard from "./ProfileTitleCard";
import "../styles/EditProfile.css";
export default function EditGames({
  profileData,
  setProfileData,
  gameCovers,
  setGameCovers,
}) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameData, setGameData] = useState([]);
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
        Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
      },
      body: `search "${searchQuery}";fields name,cover.url; limit:5; where version_parent = null;`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          const gamesData = data.map((game) => ({
            name: game.name,
            coverUrl: game.cover.url,
          }));
          setGameData(gamesData); // Assuming setGamesData is a function to update the state
          console.log("gamesData", gamesData);
          // const game = data[0];
          // setGameData(game);
          // console.log("gameData", game.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleSubmit = (e) => {
    search(e);
  };
  return (
    <Popup
      trigger={
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
        <div className="modal">
          <form onSubmit={handleSubmit}>
            Choose Game To Replace
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: 450,
                height: 150,
                marginRight: 100,
                color: "white",
              }}
              className="FavoriteGames"
            >
              <div
                className="GameCard Game1"
                onClick={() => {
                  console.log("clicked");
                  setSelectedGame(gameCovers[0]);
                }}
              >
                <ProfileTitleCard gameData={gameCovers[0]} />
              </div>
              <div
                className="GameCard Game2"
                onClick={() => {
                  console.log("clicked");
                  setSelectedGame(gameCovers[1]);
                }}
              >
                <ProfileTitleCard gameData={gameCovers[1]} />
              </div>
              <div
                className="GameCard Game3"
                onClick={() => {
                  console.log("clicked");
                  setSelectedGame(gameCovers[2]);
                }}
              >
                <ProfileTitleCard gameData={gameCovers[2]} />
              </div>
              <div
                className="GameCard Game4"
                onClick={() => {
                  console.log("clicked");
                  setSelectedGame(gameCovers[3]);
                }}
              >
                <ProfileTitleCard gameData={gameCovers[3]} />
              </div>
            </div>
            <div>
              {selectedGame ? (
                <div>
                  Selected Game:
                  <div
                    className="GameCard SelectedGame"
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
              <div
                className="searchedGamesBox"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: 500,
                  height: 150,
                  border: "1px solid white",
                  padding: 10,
                  gap: 10,
                }}
              >
                {gameData[0] ? (
                  <div
                    className="GameCard SearchedGames"
                    style={{
                      border: "1px solid white",
                      width: 100,
                      height: 125,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileTitleCard gameData={gameData[0].coverUrl} />
                  </div>
                ) : null}
                {gameData[1] ? (
                  <div
                    className="GameCard SearchedGames"
                    style={{
                      border: "1px solid white",
                      width: 100,
                      height: 125,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileTitleCard gameData={gameData[1].coverUrl} />
                  </div>
                ) : null}
                {gameData[2] ? (
                  <div
                    className="GameCard SearchedGames"
                    style={{
                      border: "1px solid white",
                      width: 100,
                      height: 125,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileTitleCard gameData={gameData[2].coverUrl} />
                  </div>
                ) : null}
                {gameData[3] ? (
                  <div
                    className="GameCard SearchedGames"
                    style={{
                      border: "1px solid white",
                      width: 100,
                      height: 125,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileTitleCard gameData={gameData[3].coverUrl} />
                  </div>
                ) : null}
                {gameData[4] ? (
                  <div
                    className="GameCard SearchedGames"
                    style={{
                      border: "1px solid white",
                      width: 100,
                      height: 125,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileTitleCard gameData={gameData[4].coverUrl} />
                  </div>
                ) : null}
              </div>
            ) : null}
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
