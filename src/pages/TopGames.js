import React, { useState, useEffect } from "react";
import Select from "react-select";
import NavBar from "../components/NavBar";
import { Link } from 'react-router-dom';
import TitleCard from "../components/TitleCard"; 


const genreMapping = {
  4: "fighting",
  5: "shooter",
  7: "music",
  8: "platform",
  9: "puzzle",
  10: "racing",
  11: "real-time-strategy",
  12: "role-playing",
  13: "simulator",
  14: "sport",
  15: "strategy",
  16: "turn-based-strategy",
  24: "tactical",
  26: "quiz-trivia",
  25: "hack-and-slash-beat-em-up",
  30: "pinball",
  31: "adventure",
  33: "arcade",
  34: "visual-novel",
  32: "indie",
  35: "card-board-game",
  36: "moba",
  2: "point-and-click",
};

const genreOptions = [
  { value: "select", label: "Select Genre" },
  ...Object.entries(genreMapping).map(([value, label]) => ({ value, label })),
];

const initialGenre = genreOptions[0];
function TopGames() {
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [topGamesData, setTopGamesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";
        const conditions = "rating > 70 & total_rating_count > 25 & category = (0,8,9)";

        const requestBody = `
          fields name, aggregated_rating, genres.name, cover.url;
          where ${conditions};
          sort rating desc;
          limit 500;
        `;
    
        const ob = {
          igdbquery: requestBody,
      };
      const functionUrl = "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

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
        // const response = await fetch(apiUrl, {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        //     Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo",
        //   },
        //   body: requestBody,
        // });
    
        // if (!response.ok) {
        //   throw new Error(`Error: ${response.status}, ${response.statusText}`);
        // }
    
        // const responseData = await response.json();
    
        // Filter games based on the selected genre
        const filteredGames = selectedGenre && selectedGenre.value !== "select"
          ? igdbResponse.filter(game => game.genres && game.genres.some(g => g.name.toLowerCase() === selectedGenre.label.toLowerCase()))
          : igdbResponse.slice(0, 10); // Display the top 10 if no genre is selected
    
        // Process the response data
        setTopGamesData(filteredGames);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, [selectedGenre]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-500">
      <NavBar />
      <div className="top-games bg-white dark:bg-gray-500">
        <h2 className="bg-white dark:bg-gray-500 text-black dark:text-white">Top Games</h2>
        <div className="select-container">
          <Select
            className="select-genre"
            options={genreOptions}
            value={selectedGenre}
            onChange={(selectedOption) => setSelectedGenre(selectedOption)}
            placeholder="Select a genre" />
        </div>
        <div className="title-cards-container">
        {topGamesData.map((game) => (
    <div key={game.id} className="title-card-box">
      <Link to={`/game?game_id=${game.id}`}>
      <TitleCard gameData={game} />
</Link> 
      <div className="title-card-info">
        <span className="title-card-title">{game.name}</span>
      </div>
    </div>
  ))}
        </div>
      </div>
    </div>
  );
}

export default TopGames;
