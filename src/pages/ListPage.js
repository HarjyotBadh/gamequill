import { React, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useEffect } from "react";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import GameCardList from "../components/GameCardList";
import ProfileTitleCard from "../components/ProfileTitleCard";
import "../styles/ListPage.css";

const ListPage = () => {
  const { list_id } = useParams();
  const [listData, setListData] = useState("");
  const [gameIds, setGameIds] = useState([]);
  const [gameDataArray, setGameDataArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  // Fetch game data based on the played items
  const fetchGameDatas = async () => {
    if (gameIds.length > 0) {
      try {
        const gameDataArray = await fetchMultipleGameData(gameIds);
        setGameDataArray(gameDataArray);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    } else {
      setGameDataArray([]);
    }
  };

  useEffect(() => {
    //fetchListData();
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        console.log(theuserId);
        fetchListData(theuserId);
      } else {
        // not logged in
      }
    });
    const fetchListData = async (userId) => {
      const docRef = doc(db, "lists", list_id);
      const snapshot = await getDoc(docRef);
      setListData(snapshot.data());
      setGameIds(snapshot.data().games);
    };
  }, []);
  useEffect(() => {
    fetchGameDatas();
  }, [gameIds]);
  //fetchListData();

  const handleSearch = (e) => {
    e.preventDefault();
    const corsAnywhereUrl = "http://localhost:8080/";
    const apiUrl = "https://api.igdb.com/v4/games";

    fetch(corsAnywhereUrl + apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
      },
      body: `search "${searchQuery}";fields name,cover.url, id, aggregated_rating; limit:10; where category = (0,8,9);`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          const gamesData = data.map((game) => ({
            name: game.name,
            coverUrl: game.cover && game.cover.url ? game.cover.url : null,
            id: game.id,
            aggregated_rating: game.aggregated_rating || 0,
          }));
          console.log(gamesData);
          gamesData.sort((a, b) => b.aggregated_rating - a.aggregated_rating);
          setSearchResults(gamesData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleAddToList = async () => {
    if (selectedGame) {
      try {
        // Add the game to the existing list
        const listDocRef = doc(db, "lists", list_id);
        await updateDoc(listDocRef, {
          games: arrayUnion(selectedGame.id), // Assuming game is available in scope
        });

        // Redirect the user to the list page
        window.location.reload();
      } catch (error) {
        console.error("Error removing game from existing list:", error);
      }
    }
  };
  const handleRemoveFromList = async (gameId) => {
    try {
      const listDocRef = doc(db, "lists", list_id);
      await updateDoc(listDocRef, {
        games: arrayRemove(gameId),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error removing game from list:", error);
    }
  };

  return (
    <div className="listPage bg-white dark:bg-gray-500">
      <Navbar />
      <div className="list-container bg-white dark:bg-gray-500">
        <h1 className="list-title text-black dark:text-white">
          {listData.name}
        </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for games to add to list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {searchResults.length > 0 && (
          <div className="userHasSearched flex flex-col">
            <div className="search-results">
              {searchResults.map((gameData, index) => (
                <div
                  key={index}
                  className={`EditGameCard SearchedGames ${
                    gameData === selectedGame ? "selected" : ""
                  }`}
                  onClick={() => setSelectedGame(gameData)}
                >
                  <ProfileTitleCard
                    gameData={gameData.coverUrl ? gameData.coverUrl : null}
                  />
                </div>
              ))}
            </div>
            <button
              className="addToListButton"
              type="button"
              onClick={handleAddToList}
            >
              Add to List
            </button>
          </div>
        )}
        <div className="list">
          {gameDataArray.map((gameData) => (
            <div key={gameData.id} className="game-item">
              <GameCardList gameData={gameData.game} />
              <div className="removeButtonContainer">
                <button
                  className="removeFromListButton"
                  onClick={() => handleRemoveFromList(gameData.id)}
                >
                  Remove from List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
