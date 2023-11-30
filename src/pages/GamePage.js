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
    const [priceUpdated, setPriceUpdated] = useState(false);
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

    useEffect(() => {
      const fetchGameDataAndUpdatePrice = async () => {
          const fetchedGameData = await fetchGameData(game_id);
  
          if (fetchedGameData && fetchedGameData.game) {
              let shouldUpdatePrice = false;
              const now = new Date();
  
              if (fetchedGameData.game.last_price_update) {
                  const lastUpdate = new Date(fetchedGameData.game.last_price_update?.seconds * 1000);
                  const oneDay = 24 * 60 * 60 * 1000;
  
                  if (now - lastUpdate >= oneDay) {
                      shouldUpdatePrice = true;
                  }
              } else {
                  shouldUpdatePrice = true;
              }
  
              if (shouldUpdatePrice && !priceUpdateCalled.current) {
                  console.log("Game Price Not Updated Today. Updating now...");
                  priceUpdateCalled.current = true;
                  try {
                      await updateGamePrice(game_id);
                      setPriceUpdated(true); // Update state to indicate price updated
                  } catch (error) {
                      console.error("Error updating price:", error);
                  }
              } else {
                  console.log("Game price already updated today");
              }
  
              setGameData(fetchedGameData.game);
              setScreenshots(fetchedGameData.screenshotUrls);
              setVideos(fetchedGameData.videoIds);
          } else {
              window.location.href = "/home";
          }
      };
  
      fetchGameDataAndUpdatePrice();
  }, [game_id, currentUserId]);
  
  // Second useEffect for fetching updated game data after price update
  useEffect(() => {
      if (priceUpdated) {
          const fetchUpdatedGameData = async () => {
              const fetchedGameData = await fetchGameData(game_id);
              if (fetchedGameData && fetchedGameData.game) {
                  setGameData(fetchedGameData.game);
                  // Update other state variables if necessary
                  setScreenshots(fetchedGameData.screenshotUrls);
                  setVideos(fetchedGameData.videoIds);
              }
  
              setPriceUpdated(false); // Reset price updated state
          };
  
          fetchUpdatedGameData();
      }
  }, [priceUpdated, game_id]);

    return (
        <div
            className={`game-page-wrapper`}
        >
            <NavBar />

            {gameData ? (
                <div className="game-content-container">
                    <div className="left-content">
                        <TitleCard gameData={gameData} />
                        <MediaPlayer
                            screenshots={screenshots}
                            youtubeLinks={videos}
                        />
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
