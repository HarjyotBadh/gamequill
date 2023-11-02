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
            } catch (error) {
                console.error(
                    "Error fetching plays data from Firestore:",
                    error
                );
            }
        };

        const fetchGameDatas = async () => {
            const storedGamesArray = [];
            const idsToFetch = [];

            for (const gameID of playedItems) {
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
                const newGameDataArray = await fetchMultipleGameData(
                    idsToFetch
                );
                for (const data of newGameDataArray) {
                    localStorage.setItem(
                        `gameData_${data.id}`,
                        JSON.stringify({ game: data })
                    );
                }
                const updatedGameData = newGameDataArray.map(
                    (data) => data.game
                );
                setGameDataArray([...storedGamesArray, ...updatedGameData]);
            } else {
                // Extract only the .game property for each item in storedGamesArray
                const storedGameData = storedGamesArray.map(
                    (data) => data.game
                );
                setGameDataArray(storedGameData);
            }
        };

        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                fetchPlays().then(() => {
                    fetchGameDatas();
                });
            }
        });

        // Cleanup
        return () => {
            unsub();
        };
    }, []);

    return (
        <div>
            <NavBar />
            <div className="plays-container">
                <h1 className="plays-title">My Played Games</h1>
                <div className="plays">
                    {gameDataArray.map((gameData) => (
                        <TitleCard key={gameData.id} gameData={gameData} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayedPage;
