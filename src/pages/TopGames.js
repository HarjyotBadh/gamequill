import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import GenreIcon from "../components/GenreIcon";
import Footer from "../components/Footer";
import "../styles/TopGames.css";

const genres = [
  { id: null, name: "All", label: "All Genres" },
  { id: 31, name: "Adventure", label: "Adventure" },
  { id: 33, name: "Arcade", label: "Arcade" },
  { id: 35, name: "Card & Board Game", label: "Card & Board Game" },
  { id: 4, name: "Fighting", label: "Fighting" },
  { id: 25, name: "Hack and Slash/Beat 'em Up", label: "Hack and Slash" },
  { id: 32, name: "Indie", label: "Indie" },
  { id: 36, name: "MOBA", label: "MOBA" },
  { id: 7, name: "Music", label: "Music" },
  { id: 30, name: "Pinball", label: "Pinball" },
  { id: 8, name: "Platform", label: "Platform" },
  { id: 2, name: "Point-and-Click", label: "Point-and-Click" },
  { id: 9, name: "Puzzle", label: "Puzzle" },
  { id: 26, name: "Quiz/Trivia", label: "Quiz/Trivia" },
  { id: 10, name: "Racing", label: "Racing" },
  { id: 11, name: "Real Time Strategy (RTS)", label: "RTS" },
  { id: 12, name: "Role-playing (RPG)", label: "RPG" },
  { id: 5, name: "Shooter", label: "Shooter" },
  { id: 13, name: "Simulator", label: "Simulator" },
  { id: 14, name: "Sport", label: "Sport" },
  { id: 15, name: "Strategy", label: "Strategy" },
  { id: 24, name: "Tactical", label: "Tactical" },
  { id: 16, name: "Turn-based Strategy (TBS)", label: "TBS" },
  { id: 34, name: "Visual Novel", label: "Visual Novel" },
];

const sortOptions = [
  { id: "rating", label: "Highest Rated" },
  { id: "popularity", label: "Most Popular (Visits)" },
  { id: "wantToPlay", label: "Most Wanted" },
  { id: "playing", label: "Most Playing" },
];

