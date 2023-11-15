import React, { useState, useEffect } from "react";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import { Link } from "react-router-dom";
import "../styles/ListPreview.css";
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
      <div className="list-preview">
        <h3>{list.name}</h3>
        <div className="game-images">
          {games.slice(0, 3).map((game, index) => (
            <div key={index} className="game-image-container">
              <img
                src={game.coverUrl}
                alt={game.game.name}
                className="game-image"
              />
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ListPreview;
