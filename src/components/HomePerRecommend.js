import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Featured2 from "./Featured2";
import { fetchMultipleGameData, fetchSimilarGames } from "../functions/GameFunctions"; // Assuming you'll create a fetchSimilarGames function
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/HomePerRecommend.css";

function HomePerRecommend() {
    const [gamesData, setGamesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (authObj) => {
            if (authObj) {
                const theuserId = authObj.uid;
    
                try {
                    // Fetch user data from Firestore
                    const docRef = doc(db, "profileData", theuserId);
                    const docSnap = await getDoc(docRef);
    
                    if (docSnap.exists()) {
                        console.log("ONE");
                        const userData = docSnap.data();
                        const game_ids = [...userData.likes, ...userData.plays];
                        console.log("TWO");

                        // Fetch genres and themes of liked and played games
                        const userGamesData = await fetchMultipleGameData(game_ids);
                        console.log("THREE");
                        const genres = [...new Set(userGamesData.flatMap(g => g.game.genres || []))];
                        const themes = [...new Set(userGamesData.flatMap(g => g.game.themes || []))];
                        console.log("FOUR");
                        
                        // Fetch similar games based on those genres and themes
                        console.log("FIVE");
                        const recommendedGames = await fetchSimilarGames(genres, themes);
                        console.log("SIX");
                        setGamesData(recommendedGames);
                        console.log("Recommended Games: " + recommendedGames);
                        console.log("Screenshots: " + recommendedGames[0].screenshotUrls);
                        setLoading(false);
                    } else {
                        console.log("No such user document!");
                    }
                    
                } catch (error) {
                    console.error("Error fetching user data and games:", error);
                }
            } else {
                console.log("User not logged in");
            }
        });
    
        return () => {
            unsub();
        };
    }, []);
    

    if (loading) return <div>Loading...</div>;

    return (
        <div className="home-recommend-container mx-auto px-4 py-6">
            <h1 className="home-trending-head text-3xl font-semibold mb-6">RECOMMENDED FOR YOU</h1>
            <div className="home-recommend-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gamesData.map((gameData, index) => (
                    <Link key={index} to={`/game?game_id=${gameData.id}`} className="rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Featured2
                            gameData={gameData}
                            screenshots={gameData.screenshotUrls}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HomePerRecommend;
