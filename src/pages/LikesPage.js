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
            const storedGamesArray = [];
            const idsToFetch = [];

            for (const gameID of likedItems) {
                let storedGameData = JSON.parse(
                    localStorage.getItem(`gameData_${gameID}`)
                );

                if (
                    storedGameData &&
                    storedGameData.game &&
                    storedGameData.game.name
                ) {
                    storedGamesArray.push(storedGameData.game);
                } else {
                    idsToFetch.push(gameID);
                }
            }

            if (idsToFetch.length > 0) {
                const newGameDataArray = await fetchMultipleGameData(idsToFetch);
                for (const data of newGameDataArray) {
                    localStorage.setItem(
                        `gameData_${data.id}`,
                        JSON.stringify({ game: data })
                    );
                }
                const updatedGameData = newGameDataArray.map(data => data.game);
    setGameDataArray([...storedGamesArray, ...updatedGameData]);
            } else {
                // Extract only the .game property for each item in storedGamesArray
    const storedGameData = storedGamesArray.map(data => data.game);
    setGameDataArray(storedGameData);
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
                        <TitleCard key={gameData.id} gameData={gameData} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Likes;
