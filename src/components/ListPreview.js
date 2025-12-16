import React, { useState, useEffect } from "react";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import { Link } from "react-router-dom";
const ListPreview = ({ list }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const gameData = await fetchMultipleGameData(list.games);
        const modifiedGameData = gameData.map((game) => ({
          ...game,
          coverUrl: game.game.cover
            ? game.game.cover.url.replace("/t_thumb/", "/t_cover_big/")
            : null,
        }));
        setGames(modifiedGameData);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGamesData();
  }, [list.games]);

  return (
    <Link to={`/list/${list.id}`}>
      <div className="card-global p-4 transition-transform hover:scale-105 h-full flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-3 text-gradient hover:opacity-80 transition-opacity">
          {list.name}
        </h3>
        <div className="flex gap-2 justify-center w-full">
          {games.slice(0, 3).map((game, index) => (
            <div
              key={index}
              className="w-1/3 aspect-[3/4] rounded-md overflow-hidden shadow-sm relative"
            >
              <img
                src={game.coverUrl}
                alt={game.game.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Fill empty slots if less than 3 games to maintain layout */}
          {[...Array(Math.max(0, 3 - games.length))].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-1/3 aspect-[3/4] rounded-md bg-black/10 dark:bg-white/5 border border-[var(--glass-border)]"
            ></div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ListPreview;
