import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import TitleCard from "../components/TitleCard";
import "../styles/PlayedPage.css";
import Footer from "../components/Footer";

const PlayedPage = () => {
  const [playedItems, setPlayedItems] = useState([]);
  const [gameDataArray, setGameDataArray] = useState([]);

  // Fetch game data based on the played items
  const fetchGameDatas = async () => {
    if (playedItems.length > 0) {
      try {
        const gameDataArray = await fetchMultipleGameData(playedItems);
        setGameDataArray(gameDataArray);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    } else {
      setGameDataArray([]);
    }
  };

  // Fetches plays from the user's document in Firestore
  const fetchPlays = async () => {
    try {
      const user = auth.currentUser.uid;
      const docRef = doc(db, "profileData", user);
      const docSnap = await getDoc(docRef);
      const docPlays = docSnap.data().plays || [];
      setPlayedItems(docPlays);
    } catch (error) {
      console.error("Error fetching plays data from Firestore:", error);
    }
  };

  // Effect for auth state changed
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        fetchPlays();
      }
    });

    // Cleanup
    return () => unsub();
  }, []);

  // Effect for fetching game data when playedItems changes
  useEffect(() => {
    fetchGameDatas();
  }, [playedItems]);

  return (
    <div className="likes-wrapper">
      <NavBar />
      <div className="plays-container">
        <h1 className="plays-title">My Played Games</h1>
        <div className="plays">
          {gameDataArray.map((gameData) => (
            <TitleCard key={gameData.id} gameData={gameData.game} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlayedPage;
