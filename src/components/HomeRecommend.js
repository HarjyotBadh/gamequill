import React, { useState, useEffect } from "react";
import "../styles/HomeRecommend.css";
import UserRecommend from "./UserRecommend";
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

function App() {
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [loading, setLoading] = useState(true);

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
    let isMounted = true;

    const getGenres = async (userId) => {
      try {
        const docRef = doc(db, "profileData", userId);
        const docSnapshot = await getDoc(docRef);
        const data = docSnapshot.data();

        if (!data || !data.favoriteGenres) {
          console.log("No favorite genres found for user");
          if (isMounted) setLoading(false);
          return;
        }

        const genres = data.favoriteGenres.filter((g) => g && g !== "");

        if (genres.length === 0) {
          console.log("User has no valid favorite genres");
          if (isMounted) setLoading(false);
          return;
        }

        if (isMounted) setFavoriteGenres(genres);

        const genrePromises = genres.map(async (genre) => {
          const genreNumber = genreMapping[genre];
          if (!genreNumber) {
            console.log(`Unknown genre: ${genre}`);
            return [];
          }

          const ob = {
            igdbquery: `fields name, genres, cover.url, id; where rating>75 & total_rating_count>50 & game_type = (0,8,9) & genres = (${genreNumber}); sort total_rating_count desc; limit:100;`,
          };
          const functionUrl =
            "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

          try {
            const response = await fetch(functionUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(ob),
            });
            const data = await response.json();
            return data.data || [];
          } catch (err) {
            console.error(`Error fetching games for genre ${genre}:`, err);
            return [];
          }
        });

        const genreResults = await Promise.all(genrePromises);

        const randomGenreRecommendations = genreResults.map((genreData) => {
          if (!genreData || genreData.length === 0) return [];
          let genreRandom = [...genreData].sort(() => Math.random() - 0.5);
          return genreRandom.slice(0, 3);
        });

        if (isMounted) {
          setGenreRecommendations(randomGenreRecommendations);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching genre recommendations:", error);
        if (isMounted) setLoading(false);
      }
    };

    const currentUser = auth.currentUser;
    if (currentUser) {
      getGenres(currentUser.uid);
    } else {
      const unsub = auth.onAuthStateChanged((authObj) => {
        if (authObj && isMounted) {
          getGenres(authObj.uid);
        }
        unsub();
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCoverUrl = (url) => {
    return url ? url.replace("/t_thumb/", "/t_cover_big/") : "";
  };

  if (loading) {
    return (
      <div className="recommend-container">
        <h1 className="trending-head">BASED ON YOUR FAVORITE GENRES</h1>
        <div className="recommend-grid">
          <div style={{ padding: "20px", color: "var(--text-color)" }}>
            Loading recommendations...
          </div>
        </div>
      </div>
    );
  }

  if (favoriteGenres.length === 0) {
    return null;
  }

  return (
    <div className="recommend-container">
      <h1 className="trending-head text-gradient">
        BASED ON YOUR FAVORITE GENRES
      </h1>
      <div className="recommend-grid">
        {genreRecommendations.map((genreData, index) => (
          <div key={favoriteGenres[index] || index}>
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
