import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeTrending.css";
import Featured1 from "./Featured1";
import Featured2 from "./Featured2";
import LoadingScreen from "./LoadingScreen";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import { fetchAverageRating } from "../functions/ReviewFunctions";

function App() {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        // First, get trending game IDs from PopScore (IGDB Visits = popularity_type 1)
        const popQuery = `
          fields game_id, value;
          where popularity_type = 1;
          sort value desc;
          limit 10;
        `;

        const functionUrl =
          "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

        const popResponse = await fetch(functionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            igdbquery: popQuery,
            endpoint: "popularity_primitives",
          }),
        });
        const popData = await popResponse.json();

        let gameIds;
        if (popData.data && popData.data.length >= 5) {
          // Get more game IDs to filter, since some may be older games
          gameIds = popData.data.slice(0, 30).map((p) => p.game_id);

          // Now filter to only include games released in the last year
          const oneYearAgo =
            Math.floor(Date.now() / 1000) - 1 * 365 * 24 * 60 * 60;
          const gamesQuery = `
            fields id, first_release_date;
            where id = (${gameIds.join(
              ","
            )}) & first_release_date > ${oneYearAgo};
            sort first_release_date desc;
            limit 10;
          `;

          const gamesResponse = await fetch(functionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ igdbquery: gamesQuery }),
          });
          const gamesDataRes = await gamesResponse.json();

          if (gamesDataRes.data && gamesDataRes.data.length >= 5) {
            gameIds = gamesDataRes.data.slice(0, 5).map((g) => g.id);
          } else {
            // If not enough recent games, use the top popular ones
            gameIds = popData.data.slice(0, 5).map((p) => p.game_id);
          }
        } else {
          // Fallback to hardcoded IDs if PopScore fails
          gameIds = [96437, 254339, 148241, 127044, 78511];
        }

        // Parallelize fetching game data and ratings
        const [fetchedGamesData, ratings] = await Promise.all([
          fetchMultipleGameData(gameIds),
          Promise.all(gameIds.map((id) => fetchAverageRating(id))),
        ]);

        // Merge ratings into game data
        const mergedData = fetchedGamesData.map((data, index) => ({
          ...data,
          game: {
            ...data.game,
            rating: ratings[index],
          },
        }));

        setGamesData(mergedData);
        sessionStorage.setItem("trendingGamesData", JSON.stringify(mergedData));
      } catch (error) {
        console.error("Error fetching trending games:", error);
        // Fallback to hardcoded IDs
        const fallbackIds = [96437, 254339, 148241, 127044, 78511];
        const fetchedGamesData = await fetchMultipleGameData(fallbackIds);
        setGamesData(fetchedGamesData);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  // Filter out any invalid game data entries
  const validGamesData = gamesData.filter(
    (g) => g && g.game && g.game.id && g.screenshotUrls
  );

  if (loading || validGamesData.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="trending-container">
      <h1 className="trending-head text-gradient">TRENDING GAMES</h1>
      <div className="trending-featured1">
        <Link to={`/game?game_id=${validGamesData[0].game.id}`}>
          <Featured1
            gameData={validGamesData[0].game}
            screenshots={validGamesData[0].screenshotUrls}
          />
        </Link>
      </div>
      {validGamesData.slice(1).map((gameData, index) => (
        <Link
          key={gameData.game.id || index}
          to={`/game?game_id=${gameData.game.id}`}
        >
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
