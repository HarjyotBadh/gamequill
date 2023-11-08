import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { BellIcon, BellSlashIcon } from "@heroicons/react/24/outline";
import Badge from "@mui/material/Badge";
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
        return <div>Loading...</div>;
    }

    const togglePanel = () => {
        setPanelOpen(!panelOpen);
    };

    return (
        <div className="relative">
            <div onClick={togglePanel} className="cursor-pointer z-10">
                {notifications.length === 0 ? (
                    <BellSlashIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                    />
                ) : (
                    <Badge badgeContent={notifications.length} color="primary">
                        <BellIcon
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                        />
                    </Badge>
                )}
            </div>
            {panelOpen && (
                <div className="notification-panel">
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index} className="notification-item">
                                <a
                                    onClick={() =>
                                        navigate(
                                            `/user/${notification.senderUID}`
                                        )
                                    }
                                    className="flex items-center p-3"
                                >
                                    <img
                                        src={notification.imageSrc}
                                        alt={
                                            notification.type === "follow"
                                                ? "User avatar"
                                                : "Game cover"
                                        }
                                        className={`h-12 w-12 object-cover mr-3 ${
                                            notification.type === "follow"
                                                ? "rounded-full"
                                                : "rounded-md"
                                        }`}
                                    />

                                    <div>
                                        <span>
                                            {notification.type === "follow"
                                                ? `${notification.senderUsername} followed you`
                                                : `${notification.senderUsername} liked your review on ${notification.gameName}`}
                                        </span>
                                        <div className="notification-time-text">
                                            {getTimeAgo(notification.timestamp)}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
