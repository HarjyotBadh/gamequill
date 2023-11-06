import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import TitleCard from "../components/TitleCard";
import "../styles/LikesPage.css";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [gameDataArray, setGameDataArray] = useState([]);

    // Fetch game data based on the played items
    const fetchGameDatas = async () => {
        if (wishlistItems.length > 0) {
            try {
                const gameDataArray = await fetchMultipleGameData(wishlistItems);
                setGameDataArray(gameDataArray);
            } catch (error) {
                console.error('Failed to fetch game data:', error);
            }
        } else {
            setGameDataArray([]);
        }
    };

    // Fetches plays from the user's document in Firestore
    const fetchPlays = async () => {
        try {
            const user = auth.currentUser.uid;
            const docRef = doc(db, "profileData", user);
            const docSnap = await getDoc(docRef);
            const docPlays = docSnap.data().wishlist || [];
            setWishlistItems(docPlays);
        } catch (error) {
            console.error("Error fetching plays data from Firestore:", error);
        }
    };

    // Effect for auth state changed
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            if (authObj) {
                fetchPlays();
            }
        });

        // Cleanup
        return () => unsub();
    }, []);

    // Effect for fetching game data when playedItems changes
    useEffect(() => {
        fetchGameDatas();
    }, [wishlistItems]);

    return (
        <div>
            <NavBar />
            <div className="likes-container">
                <h1 className="likes-title">My Wishlist</h1>
                <div className="likes">
                    {gameDataArray.map((gameData) => (
                        <TitleCard key={gameData.id} gameData={gameData.game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
