import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    BellIcon,
    BellSlashIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import Badge from "@mui/material/Badge";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import "../styles/NotificationBell.css";

export default function NotificationBell({ userUid }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [panelOpen, setPanelOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchNotifications() {
            if (userUid) {
                try {
                    const docRef = doc(db, "profileData", userUid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const notificationsData =
                            docSnap.data().notifications || [];
                        const notificationsWithDetails = await Promise.all(
                            notificationsData.map(async (notification) => {
                                // Fetch the sender's username and profile picture/avatar
                                const senderProfileRef = doc(
                                    db,
                                    "profileData",
                                    notification.senderUID
                                );
                                const senderProfileSnap = await getDoc(
                                    senderProfileRef
                                );

                                // Default to a generic avatar if no profile picture is available
                                const profilePicture =
                                    senderProfileSnap.exists() &&
                                    senderProfileSnap.data().profilePicture
                                        ? senderProfileSnap.data()
                                              .profilePicture
                                        : "default-avatar-path";

                                return {
                                    ...notification,
                                    senderUsername: senderProfileSnap.exists()
                                        ? senderProfileSnap.data().username
                                        : "Unknown User",
                                    imageSrc:
                                        notification.type === "follow"
                                            ? profilePicture
                                            : notification.gameCoverUrl,
                                };
                            })
                        );

                        // Sort notifications by timestamp in descending order
                        notificationsWithDetails.sort(
                            (a, b) => b.timestamp.seconds - a.timestamp.seconds
                        );

                        setNotifications(notificationsWithDetails);
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
            setLoading(false);
        }

        fetchNotifications();
    }, [userUid]);

    const deleteNotification = async (notificationToDelete) => {
        try {
            // Get a reference to the user's profile document
            const userProfileRef = doc(db, "profileData", userUid);
    
            // Get the current user's profile data
            const userProfileSnap = await getDoc(userProfileRef);
    
            if (userProfileSnap.exists()) {
                // Get current notifications array
                const currentNotifications = userProfileSnap.data().notifications || [];
                
                // Find the index of the notification to delete
                const notificationIndex = currentNotifications.findIndex(
                    (n) => 
                        n.senderUID === notificationToDelete.senderUID &&
                        n.timestamp.seconds === notificationToDelete.timestamp.seconds &&
                        n.type === notificationToDelete.type
                );
    
                // If the notification is found, remove it from the array
                if (notificationIndex > -1) {
                    const updatedNotifications = [
                        ...currentNotifications.slice(0, notificationIndex),
                        ...currentNotifications.slice(notificationIndex + 1)
                    ];
    
                    // Update the document with the new notifications array
                    await updateDoc(userProfileRef, {
                        notifications: updatedNotifications
                    });
    
                    // Update the local state
                    setNotifications(notifications.filter(n => n !== notificationToDelete));
                }
            }
        } catch (error) {
            console.error("Error removing notification: ", error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            // Get a reference to the user's profile document
            const userProfileRef = doc(db, "profileData", userUid);
    
            // Update the document to set the notifications array to an empty array
            await updateDoc(userProfileRef, {
                notifications: []
            });
    
            // Update the local state to an empty array
            setNotifications([]);
        } catch (error) {
            console.error("Error clearing all notifications: ", error);
        }
    };

    // Function to convert timestamp to time ago
    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notificationDate = new Date(timestamp.seconds * 1000);
        const secondsAgo = Math.floor((now - notificationDate) / 1000);

        let interval = Math.floor(secondsAgo / 31536000);
        if (interval > 1) {
            return `${interval} years ago`;
        }
        interval = Math.floor(secondsAgo / 2592000);
        if (interval > 1) {
            return `${interval} months ago`;
        }
        interval = Math.floor(secondsAgo / 86400);
        if (interval > 1) {
            return `${interval} days ago`;
        }
        interval = Math.floor(secondsAgo / 3600);
        if (interval > 1) {
            return `${interval} hours ago`;
        }
        interval = Math.floor(secondsAgo / 60);
        if (interval > 1) {
            return `${interval} minutes ago`;
        }
        return `${Math.floor(secondsAgo)} seconds ago`;
    };

    if (loading) {
        return <div><CircularProgress /></div>;
    }

    const togglePanel = () => {
        setPanelOpen(!panelOpen);
    };

    return (
        <div className="relative">
            <div onClick={togglePanel} className="cursor-pointer z-10">
                {notifications.length === 0 ? (
                    <BellSlashIcon
                        className="h-8 w-8 text-gray-400"
                        aria-hidden="true"
                    />
                ) : (
                    <Badge badgeContent={notifications.length} color="primary">
                        <BellIcon
                            className="h-8 w-8 text-gray-400"
                            aria-hidden="true"
                        />
                    </Badge>
                )}
            </div>
            {panelOpen && (
                <div className="notification-panel">
                    <div className="flex justify-end p-2">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={clearAllNotifications}
                    >
                        Clear All
                    </button>
                </div>
                    <ul>
                        {notifications.map((notification, index) => (
                            <li
                                key={index}
                                className="notification-item"
                                onClick={() => {
                                    // Navigate based on the type of notification when the item is clicked
                                    if (notification.type === "follow") {
                                        navigate(
                                            `/Profile?user_id=${notification.senderUID}`
                                        );
                                    } else {
                                        navigate(
                                            `/review/${notification.reviewID}`
                                        );
                                    }
                                }}
                            >
                                <div className="flex items-center p-3">
                                    {/* Keep the image click handlers as they are */}
                                    {notification.type === "follow" ? (
                                        <a
                                            onClick={(e) => {
                                                e.stopPropagation(); // This stops the li onClick from being triggered
                                                navigate(
                                                    `/Profile?user_id=${notification.senderUID}`
                                                );
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                src={notification.imageSrc}
                                                alt="User avatar"
                                                className="h-12 w-12 object-cover mr-3 rounded-full"
                                            />
                                        </a>
                                    ) : (
                                        <a
                                            onClick={(e) => {
                                                e.stopPropagation(); // This stops the li onClick from being triggered
                                                navigate(
                                                    `/game?game_id=${notification.gameID}`
                                                );
                                            }}
                                            className="cursor-pointer game-cover-wrapper"
                                        >
                                            <img
                                                src={notification.gameCoverUrl}
                                                alt="Game cover"
                                                className="rounded"
                                            />
                                        </a>
                                    )}
                                    <div className="flex-grow">
                                        <span>
                                            {notification.type === "follow"
                                                ? `${notification.senderUsername} followed you`
                                                : `${notification.senderUsername} liked your review on ${notification.gameName}`}
                                        </span>
                                        <div className="notification-time-text">
                                            {getTimeAgo(notification.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                <TrashIcon
                                    className="h-7 w-7 text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification);
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
