import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import TitleCard from "../components/TitleCard";
import "../styles/LikesPage.css";

const Likes = () => {
    const [likedItems, setLikedItems] = useState([]);
    const [gameDataArray, setGameDataArray] = useState([]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const user = auth.currentUser.uid;
                const docRef = doc(db, "profileData", user);
                const docSnap = await getDoc(docRef);
                const docLikes = docSnap.data().likes || [];
                setLikedItems(docLikes);
            } catch (error) {
                console.error(
                    "Error fetching likes data from Firestore:",
                    error
                );
            }
        };

        const fetchGameDatas = async () => {
            // Assuming playedItems is an array of game IDs that you want to fetch data for
            if (likedItems.length > 0) {
                try {
                    const gameDataArray = await fetchMultipleGameData(likedItems);
        
                    setGameDataArray(gameDataArray);
                } catch (error) {
                    console.error('Failed to fetch game data:', error);
                    // Handle the error appropriately
                }
            } else {
                // If there are no played items, set an empty array or handle accordingly
                setGameDataArray([]);
            }
        };

        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                fetchLikes().then(() => {
                    fetchGameDatas();
                });
            }
        });

        // Cleanup
        return () => {
            unsub();
        };
    }, [likedItems]);

    // Print the game data array whenever it changes
    useEffect(() => {
        console.log("All fetched game data:", gameDataArray);
    }, [gameDataArray]);

    return (
        <div>
            <NavBar />
            <div className="likes-container">
                <h1 className="likes-title">My Liked Games</h1>
                <div className="likes">
                    {gameDataArray.map((gameData) => (
                        <TitleCard key={gameData.id} gameData={gameData.game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Likes;
