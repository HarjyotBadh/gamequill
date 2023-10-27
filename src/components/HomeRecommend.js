import React, { useState, useEffect } from "react";
import "../styles/HomeRecommend.css";
import UserRecommend from "./UserRecommend";
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

function App() {
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]); // Added this line
  //   const userIdd = auth.currentUser.uid;
  //   console.log(userIdd);

  const genreMapping = {
    "Point-and-click": 2,
    Fighting: 4,
    Shooter: 5,
    Music: 7,
    Platform: 8,
    Puzzle: 9,
    Racing: 10,
    "Real Time Strategy (RTS)": 11,
    "Role-playing (RPG)": 12,
    Simulator: 13,
    Sport: 14,
    Strategy: 15,
    "Turn-based strategy (TBS)": 16,
    Tactical: 24,
    "Quiz/Trivia": 26,
    "Hack and slash/Beat 'em up": 30,
    Pinball: 32,
    Adventure: 31,
    Arcade: 33,
    "Visual Novel": 34,
    Indie: 36,
    "Card & Board Game": 37,
    MOBA: 38,
  };

  useEffect(() => {
    //const userId = uid ? uid : auth.currentUser.uid;
    const userId = "maW6ftAOrUVgWpWtFL0cKkAx3Fn1";
    const getGenres = async () => {
      try {
        const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";
        const docRef = doc(db, "profileData", userId);
        const docSnapshot = await getDoc(docRef);
        const genres = docSnapshot.data().favoriteGenres; // Updated this line
        setFavoriteGenres(genres); // Added this line

        const genrePromises = genres.map(async (genre) => {
          const genreNumber = genreMapping[genre];
          const response = await fetch(corsAnywhereUrl + apiUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
              Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
            },
            body: `fields name, genres, cover.url, id; where rating>80; where genres = ${genreNumber}; where follows>5; limit:3`,
          });

          const data = await response.json();
          return data;
        });

        const genreResults = await Promise.all(genrePromises);

        setGenreRecommendations(genreResults);
      } catch (error) {
        console.error(error);
      }
    };
    getGenres();
  }, []);

  return (
    <div className="recommend-container">
      <h1 className="trending-head">BASED ON YOUR FAVORITE GENRES</h1>
      <div className="recommend-grid">
        {genreRecommendations.map((genreData, index) => (
          <div key={index}>
            <UserRecommend
              genre={favoriteGenres[index]} // Assuming you have a way to get the genre name
              c1={genreData[0]?.cover?.url || ""}
              c2={genreData[1]?.cover?.url || ""}
              c3={genreData[2]?.cover?.url || ""}
              i1={genreData[0]?.id || ""}
              i2={genreData[1]?.id || ""}
              i3={genreData[2]?.id || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
