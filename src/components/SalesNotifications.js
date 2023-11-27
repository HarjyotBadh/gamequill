import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Badge from "@mui/material/Badge";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
import "../styles/NotificationBell.css";

export default function SalesNotifications({ userUid, isOpen, onToggle }) {
    const [salesNotifications, setSalesNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [panelOpen, setPanelOpen] = useState(false);
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
                try {
                    const userProfileRef = doc(db, "profileData", userUid);
                    const userProfileSnap = await getDoc(userProfileRef);

                    if (userProfileSnap.exists()) {
                        const wishlist = userProfileSnap.data().wishlist || [];
                        const sales = await Promise.all(wishlist.map(async (gameId) => {
                            const gameRef = doc(db, "games", gameId.toString());
                            const gameSnap = await getDoc(gameRef);

                            if (gameSnap.exists()) {
                                const gameData = gameSnap.data();
                                const priceFields = ['steam_game_price', 'xbox_game_price', 'playstation_game_price'];
                                for (let priceField of priceFields) {
                                    if (gameData[priceField] && gameData[priceField].price) {
                                        const price = gameData[priceField].price;
                                        if (!(price.discountedPrice === "None") && parsePrice(price.discountedPrice) < parsePrice(price.originalPrice)) {
                                            return {
                                                gameId: gameId,
                                                gameName: gameData.name,
                                                gameCover: gameData.cover,
                                                discountedPrice: price.discountedPrice,
                                                finalPrice: price.finalPrice,
                                                originalPrice: price.originalPrice
                                            };
                                        }
                                    }
                                }
                            }
                            return null;
                        }));

                        setSalesNotifications(sales.filter(n => n !== null));
                    } else {
                        console.log("User profile not found");
                    }
                } catch (error) {
                    console.error("Error fetching sales notifications:", error);
                }
            }
            setLoading(false);
        };

        fetchSalesNotifications();
    }, [userUid]);

    if (loading) {
        return <CircularProgress />;
    }

    // const togglePanel = () => {
    //     onToggle(); // This will handle the logic in the App component
    //     setPanelOpen(!panelOpen); // Toggle the current panel's state
    // };
    

    const getCoverUrl = (cover) => {
        return cover ? cover.url.replace('t_thumb', 't_1080p') : 'path-to-default-game-cover';
    };


    return (
        <div className="relative">
            <div onClick={onToggle} className="cursor-pointer z-10">
                {salesNotifications.length === 0 ? (
                    <PresentationChartLineIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                ) : (
                    <Badge badgeContent={salesNotifications.length} color="primary">
                        <PresentationChartLineIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                    </Badge>
                )}
            </div>
            {/* Notification panel */}
            <div className="notification-panel" style={{ display: isOpen ? 'block' : 'none' }}>
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
