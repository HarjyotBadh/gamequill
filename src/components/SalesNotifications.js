import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
import Tooltip from "@mui/material/Tooltip";
import "../styles/NotificationBell.css";

export default function SalesNotifications({ userUid, isOpen, onToggle }) {
    const [salesNotifications, setSalesNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const parsePrice = (priceString) => {
        if (priceString) {
            return Number(priceString.replace(/[^0-9.-]+/g, ""));
        }
        return 0;
    };

    useEffect(() => {
        const fetchSalesNotifications = async () => {
            if (userUid) {
                setLoading(true);

                try {
                    const userProfileRef = doc(db, "profileData", userUid);
                    const userProfileSnap = await getDoc(userProfileRef);

                    if (userProfileSnap.exists()) {
                        const { notificationPreferences } = userProfileSnap.data();
                        const wishlist = userProfileSnap.data().wishlist || [];

                        // Define the price fields based on user preferences
                        const priceFields = [];

                        if (notificationPreferences.steam) priceFields.push("steam_game_price");
                        if (notificationPreferences.xbox) priceFields.push("xbox_game_price");
                        if (notificationPreferences.playstation)
                            priceFields.push("playstation_game_price");

                        const salesFromWishlist = await Promise.all(
                            wishlist.map(async (gameId) => {
                                const gameRef = doc(db, "games", gameId.toString());
                                const gameSnap = await getDoc(gameRef);

                                if (gameSnap.exists()) {
                                    const gameData = gameSnap.data();
                                    for (let priceField of priceFields) {
                                        // Use the filtered priceFields
                                        if (gameData[priceField] && gameData[priceField].price) {
                                            const price = gameData[priceField].price;
                                            if (
                                                price.discountedPrice !== "None" &&
                                                parsePrice(price.discountedPrice) <
                                                    parsePrice(price.originalPrice)
                                            ) {
                                                return {
                                                    gameId: gameId,
                                                    gameName: gameData.name,
                                                    gameCover: gameData.cover,
                                                    discountedPrice: price.discountedPrice,
                                                    finalPrice: price.finalPrice,
                                                    originalPrice: price.originalPrice,
                                                };
                                            }
                                        }
                                    }
                                }
                                return null;
                            })
                        );

                        // New logic for fetching a random game with recent discount
                        const gamesRef = collection(db, "games");
                        const lastDay = new Date();
                        lastDay.setHours(lastDay.getHours() - 24); // set to 24 hours ago

                        const querySnapshot = await getDocs(
                            query(gamesRef, where("last_price_update", ">=", lastDay))
                        );
                        let filteredGames = [];

                        querySnapshot.forEach((doc) => {
                            const game = doc.data();
                            const priceFields = [
                                "steam_game_price",
                                "xbox_game_price",
                                "playstation_game_price",
                            ];
                            for (let priceField of priceFields) {
                                if (
                                    game[priceField] &&
                                    game[priceField].price &&
                                    game[priceField].price.discountedPrice !== "None"
                                ) {
                                    filteredGames.push({
                                        gameId: doc.id,
                                        gameName: game.name,
                                        gameCover: game.cover,
                                        discountedPrice: game[priceField].price.discountedPrice,
                                        finalPrice: game[priceField].price.finalPrice,
                                        originalPrice: game[priceField].price.originalPrice,
                                    });
                                    break; // Exit loop if one valid price is found
                                }
                            }
                        });

                        let allSalesNotifications = salesFromWishlist.filter((n) => n !== null);

                        // Add a random game from the recent discounts, if available
                        if (filteredGames.length > 0) {
                            const randomGame =
                                filteredGames[Math.floor(Math.random() * filteredGames.length)];
                            // Change the name of the random game to "Recommendation: {gameName}"
                            randomGame.gameName = `Recommendation: ${randomGame.gameName}`;

                            // Add the game to the beginning of the array
                            allSalesNotifications.unshift(randomGame);
                        }

                        setSalesNotifications(allSalesNotifications); // Update state with all sales notifications
                    } else {
                        console.log("User profile not found");
                    }
                } catch (error) {
                    console.error("Error fetching sales notifications:", error);
                }

                setLoading(false);
            }
        };

        fetchSalesNotifications();
    }, [userUid]);

    if (loading) {
        return <CircularProgress />;
    }

    const getCoverUrl = (cover) => {
        return cover ? cover.url.replace("t_thumb", "t_1080p") : "path-to-default-game-cover";
    };

    return (
        <div className="relative">
            <div onClick={onToggle} className="cursor-pointer z-10">
                {salesNotifications.length === 0 ? (
                    <Tooltip title="No games on sale">
                        <PresentationChartLineIcon
                            className="h-8 w-8 text-gray-400"
                            aria-hidden="true"
                        />
                    </Tooltip>
                ) : (
                    <Tooltip title={`${salesNotifications.length - 1} games on sale`}>
                        <Badge badgeContent={salesNotifications.length - 1} color="primary">
                            <PresentationChartLineIcon
                                className="h-8 w-8 text-gray-400"
                                aria-hidden="true"
                            />
                        </Badge>
                    </Tooltip>
                )}
            </div>
            {/* Notification panel */}
            <div className="notification-panel" style={{ display: isOpen ? "block" : "none" }}>
                <ul>
                    {salesNotifications.map((notification, index) => (
                        <li
                            key={index}
                            className="notification-item"
                            onClick={() => navigate(`/game?game_id=${notification.gameId}`)}
                        >
                            <div className="flex items-center p-3">
                                {/* Placeholder for game cover image or similar */}
                                <div className="game-cover-wrapper">
                                    <img
                                        src={getCoverUrl(notification.gameCover)}
                                        alt={`${notification.gameName} cover`}
                                        className="rounded"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <span>
                                        {`${notification.gameName} is on sale for ${notification.discountedPrice}!`}
                                    </span>
                                    {/* You can add time ago functionality here if needed */}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