function TopGames() {
  const [selectedGenre, setSelectedGenre] = useState(genres[0]);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [topGamesData, setTopGamesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedSort.id === "rating") {
          // Fetch by rating from games endpoint
          const genreFilter = selectedGenre.id
            ? ` & genres = (${selectedGenre.id})`
            : "";
          const requestBody = `
            fields name, aggregated_rating, rating, genres.name, cover.url;
            where rating > 70 & total_rating_count > 25 & game_type = (0,8,9)${genreFilter};
            sort rating desc;
            limit 20;
          `;

          const ob = { igdbquery: requestBody };
          const functionUrl =
            "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

          const response = await fetch(functionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ob),
          });
          const data = await response.json();
          setTopGamesData(data.data || []);
        } else {
          // Fetch by popularity primitives
          const popularityTypeMap = {
            popularity: 1, // IGDB Visits
            wantToPlay: 2, // Want to Play
            playing: 3, // Playing
          };
          const popularityType = popularityTypeMap[selectedSort.id];

          // First, get popular game IDs from popularity_primitives
          const popQuery = `
            fields game_id, value;
            where popularity_type = ${popularityType};
            sort value desc;
            limit 50;
          `;

          const popOb = {
            igdbquery: popQuery,
            endpoint: "popularity_primitives",
          };
          const functionUrl =
            "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

          const popResponse = await fetch(functionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(popOb),
          });
          const popData = await popResponse.json();

          // Check if we got an error (function not deployed yet) - fallback to rating
          if (popData.error || !popData.data || popData.data.length === 0) {
            console.warn("PopScore not available, falling back to rating sort");
            const genreFilter = selectedGenre.id
              ? ` & genres = (${selectedGenre.id})`
              : "";
            const fallbackQuery = `
              fields name, aggregated_rating, rating, genres.name, cover.url;
              where rating > 70 & total_rating_count > 25 & game_type = (0,8,9)${genreFilter};
              sort rating desc;
              limit 20;
            `;
            const fallbackOb = { igdbquery: fallbackQuery };
            const fallbackResponse = await fetch(functionUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(fallbackOb),
            });
            const fallbackData = await fallbackResponse.json();
            setTopGamesData(fallbackData.data || []);
            return;
          }

          const popularGameIds = popData.data.map((p) => p.game_id);

          if (popularGameIds.length > 0) {
            // Then fetch game details for those IDs
            const genreFilter = selectedGenre.id
              ? ` & genres = (${selectedGenre.id})`
              : "";
            const gamesQuery = `
              fields name, aggregated_rating, rating, genres.name, cover.url;
              where id = (${popularGameIds.join(
                ","
              )}) & game_type = (0,8,9)${genreFilter};
              limit 20;
            `;

            const gamesOb = { igdbquery: gamesQuery };
            const gamesResponse = await fetch(functionUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(gamesOb),
            });
            const gamesData = await gamesResponse.json();

            // Sort games by their original popularity order
            const sortedGames = (gamesData.data || []).sort((a, b) => {
              return (
                popularGameIds.indexOf(a.id) - popularGameIds.indexOf(b.id)
              );
            });
            setTopGamesData(sortedGames);
          } else {
            setTopGamesData([]);
          }
        }
      } catch (error) {
        console.error("Error fetching top games:", error);
        setTopGamesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenre, selectedSort]);

  const getCoverUrl = (game) => {
    if (game.cover?.url) {
      return game.cover.url.replace("t_thumb", "t_cover_big");
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-500 min-h-screen">
      <NavBar />

      <div className="top-games-container px-8 py-6">
        <h1 className="text-3xl font-bold dark:text-white text-black mb-6">
          Top Games
        </h1>

        {/* Sort options */}
        <div className="sort-options flex flex-wrap gap-2 mb-4">
          <span className="dark:text-white text-black font-medium mr-2 self-center">
            Sort by:
          </span>
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedSort(option)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedSort.id === option.id
                  ? "bg-green-600 text-white"
                  : "dark:bg-gray-600 bg-gray-200 dark:text-gray-300 text-gray-700 hover:bg-green-500 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Genre tabs */}
        <div className="genre-tabs flex flex-wrap gap-2 mb-8">
          {genres.map((genre) => (
            <button
              key={genre.name}
              onClick={() => setSelectedGenre(genre)}
              className={`genre-tab flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                selectedGenre.name === genre.name
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "dark:bg-gray-600 bg-gray-100 dark:border-gray-500 border-gray-300 dark:text-white text-black hover:border-blue-400"
              }`}
            >
              {genre.id && <GenreIcon g={genre.name} />}
              <span className="text-sm font-medium">{genre.label}</span>
            </button>
          ))}
        </div>

        {/* Selected genre header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold dark:text-white text-black">
            {selectedGenre.label === "All Genres"
              ? `${selectedSort.label} Games`
              : `${selectedSort.label} ${selectedGenre.label} Games`}
          </h2>
        </div>

        {/* Games grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64 dark:text-white text-black">
            <span className="text-xl">Loading top games...</span>
          </div>
        ) : topGamesData.length === 0 ? (
          <div className="flex items-center justify-center h-64 dark:text-white text-black">
            <span className="text-xl">No games found for this selection</span>
          </div>
        ) : (
          <div className="games-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {topGamesData.map((game) => (
              <div key={game.id} className="game-card">
                <Link to={`/game?game_id=${game.id}`} className="block">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 dark:border-gray-600 border-gray-300 hover:border-blue-500 transition-all bg-gray-800">
                    {getCoverUrl(game) ? (
                      <img
                        src={getCoverUrl(game)}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-2 text-center">
                        {game.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium dark:text-white text-black truncate">
                      {game.name}
                    </p>
                    {game.rating && (
                      <p className="text-xs dark:text-gray-300 text-gray-600">
                        Rating: {Math.round(game.rating)}%
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default TopGames;
