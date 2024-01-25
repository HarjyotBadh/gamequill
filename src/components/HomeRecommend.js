import React, { useState, useEffect } from "react";
import "../styles/HomeRecommend.css";
import UserRecommend from "./UserRecommend";
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

function App() {
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);

  const genreMapping = {
    "Point-and-Click": 2,
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
    "Turn-based Strategy (TBS)": 16,
    Tactical: 24,
    "Quiz/Trivia": 26,
    "Hack and Slash/Beat 'em Up": 25,
    Pinball: 30,
    Adventure: 31,
    Arcade: 33,
    "Visual Novel": 34,
    Indie: 32,
    "Card & Board Game": 35,
    MOBA: 36,
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        getGenres(theuserId);
      } else {
        // not logged in
      }
    });

    const getGenres = async (userId) => {
      try {
        // const apiUrl = "http://localhost:8080/https://api.igdb.com/v4/games";
        const apiUrl = "https://api.igdb.com/v4/games";
        const docRef = doc(db, "profileData", userId);
        const docSnapshot = await getDoc(docRef);
        const genres = docSnapshot.data().favoriteGenres;

        setFavoriteGenres(genres);

        const genrePromises = genres.map(async (genre) => {
          if (genre !== "") {
            const genreNumber = genreMapping[genre];
            const ob = {
              igdbquery: `fields name, genres, cover.url, id; where rating>70 & total_rating_count>5 & category = (0,8,9) & genres = (${genreNumber}); sort rating desc; limit:100;`,
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
            //   body: `fields name, genres, cover.url, id; where rating>70 & total_rating_count>5 & category = (0,8,9) & genres = (${genreNumber}); sort rating desc; limit:100;`,
            // });

            // const data = await response.json();
            // return data;
            return igdbResponse;
          }
        });

        const genreResults = await Promise.all(genrePromises);

        const randomGenreRecommendations = genreResults.map((genreData) => {
          let genreRandom = genreData.sort(() => Math.random() - 0.5);
          genreRandom = genreData.slice(0, 3);
          return genreRandom;
        });

        setGenreRecommendations(randomGenreRecommendations);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  const formatCoverUrl = (url) => {
    return url ? url.replace("/t_thumb/", "/t_cover_big/") : "";
  };

  return (
    <div className="recommend-container">
      <h1 className="trending-head">BASED ON YOUR FAVORITE GENRES</h1>
      <div className="recommend-grid">
        {genreRecommendations.map((genreData, index) => (
          <div key={index}>
            <UserRecommend
              genre={favoriteGenres[index]}
              c1={formatCoverUrl(genreData[0]?.cover?.url)}
              c2={formatCoverUrl(genreData[1]?.cover?.url)}
              c3={formatCoverUrl(genreData[2]?.cover?.url)}
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
