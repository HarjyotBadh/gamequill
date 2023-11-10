import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/HomeTrending.css";
import Featured1 from "./Featured1";
import Featured2 from "./Featured2";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import { db } from "../firebase";
import {
  query,
  collection,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

function App() {
  const [gamesData, setGamesData] = useState([]);

  const game_ids = [96437, 254339, 213639, 127044, 78511];

  useEffect(() => {
    // Check if gamesData exists in sessionStorage
    //const storedGamesData = JSON.parse(sessionStorage.getItem('gamesData'));

    // if (storedGamesData) {
    // console.log("Loading gamesData from sessionStorage");
    // setGamesData(storedGamesData);
    // } else {
    const fetchTrendingGames = async () => {
      // Query the "games" collection in Firebase to get the top 5 games based on reviews
      try {
        const q = query(
          collection(db, "games"),
          orderBy("reviews", "asc"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);

        const trendingGamesData = querySnapshot.docs.map((doc) => doc.data());
        const sortedGamesData = trendingGamesData.sort(
          (a, b) => b.reviews.length - a.reviews.length
        );

        // Extract game IDs from the retrieved data
        const trendingGameIds = sortedGamesData.map((game) => game.id);

        // Fetch additional game data using the retrieved IDs
        const fetchedGamesData = await fetchMultipleGameData(trendingGameIds);

        setGamesData(fetchedGamesData);

        // Store the fetched data in sessionStorage
        sessionStorage.setItem("gamesData", JSON.stringify(fetchedGamesData));
      } catch (error) {
        console.error("Error fetching trending games:", error);
      }
    };
    (async () => {
      console.log("Calling fetchMultipleGameData in HomeTrending.js");
      const fetchedGamesData = await fetchMultipleGameData(game_ids);
      setGamesData(fetchedGamesData);

      // Store the fetched data in sessionStorage
      sessionStorage.setItem("gamesData", JSON.stringify(fetchedGamesData));
    })();
    //fetchTrendingGames();
    // }
  }, []);

  // Wait until gamesData is populated to render the page.
  if (gamesData.length === 0) return <div>Loading...</div>;

  return (
    <div className="trending-container">
      <h1 className="trending-head">TRENDING GAMES</h1>
      <div className="trending-featured1">
        <Link to={`/game?game_id=${gamesData[0].game.id}`}>
          <Featured1
            gameData={gamesData[0].game}
            screenshots={gamesData[0].screenshotUrls}
          />
        </Link>
      </div>
      {gamesData.slice(1).map((gameData, index) => (
        <Link key={index} to={`/game?game_id=${gameData.game.id}`}>
          <Featured2
            gameData={gameData.game}
            screenshots={gameData.screenshotUrls}
            limitSize={false}
          />
        </Link>
      ))}
    </div>
  );
}

export default App;
