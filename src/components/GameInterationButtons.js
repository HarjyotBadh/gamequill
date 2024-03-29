import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // For unfilled like
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"; // For unfilled play
import StarIcon from "@mui/icons-material/Star"; // For filled wishlist
import StarBorderIcon from "@mui/icons-material/StarBorder"; // For unfilled wishlist
import { db, auth } from "../firebase";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import "../styles/GameInteractionButtons.css";

const GameInteractionButtons = ({ gameID }) => {
    const [liked, setLiked] = useState(false);
    const [played, setPlayed] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (auth.currentUser) {
                    const user = auth.currentUser.uid;
                    const docRef = doc(db, "profileData", user);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setLiked(
                            userData.likes
                                ? userData.likes.includes(gameID)
                                : false
                        );
                        setPlayed(
                            userData.plays
                                ? userData.plays.includes(gameID)
                                : false
                        );
                        setWishlisted(
                            userData.wishlist
                                ? userData.wishlist.includes(gameID)
                                : false
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchData();
    }, [gameID]);

    const handleLike = async () => {
        setLiked((prevState) => !prevState);

        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);

        try {
            if (liked) {
                // Remove the gameID from the 'likes' array
                await updateDoc(docRef, {
                    likes: arrayRemove(gameID),
                });
            } else {
                // Add the gameID to the 'likes' array
                await updateDoc(docRef, {
                    likes: arrayUnion(gameID),
                });
            }
        } catch (error) {
            console.error("Error updating data in Firestore:", error);
        }
    };

    const handlePlay = async () => {
        setPlayed((prevState) => !prevState);

        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);

        try {
            if (played) {
                // Remove the gameID from the 'played' array
                await updateDoc(docRef, {
                    plays: arrayRemove(gameID),
                });
            } else {
                // Add the gameID to the 'played' array
                await updateDoc(docRef, {
                    plays: arrayUnion(gameID),
                });
            }
        } catch (error) {
            console.error("Error updating data in Firestore:", error);
        }
    };

    const handleWishlist = async () => {
        setWishlisted((prevState) => !prevState);

        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);

        try {
            if (wishlisted) {
                // Remove the gameID from the 'wishlist' array
                await updateDoc(docRef, {
                    wishlist: arrayRemove(gameID),
                });
            } else {
                // Add the gameID to the 'wishlist' array
                await updateDoc(docRef, {
                    wishlist: arrayUnion(gameID),
                });
            }
        } catch (error) {
            console.error("Error updating data in Firestore:", error);
        }
    };

    return (
        <div className="game-interaction-buttons">
            <Tooltip title={liked ? "Unlike" : "Like"}>
                <IconButton
                    onClick={handleLike}
                    sx={{
                        color: liked ? "red" : 'var(--secondary-text-color)',
                        '& svg': { outlineColor: 'var(--secondary-text-color)' }
                    }}
                >
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Tooltip>

            <Tooltip title={played ? "Mark as Not Played" : "Mark as Played"}>
                <IconButton
                    onClick={handlePlay}
                    sx={{
                        color: played ? "#007bff" : 'var(--secondary-text-color)',
                        '& svg': { outlineColor: 'var(--secondary-text-color)' }
                    }}
                >
                    {played ? <PlayCircleFilledIcon /> : <PlayCircleOutlineIcon />}
                </IconButton>
            </Tooltip>

            <Tooltip title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
                <IconButton
                    onClick={handleWishlist}
                    sx={{
                        color: wishlisted ? "#ffc107" : 'var(--secondary-text-color)',
                        '& svg': { outlineColor: 'var(--secondary-text-color)' }
                    }}
                >
                    {wishlisted ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default GameInteractionButtons;
