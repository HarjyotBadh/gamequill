import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import MediaPlayer from "../components/MediaPlayer";
import DescriptionBox from "../components/DescriptionBox";
import ReviewBar from "../components/ReviewBar";
import ReviewSnapshot from "../components/ReviewSnapshot";
import { fetchGameData, updateGamePrice } from "../functions/GameFunctions";
import Footer from "../components/Footer";
import "../styles/GamePage.css";

export default function GamePage({ game_id }) {
  const [gameData, setGameData] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [videos, setVideos] = useState([]);
  const [searchParams] = useSearchParams();
  const [userHasReview, setUserHasReview] = useState(false);
  const [showFriendReviews, setShowFriendReviews] = useState(false);
  const [showSpoilers, setShowSpoilers] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const priceUpdateCalled = useRef(false);
  game_id = searchParams.get("game_id");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, now safe to access user.uid
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("gameID", "==", parseInt(game_id, 10)),
          where("uid", "==", user.uid)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setCurrentUserId(user.uid);
        setUserHasReview(!reviewsSnapshot.empty);
      } else {
        // Redirect to login if there is no user
        window.location.href = "/login";
      }
    });
  }, [game_id]);

  // Sets dark mode based on user's system preferences
  const [darkMode, setDarkMode] = React.useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sets dark mode based on user's system preferences
  React.useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDarkMode(e.matches);

    matcher.addListener(onChange);

    return () => {
      matcher.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    // Function to fetch game data and potentially update game price
    const fetchGameDataAndUpdatePrice = async () => {
        console.log("Fetching game data from Firestore");
        const fetchedGameData = await fetchGameData(game_id);

        if (fetchedGameData && fetchedGameData.game) {
            let shouldUpdatePrice = false;
            const now = new Date();

            if (fetchedGameData.game.last_price_update) {
                const lastUpdate = new Date(fetchedGameData.game.last_price_update);
                const oneDay = 24 * 60 * 60 * 1000;

                if (now - lastUpdate >= oneDay) {
                    // Last price update is more than a day old
                    shouldUpdatePrice = true;
                }
            } else {
                // No last price update available
                shouldUpdatePrice = true;
            }

            if (shouldUpdatePrice && !priceUpdateCalled.current) {
                console.log("Updating game price");
                priceUpdateCalled.current = true;
                updateGamePrice(game_id);
            } else {
                console.log("Game price already updated today");
            }

            // Set game data in component state
            setGameData(fetchedGameData.game);
            setScreenshots(fetchedGameData.screenshotUrls);
            setVideos(fetchedGameData.videoIds);
        } else {
            window.location.href = "/home";
        }
    };

    fetchGameDataAndUpdatePrice();
}, [game_id, currentUserId]);




  return (
    <div
      className={`game-page-wrapper ${darkMode ? "dark" : "light"}`}
      data-theme={darkMode ? "dark" : "light"}
    >
      <NavBar />

      {gameData ? (
        <div className="game-content-container">
          <div className="left-content">
            <TitleCard gameData={gameData} />
            <MediaPlayer screenshots={screenshots} youtubeLinks={videos} />
          </div>

          <div className="right-content">
            <DescriptionBox gameData={gameData} />
            <ReviewBar
              gameID={parseInt(game_id, 10)}
              userHasReview={userHasReview}
              gameData={gameData}
              showFriendReviews={showFriendReviews}
              setShowFriendReviews={setShowFriendReviews}
              showSpoilers={showSpoilers}
              setShowSpoilers={setShowSpoilers}
              currentUserId={currentUserId}
            />

            <ReviewSnapshot
              game_id={parseInt(game_id, 10)}
              showFriendReviews={showFriendReviews}
              showSpoilers={showSpoilers}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      ) : (
        <div className="loading-container">Loading...</div>
      )}

      <Footer />
    </div>
  );
}
