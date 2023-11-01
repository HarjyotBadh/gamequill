import React, { useState, useEffect } from "react";
import "../styles/HomeRecommend.css";
import UserRecommend from "./UserRecommend";
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

function App() {
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [userId, setUserId] = useState("");
  //   const userIdd = auth.currentUser.uid;
  //   console.log(userIdd);

  const genreMapping = {
    fighting: 4,
    shooter: 5,
    music: 7,
    platform: 8,
    puzzle: 9,
    racing: 10,
    "real-time-strategy": 11,
    "role-playing": 12,
    simulator: 13,
    sport: 14,
    strategy: 15,
    "turn-based-strategy": 16,
    tactical: 24,
    "quiz-trivia": 26,
    "hack-and-slash-beat-em-up": 25,
    pinball: 30,
    adventure: 31,
    arcade: 33,
    "visual-novel": 34,
    indie: 32,
    "card-board-game": 35,
    moba: 36,
    "point-and-click": 2,
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        setUserId(theuserId);
        console.log(theuserId);
        getGenres(theuserId);
      } else {
        // not logged in
      }
    });

    const getGenres = async (userId) => {
      try {
        const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";
        const docRef = doc(db, "profileData", userId);
        const docSnapshot = await getDoc(docRef);
        const genres = docSnapshot.data().favoriteGenres;
        if (genres != null) {
          setFavoriteGenres(genres);

          const genrePromises = genres.map(async (genre) => {
            const genreNumber = genreMapping[genre];
            const response = await fetch(corsAnywhereUrl + apiUrl, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
                Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
              },
              body: `fields name, genres, cover.url, id; where rating>70 & total_rating_count>5 & category = (0,8,9) & genres = (${genreNumber}); sort rating desc; limit:12;`,
            });

            const data = await response.json();
            return data;
          });

          const genreResults = await Promise.all(genrePromises);
          const randomGenreRecommendations = genreResults.map((genreData) => {
            const randomGames = [];
            while (randomGames.length < 3) {
              const randomIndex = Math.floor(Math.random() * genreData.length);
              const randomGame = genreData[randomIndex];
              if (!randomGames.includes(randomGame)) {
                randomGames.push(randomGame);
              }
            }
            return randomGames;
          });

          setGenreRecommendations(randomGenreRecommendations);
        }

        //setGenreRecommendations(genreResults);
      } catch (error) {
        console.error(error);
      }
    };
    //getGenres();
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
