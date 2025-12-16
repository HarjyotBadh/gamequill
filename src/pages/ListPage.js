import { React, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import { Popup } from "reactjs-popup";
import ProfileTitleCard from "../components/ProfileTitleCard";

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
  const [isUser, setIsUser] = useState(false);
  const [newListName, setNewListName] = useState("");

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
      if (snapshot.data() && snapshot.data().owner === userId) {
        setIsUser(true);
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
  }, [gameIds]);
  //fetchListData();

  const handleSearch = async (e) => {
    //e.preventDefault();
    // const apiUrl = "http://localhost:8080/https://api.igdb.com/v4/games";
    const apiUrl = "https://api.igdb.com/v4/games";
    const ob = {
      igdbquery: `search "${searchQuery}";fields name,cover.url, id, aggregated_rating; limit:10; where game_type = (0,8,9);`,
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
        aggregated_rating: game.aggregated_rating || 0,
      }));
      gamesData.sort((a, b) => b.aggregated_rating - a.aggregated_rating);
      setSearchResults(gamesData);
    }
    // fetch(apiUrl, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
    //     Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo",
    //   },
    //   body: `search "${searchQuery}";fields name,cover.url, id, aggregated_rating; limit:10; where game_type = (0,8,9);`,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.length) {
    //       const gamesData = data.map((game) => ({
    //         name: game.name,
    //         coverUrl: game.cover && game.cover.url ? game.cover.url : null,
    //         id: game.id,
    //         aggregated_rating: game.aggregated_rating || 0,
    //       }));
    //       gamesData.sort((a, b) => b.aggregated_rating - a.aggregated_rating);
    //       setSearchResults(gamesData);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
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
  const handleEditListName = async () => {
    try {
      const listDocRef = doc(db, "lists", list_id);
      await updateDoc(listDocRef, {
        name: newListName,
      });
      setListData((prevData) => ({
        ...prevData,
        name: newListName,
      }));
    } catch (error) {
      console.error("Error updating list name:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-gradient text-center">
              {listData.name}
            </h1>
            {isUser && (
              <Popup
                trigger={
                  <button
                    className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="Edit List Name"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 border-[var(--text-color)]"
                      style={{ color: "var(--text-color)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                }
                modal
                nested
                contentStyle={{
                  background: "var(--wrapper)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "16px",
                  padding: "24px",
                  width: "400px",
                  boxShadow: "var(--card-shadow)",
                  backdropFilter: "blur(12px)",
                }}
                overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
              >
                {(close) => (
                  <div className="flex flex-col gap-4 text-center">
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--text-color)" }}
                    >
                      Edit List Name
                    </h2>
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="card-global p-3 rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      style={{
                        color: "var(--text-color)",
                        background: "rgba(0,0,0,0.2)",
                      }}
                    />
                    <div className="flex gap-4 justify-center mt-2">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          handleEditListName();
                          close();
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors font-bold"
                        onClick={close}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            )}
          </div>

          {/* List Controls */}
          {isUser && (
            <div className="flex flex-col items-center mt-6 w-full max-w-4xl">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {/* Type Toggle */}
                <button
                  onClick={handleToggleListType}
                  className="px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-black/5 dark:hover:bg-white/5 transition-all font-medium"
                  style={{ color: "var(--text-color)" }}
                >
                  {listType === "ranked"
                    ? "Switch to Unranked"
                    : "Switch to Ranked"}
                </button>

                {/* View Mode Toggles */}
                <div className="flex border border-[var(--glass-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={switchToGridView}
                    className={`p-2 transition-colors ${
                      activeButton === "grid"
                        ? "bg-[var(--primary)] text-white"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    title="Grid View"
                    style={{
                      color:
                        activeButton === "grid" ? "white" : "var(--text-color)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
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
                    onClick={switchToListView}
                    className={`p-2 transition-colors ${
                      activeButton === "list"
                        ? "bg-[var(--primary)] text-white"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    title="List View"
                    style={{
                      color:
                        activeButton === "list" ? "white" : "var(--text-color)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
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
                </div>

                {/* Featured Toggle */}
                <Popup
                  trigger={
                    <button
                      className={`p-2 rounded-lg border border-[var(--glass-border)] transition-colors ${
                        isFeaturedList
                          ? "text-yellow-500 border-yellow-500 bg-yellow-500/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                      title={
                        isFeaturedList
                          ? "Remove from Featured"
                          : "Set as Featured"
                      }
                      style={{
                        color: isFeaturedList ? undefined : "var(--text-color)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isFeaturedList ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </button>
                  }
                  modal
                  contentStyle={{
                    background: "var(--wrapper)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "16px",
                    padding: "24px",
                    width: "350px",
                    textAlign: "center",
                    boxShadow: "var(--card-shadow)",
                    backdropFilter: "blur(12px)",
                  }}
                  overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
                >
                  {(close) => (
                    <div className="flex flex-col gap-4">
                      <p
                        style={{ color: "var(--text-color)" }}
                        className="font-semibold"
                      >
                        {isFeaturedList
                          ? "Remove this from your featured list?"
                          : "Set this as your featured list?"}
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button
                          className="btn-primary"
                          onClick={() => {
                            updateFeaturedList();
                            close();
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg border border-red-500 text-red-500 font-bold hover:bg-red-500/10"
                          onClick={close}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>

                {/* Delete Button */}
                <button
                  onClick={handleDeleteList}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg"
                >
                  Delete List
                </button>
              </div>

              <p
                className="text-sm opacity-70 mb-6"
                style={{ color: "var(--text-color)" }}
              >
                Note: Drag and drop to reorder games
              </p>

              {/* Search Bar */}
              <div className="flex w-full max-w-lg mb-8 gap-2">
                <input
                  type="text"
                  placeholder="Search for games to add..."
                  value={searchQuery}
                  onKeyDown={handleEnterKey}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow card-global p-3 rounded-l-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    color: "var(--text-color)",
                  }}
                />
                <button
                  onClick={handleSearch}
                  className="btn-primary rounded-r-lg"
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12 p-6 card-global rounded-xl animate-fade-in">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              Search Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {searchResults.map((gameData, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-transform hover:scale-105 p-2 rounded-lg border-2 ${
                    selectedGame === gameData
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedGame(gameData)}
                >
                  <ProfileTitleCard gameData={gameData.coverUrl || null} />
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToList}
                disabled={!selectedGame}
              >
                Add Selected Game
              </button>
              <button
                className="px-6 py-2 rounded-lg border border-[var(--secondary-text-color)] text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/5"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Game List Grid */}
        <div
          className={`w-full ${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center"
              : "flex flex-col items-center gap-4"
          }`}
        >
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
