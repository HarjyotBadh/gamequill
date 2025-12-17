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
        const functionUrl =
          "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

        const threeMonthsAgo =
          Math.floor(Date.now() / 1000) - 3 * 30 * 24 * 60 * 60;

        const gamesQuery = `
          fields id, name, first_release_date, total_rating_count, hypes, follows;
          where first_release_date > ${threeMonthsAgo} 
            & total_rating_count > 50 
            & category = (0, 8, 9, 10, 11)
            & cover != null;
          sort total_rating_count desc;
          limit 20;
        `;

        const gamesResponse = await fetch(functionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ igdbquery: gamesQuery }),
        });
        const gamesDataRes = await gamesResponse.json();

        let gameIds;
        if (gamesDataRes.data && gamesDataRes.data.length >= 5) {
          gameIds = gamesDataRes.data.slice(0, 5).map((g) => g.id);
        } else {
          const popQuery = `
            fields game_id, value;
            where popularity_type = 1;
            sort value desc;
            limit 30;
          `;

          const popResponse = await fetch(functionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              igdbquery: popQuery,
              endpoint: "popularity_primitives",
            }),
          });
          const popData = await popResponse.json();

          if (popData.data && popData.data.length >= 5) {
            const popularGameIds = popData.data.map((p) => p.game_id);

            const filterQuery = `
              fields id, name, first_release_date, total_rating_count;
              where id = (${popularGameIds.join(",")}) 
                & total_rating_count > 50 
                & cover != null;
              sort total_rating_count desc;
              limit 5;
            `;

            const filterResponse = await fetch(functionUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ igdbquery: filterQuery }),
            });
            const filterData = await filterResponse.json();

            if (filterData.data && filterData.data.length >= 5) {
              gameIds = filterData.data.map((g) => g.id);
            } else {
              gameIds = getCuratedFallbackIds();
            }
          } else {
            gameIds = getCuratedFallbackIds();
          }
        }

        const [fetchedGamesData, ratings] = await Promise.all([
          fetchMultipleGameData(gameIds),
          Promise.all(gameIds.map((id) => fetchAverageRating(id))),
        ]);

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
        const fallbackIds = getCuratedFallbackIds();
        const fetchedGamesData = await fetchMultipleGameData(fallbackIds);
        setGamesData(fetchedGamesData);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  const getCuratedFallbackIds = () => {
    return [
      119388, // Marvel Rivals
      217590, // Indiana Jones and the Great Circle
      252639, // Black Myth: Wukong
      26845, // Elden Ring
      119171, // Warhammer 40,000: Space Marine 2
    ];
  };

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
