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
  deleteDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import { Popup } from "reactjs-popup";
import ProfileTitleCard from "../components/ProfileTitleCard";
import "../styles/ListPage.css";
import TitleCardGrid from "../components/TitleCardGrid";
import { getListData } from "../functions/ListFunctions";

const ListPage = () => {
  const { list_id } = useParams();
  const [listData, setListData] = useState("");
  const [gameIds, setGameIds] = useState([]);
  const [gameDataArray, setGameDataArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [listType, setListType] = useState("unranked");
  const [viewMode, setViewMode] = useState("grid");
  const [activeButton, setActiveButton] = useState("grid");
  const [isFeaturedList, setIsFeaturedList] = useState(false);

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
      if (snapshot.data() && snapshot.data().ranked !== undefined) {
        setListType(snapshot.data().ranked ? "ranked" : "unranked");
      }
      const userDocRef = doc(db, "profileData", userId);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.featuredList) {
          setIsFeaturedList(userData.featuredList.id === list_id);
        }
      }
      setListData(snapshot.data());
      setGameIds(snapshot.data().games);
    };
  }, []);
  useEffect(() => {
    fetchGameDatas();
    console.log(gameDataArray);
  }, [gameIds]);
  //fetchListData();

  const handleSearch = (e) => {
    //e.preventDefault();
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
          games: arrayUnion(selectedGame.id),
        });
        setGameIds((prevIds) => [...prevIds, selectedGame.id]);
        setGameDataArray((prevData) => [
          ...prevData,
          { id: selectedGame.id, game: selectedGame },
        ]);
        setSearchResults([]);
        setSelectedGame(null);

        //window.location.reload();
      } catch (error) {
        console.error("Error removing game from existing list:", error);
      }
    }
  };
  const handleClearSearch = () => {
    setSearchResults([]);
    setSelectedGame(null);
  };
  const handleToggleListType = async () => {
    try {
      const docRef = doc(db, "lists", list_id);
      await updateDoc(docRef, {
        ranked: listType === "unranked", // Convert to boolean value
      });
      setListType(listType === "ranked" ? "unranked" : "ranked");
    } catch (error) {
      console.error("Error updating list type:", error);
    }
  };
  const handleDeleteList = async () => {
    try {
      const listDocRef = doc(db, "lists", list_id);
      await deleteDoc(listDocRef);
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "profileData", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedLists = userData.lists.filter((id) => id !== list_id);

          await updateDoc(userDocRef, { lists: updatedLists });
        }
      }
      window.location.href = "/lists";
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };
  const switchToGridView = () => {
    setViewMode("grid");
    setActiveButton("grid");
  };

  const switchToListView = () => {
    setViewMode("list");
    setActiveButton("list");
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const updateFeaturedList = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "profileData", user.uid);
        const listData = await getListData(list_id);
        await updateDoc(userDocRef, {
          featuredList: isFeaturedList ? null : listData,
        });
        setIsFeaturedList(!isFeaturedList); // Update local state
      }
    } catch (error) {
      console.error("Error updating featured list:", error);
    }
  };

  return (
    <div className="listPage bg-white dark:bg-gray-500 ${viewMode}">
      <Navbar />
      <div className="list-container bg-white dark:bg-gray-500">
        <h1 className="list-title text-black dark:text-white">
          {listData.name}
        </h1>
        <div className="list-buttons-container flex flex-row">
          <div className="toggle-button-container">
            <button className="toggle-button" onClick={handleToggleListType}>
              {listType === "ranked"
                ? "Switch to Unranked"
                : "Switch to Ranked"}
            </button>
          </div>
          <button
            className={`toggle-viewmode-button ${
              activeButton === "grid" ? "active" : ""
            }`}
            onClick={switchToGridView}
            title="Grid View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
              />
            </svg>
          </button>
          <button
            className={`toggle-viewmode-button ${
              activeButton === "list" ? "active" : ""
            }`}
            onClick={switchToListView}
            title="List View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
          </button>
          <Popup
            trigger={
              <button
                className={`featured-list-button ${
                  isFeaturedList ? "active" : ""
                }`}
                title="Set as Featured List"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            }
            modal
            closeOnDocumentClick
            contentStyle={{
              border: "2px solid white",
              height: 120,
              width: 400,
              padding: 20,
              backgroundColor: "grey",
            }}
          >
            {(close) => (
              <div className="modal">
                <p>
                  {isFeaturedList
                    ? "Do you want to remove this as your featured list?"
                    : "Do you want to set this as your featured list?"}
                </p>
                <button
                  type="close"
                  className="update-featured-button"
                  onClick={() => {
                    close();
                    updateFeaturedList();
                  }}
                >
                  Yes
                </button>
                <button
                  type="close"
                  className="close-popup-button"
                  onClick={() => {
                    close();
                  }}
                >
                  No
                </button>
              </div>
            )}
          </Popup>
          <button className="deleteListButton" onClick={handleDeleteList}>
            Delete List
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for games to add to list..."
            value={searchQuery}
            onKeyDown={handleEnterKey}
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
            <button
              className="clearSearchButton"
              type="button"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          </div>
        )}
        <div className={`list ${viewMode === "list" ? "list-view" : ""}`}>
          <TitleCardGrid
            gameDataArray={gameDataArray}
            viewMode={viewMode}
            list_id={list_id}
            setGameDataArray={setGameDataArray}
            setGameIds={setGameIds}
            listData={listData}
            listType={listType}
          />
        </div>
      </div>
    </div>
  );
};

export default ListPage;
