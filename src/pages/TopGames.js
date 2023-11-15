import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import TitleCard from "../components/TitleCard";
import NavBar from "../components/NavBar";
import Select from "react-select";
import "../styles/TopGames.css";

const genreMapping = {
  4: 'fighting',
  5: 'shooter',
  7: 'music',
  8: 'platform',
  9: 'puzzle',
  10: 'racing',
  11: 'real-time-strategy',
  12: 'role-playing',
  13: 'simulator',
  14: 'sport',
  15: 'strategy',
  16: 'turn-based-strategy',
  24: 'tactical',
  26: 'quiz-trivia',
  25: 'hack-and-slash-beat-em-up',
  30: 'pinball',
  31: 'adventure',
  33: 'arcade',
  34: 'visual-novel',
  32: 'indie',
  35: 'card-board-game',
  36: 'moba',
  2: 'point-and-click',
};

const genreOptions = [
  { value: "select", label: "Select Genre" },
  ...Object.entries(genreMapping).map(([value, label]) => ({ value, label })),
];
function TopGames() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [topGamesData, setTopGamesData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesRef = collection(db, "games");
        console.log(selectedGenre.value);
        // Create a query to order games by aggregated_rating in descending order and limit to top 20 games
        
        let q ="";
        // Add a condition to filter by selected genre
        if (selectedGenre && selectedGenre.value !== "select") {
          q = query(gamesRef, orderBy("aggregated_rating", "desc"), where("genre", "array-contains", selectedGenre.label), limit(20));
        } else {
          q = query(gamesRef, orderBy("aggregated_rating", "desc"), limit(21));
        }

        const querySnapshot = await getDocs(q);
        const gamesData = [];
        querySnapshot.forEach((doc) => {
          const game = doc.data();
          gamesData.push(game);
        });

        setTopGamesData(gamesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedGenre]);

  return (
    <div>
      <NavBar />
      <div className="top-games">
        <h2>Top Games</h2>
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
      <TitleCard gameData={game} />
      <div className="title-card-info">
        <span className="title-card-title">{game.name}</span>
        <span className="title-card-rating">
          {game.aggregated_rating ? game.aggregated_rating.toFixed(2) : 'N/A'}
        </span>
      </div>
    </div>
  ))}
        </div>
      </div>
    </div>
  );
}

export default TopGames;
