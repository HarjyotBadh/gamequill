import React, { useState, useEffect } from "react";
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
import { fetchGameData } from "../functions/GameFunctions";
import Footer from "../components/Footer";
import "../styles/GamePage.css";
import HelloWorld from "../components/HelloWorld";

export default function GamePage({ game_id }) {
    const [gameData, setGameData] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [videos, setVideos] = useState([]);
    const [searchParams] = useSearchParams();
    const [userHasReview, setUserHasReview] = useState(false);
    const [showFriendReviews, setShowFriendReviews] = useState(false);
    const [showSpoilers, setShowSpoilers] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
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
        const storedGameData = JSON.parse(
            localStorage.getItem(`gameData_${game_id}`)
        );

        if (storedGameData &&
            storedGameData.game &&
            storedGameData.game.name) {
            console.log("Loading gameData from localStorage");
            setGameData(storedGameData.game);
            setScreenshots(storedGameData.screenshotUrls);
            setVideos(storedGameData.videoIds);
        } else {
            (async () => {
                console.log("Calling fetchGameData in GamePage.js");
                const fetchedGameData = await fetchGameData(game_id);

                if (fetchedGameData) {
                    setGameData(fetchedGameData.game);
                    setScreenshots(fetchedGameData.screenshotUrls);
                    setVideos(fetchedGameData.videoIds);

                    // Store the fetched data in localStorage
                    localStorage.setItem(
                        `gameData_${game_id}`,
                        JSON.stringify(fetchedGameData)
                    );
                } else {
                    window.location.href = "/home";
                }
            })();
        }
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
                        <div className="game-title"><HelloWorld game_id={game_id}/></div>
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
