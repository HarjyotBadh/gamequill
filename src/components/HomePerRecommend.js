import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Featured2 from "./Featured2";
import {
    fetchMultipleGameData,
    fetchSimilarGames,
} from "../functions/GameFunctions"; // Assuming you'll create a fetchSimilarGames function
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/HomePerRecommend.css";

function HomePerRecommend() {
    const [gamesData, setGamesData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Abstracted data fetching logic
    const fetchUserDataAndRecommendations = async (userId) => {
        try {
            // Fetch user data from Firestore
            const docRef = doc(db, "profileData", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const game_ids = [...userData.likes, ...userData.plays];

                // Fetch genres and themes of liked and played games
                const userGamesData = await fetchMultipleGameData(game_ids);
                const genres = [
                    ...new Set(
                        userGamesData.flatMap((g) => g.game.genres || [])
                    ),
                ];
                const themes = [
                    ...new Set(
                        userGamesData.flatMap((g) => g.game.themes || [])
                    ),
                ];

                // Fetch similar games based on those genres and themes
                const recommendedGames = await fetchSimilarGames(
                    genres,
                    themes
                );
                const randomizedRecommended = recommendedGames
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 8);
                setGamesData(randomizedRecommended);
            } else {
                console.error("No such user document!");
            }
        } catch (error) {
            console.error("Error fetching user data and games:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Immediately invoke the function if the user is already logged in
        const currentUser = auth.currentUser;
        if (currentUser) {
            fetchUserDataAndRecommendations(currentUser.uid);
        }

        // Set up the listener for future auth state changes
        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                fetchUserDataAndRecommendations(authObj.uid);
            }
        });

        return () => {
            unsub();
        };
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="home-recommend-container mx-auto px-4 py-6">
            <h1 className="home-trending-head text-3xl font-semibold mb-6 text-black dark:text-white">
                RECOMMENDED FOR YOU
            </h1>
            <div className="home-recommend-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gamesData.map((gameData, index) => (
                    <Link
                        key={index}
                        to={`/game?game_id=${gameData.id}`}
                        className="rounded overflow-hidden"
                    >
                        <Featured2
                            gameData={gameData}
                            screenshots={gameData.screenshotUrls}
                            limitSize={true}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HomePerRecommend;
