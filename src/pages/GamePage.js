import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import MediaPlayer from "../components/MediaPlayer";
import DescriptionBox from "../components/DescriptionBox";
import ReviewBar from "../components/ReviewBar";
import ReviewSnapshot from "../components/ReviewSnapshot";
import "../styles/GamePage.css";

export const fetchGameDataFromIGDB = async (game_id) => {
    const corsAnywhereUrl = "http://localhost:8080/";
    const apiUrl = "https://api.igdb.com/v4/games";

    try {
        const response = await fetch(corsAnywhereUrl + apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
                Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
            },
            body: `
                fields name,cover.url,involved_companies.company.name,rating,aggregated_rating,screenshots.url,videos.video_id,genres.name,summary,storyline,platforms.name,age_ratings.*,age_ratings.content_descriptions.*;
                where id = ${game_id};
            `,
        });

        const data = await response.json();

        if (data.length) {
            const game = data[0];

            const screenshotUrls = game.screenshots
                ? game.screenshots.map((s) =>
                        s.url.replace("t_thumb", "t_1080p")
                    )
                : [];

            const videoIds = game.videos ? game.videos.map((v) => v.video_id) : [];

            return { game, screenshotUrls, videoIds };
        }

        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default function GamePage({ game_id }) {
    const [gameData, setGameData] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [videos, setVideos] = useState([]);
    const [searchParams] = useSearchParams();
    const [userHasReview, setUserHasReview] = useState(false);
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

    // Fetch game data from IGDB API
    useEffect(() => {
        (async () => {
            const getGameData = async (game_id) => {
                // Get the game document from Firebase
                const gameRef = doc(db, "games", game_id);
                const docSnap = await getDoc(gameRef);
                if (docSnap.exists()) {
                    // Return the game data
                    return docSnap.data();
                } else {
                    // Create a new document for the game
                    await setDoc(doc(db, "games", game_id), {
                    });
                }
            };

            // Get the game data from Firebase
            await getGameData(game_id);

            const gameDataFromIGDB = await fetchGameDataFromIGDB(game_id);

            if (gameDataFromIGDB) {
                setGameData(gameDataFromIGDB.game);
                setScreenshots(gameDataFromIGDB.screenshotUrls);
                setVideos(gameDataFromIGDB.videoIds);
            }
        })();
    }, [game_id]);

    return (
        <div className={`game-page-wrapper ${darkMode ? "dark" : "light"}`} data-theme={darkMode ? "dark" : "light"}>
            <NavBar />
    
            {gameData ? (
                <div className="game-content-container">
                    <div className="left-content">
                        <TitleCard gameData={gameData} />
                        <MediaPlayer screenshots={screenshots} youtubeLinks={videos} />
                    </div>
    
                    <div className="right-content">
                        <DescriptionBox gameData={gameData} />
                        <ReviewBar gameID={parseInt(game_id, 10)} userHasReview={userHasReview} gameData={gameData} />
                        <ReviewSnapshot game_id={parseInt(game_id, 10)}/>
                    </div>
    
                </div>
            ) : (
                <div className="loading-container">Loading...</div>
            )}
    
            <NavBar />
        </div>
    );
    
}
