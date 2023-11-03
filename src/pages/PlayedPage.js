import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import TitleCard from "../components/TitleCard";
import "../styles/PlayedPage.css";

const PlayedPage = () => {
    const [playedItems, setPlayedItems] = useState([]);
    const [gameDataArray, setGameDataArray] = useState([]);

    useEffect(() => {
        const fetchPlays = async () => {
            try {
                const user = auth.currentUser.uid;
                const docRef = doc(db, "profileData", user);
                const docSnap = await getDoc(docRef);
                const docPlays = docSnap.data().plays || [];
                setPlayedItems(docPlays);
                console.log("docPlays:", docPlays);
            } catch (error) {
                console.error(
                    "Error fetching plays data from Firestore:",
                    error
                );
            }
        };

        const fetchGameDatas = async () => {
            // Assuming playedItems is an array of game IDs that you want to fetch data for
            if (playedItems.length > 0) {
                try {
                    // Fetch the game data for all the IDs in playedItems
                    const gameDataArray = await fetchMultipleGameData(playedItems);
        
                    // After fetching, you can directly set the game data array
                    // with the fetched data if needed
                    // Make sure to access the correct property if gameDataArray contains objects with a 'game' property
                    // const updatedGameData = gameDataArray.map(data => data.game);
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
                fetchPlays().then(() => {
                    fetchGameDatas();
                    // print out the gameDataArray
                    console.log("gameDataArray:", gameDataArray);
                });
            }
        });

        // Cleanup
        return () => {
            unsub();
        };
    }, [playedItems]);

    return (
        <div>
            <NavBar />
            <div className="plays-container">
                <h1 className="plays-title">My Played Games</h1>
                <div className="plays">
                    {gameDataArray.map((gameData) => (
                        <TitleCard key={gameData.id} gameData={gameData.game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayedPage;
