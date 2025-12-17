import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import GenreIcon from "../components/GenreIcon";
import Footer from "../components/Footer";

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
            fields name, aggregated_rating, rating, total_rating_count, genres.name, cover.url;
            where aggregated_rating > 80 & total_rating_count > 100 & game_type = (0,8,9)${genreFilter};
            sort total_rating_count desc;
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
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 flex-grow">
        {/* Left Sidebar - Genres */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="card-global p-4 sticky top-4">
            <h2
              className="text-xl font-bold mb-4 px-2"
              style={{ color: "var(--text-color)" }}
            >
              Genres
            </h2>
            <div className="flex flex-col gap-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {genres.map((genre) => (
                <button
                  key={genre.name}
                  onClick={() => setSelectedGenre(genre)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedGenre.name === genre.name
                      ? "shadow-md translate-x-1"
                      : "hover:bg-black/5 hover:dark:bg-white/5 hover:translate-x-1"
                  }`}
                  style={{
                    background:
                      selectedGenre.name === genre.name
                        ? "var(--accent-gradient)"
                        : "transparent",
                    color:
                      selectedGenre.name === genre.name
                        ? "white"
                        : "var(--text-color)",
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {genre.id && <GenreIcon g={genre.name} />}
                  </div>
                  <span>{genre.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Header, Sort, and Grid */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-4xl font-bold text-gradient">Top Games</h1>

            {/* Sort options */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className="font-semibold mr-2"
                style={{ color: "var(--text-color)" }}
              >
                Sort by:
              </span>
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSort(option)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    selectedSort.id === option.id
                      ? "text-white shadow-md"
                      : "hover:scale-105"
                  }`}
                  style={{
                    background:
                      selectedSort.id === option.id
                        ? "var(--accent-gradient)"
                        : "var(--wrapper)",
                    color:
                      selectedSort.id === option.id
                        ? "white"
                        : "var(--text-color)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected genre header */}
          <div className="mb-6">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {selectedGenre.label === "All Genres"
                ? `${selectedSort.label} Games`
                : `${selectedSort.label} ${selectedGenre.label} Games`}
            </h2>
          </div>

          {/* Games grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <span className="text-xl" style={{ color: "var(--text-color)" }}>
                Loading top games...
              </span>
            </div>
          ) : topGamesData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <span className="text-xl" style={{ color: "var(--text-color)" }}>
                No games found for this selection
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topGamesData.map((game) => (
                <div
                  key={game.id}
                  className="card-global p-3 transition-transform hover:scale-105 hover:shadow-xl group"
                >
                  <Link
                    to={`/game?game_id=${game.id}`}
                    className="block h-full flex flex-col"
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                      {getCoverUrl(game) ? (
                        <img
                          src={getCoverUrl(game)}
                          alt={game.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm p-2 text-center bg-gray-800 text-gray-400">
                          {game.name}
                        </div>
                      )}
                      {game.rating && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold text-white shadow-md bg-black/70 backdrop-blur-sm">
                          {Math.round(game.rating)}%
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex-grow flex items-center justify-center text-center">
                      <p
                        className="text-sm font-bold line-clamp-2"
                        style={{ color: "var(--text-color)" }}
                      >
                        {game.name}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TopGames;
