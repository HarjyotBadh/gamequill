import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    query,
    collection,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import MediaPlayer from "../components/MediaPlayer";
import DescriptionBox from "../components/DescriptionBox";
import ReviewBar from "../components/ReviewBar";
import ReviewSnapshot from "../components/ReviewSnapshot";
import { fetchGameData } from "../functions/GameFunctions";
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
    game_id = searchParams.get("game_id");

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const reviewsQuery = query(
                    collection(db, "reviews"),
                    where("gameID", "==", parseInt(game_id, 10)),
                    where("uid", "==", user.uid)
                );
                const reviewsSnapshot = await getDocs(reviewsQuery);
                setUserHasReview(!reviewsSnapshot.empty);
            } else {
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
        (async () => {
            const gameData = await fetchGameData(game_id);
    
            if (gameData) {
                setGameData(gameData.game);
                setScreenshots(gameData.screenshotUrls);
                setVideos(gameData.videoIds);
            } else {
                window.location.href = "/home";
            }
        })();
    }, [game_id]);
    

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
                        />

                        <ReviewSnapshot
                            game_id={parseInt(game_id, 10)}
                            showFriendReviews={showFriendReviews}
                            showSpoilers={showSpoilers}
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
