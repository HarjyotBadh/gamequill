import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import TitleCard from "../components/TitleCard";
import Switch from "@mui/material/Switch";
import "../styles/LikesPage.css";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [gameDataArray, setGameDataArray] = useState([]);
    const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);

    const parsePrice = (priceString) => {
        if (priceString && priceString !== "None") {
            return Number(priceString.replace(/[^0-9.-]+/g, ""));
        }
        return 0;
    };


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

    // Function to check if a game is on sale
    const isGameOnSale = (gameData) => {
        const priceFields = ['steam_game_price', 'xbox_game_price', 'playstation_game_price'];
        return priceFields.some(priceField => {
            if (gameData[priceField] && gameData[priceField].price) {
                const price = gameData[priceField].price;
                return price.discountedPrice !== "None" && parsePrice(price.discountedPrice) < parsePrice(price.originalPrice);
            }
            return false;
        });
    };
    

    // Filtered games based on sale status
    const filteredGameDataArray = showOnlyOnSale ? gameDataArray.filter(gameData => isGameOnSale(gameData.game)) : gameDataArray;

    return (
        <div>
            <NavBar />
            <div className="likes-container">
                <h1 className="likes-title">My Wishlist</h1>
                <div>
                    <label>
                    <Switch
                            checked={showOnlyOnSale}
                            onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                            name="showOnlyOnSale"
                            color="primary"
                        />
                        Show Only Games on Sale
                    </label>
                </div>
                <div className="likes">
                    {filteredGameDataArray.map((gameData) => (
                        <TitleCard key={gameData.id} gameData={gameData.game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;