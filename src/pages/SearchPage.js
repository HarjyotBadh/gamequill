import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import { Link } from "react-router-dom";
import "../styles/SearchPage.css";
import GameColumn from "../components/GamesColumn";
import UserColumn from "../components/UserColumn";

const SearchPage = ({ searchQuery }) => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const searchGames = async () => {
      try {
        const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";

        const response = await fetch(corsAnywhereUrl + apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
            Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
          },
          body: `search "${searchQuery}";fields name, cover.url, aggregated_rating, involved_companies.company.name; limit:50; where category = (0,8,9);`,
        });

        const data = await response.json();
        if (data.length) {
          const gamesData = data.map((game) => ({
            id: game.id,
            gameData: game,
          }));
          setGames(gamesData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (searchQuery) {
      searchGames();
    }
  }, [searchQuery]);

  return (
    <div className="bg-white dark:bg-gray-500 h-screen">
      <NavBar />
      <div className="searchContainer bg-white dark:bg-gray-500">
        <div className="resultsContainer bg-white dark:bg-gray-500">
          <GameColumn games={games} />
          <UserColumn users={users} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
