import React, { useState, useEffect } from "react";
import gameFollowImage from "../images/buttons/gq-follow-shadow.png";
import gameFollowingImage from "../images/buttons/gq-following-shadow.png";
import { db, auth } from "../firebase";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { sendFollowerNotification } from "../functions/NotificationFunctions";

const FollowUser = ({ target_uid }) => {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser.uid;
                const docRef = doc(db, "profileData", user);
                const docSnap = await getDoc(docRef);
                const docFollows = docSnap.data().follows;

                if (docFollows.includes(target_uid)) {
                    setIsClicked(true); // Set the button to 'on' state
                }
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchData();
    }, [target_uid]); // Add gameID as a dependency

    // The code that runs every time the button is clicked
    const handleButtonClick = async () => {
        const userUID = auth.currentUser.uid; // Current user's UID
        setIsClicked((prevState) => !prevState); // Toggle the clicked state
        const docRef = doc(db, "profileData", userUID);

        try {
            if (isClicked) {
                // If already clicked, it means you're unfollowing the user
                await updateDoc(docRef, {
                    follows: arrayRemove(target_uid),
                });
                // Here you could also handle notification for unfollow if needed
            } else {
                // If not already clicked, you're following the user
                await updateDoc(docRef, {
                    follows: arrayUnion(target_uid),
                });
                // Send a follow notification to the target user
                await sendFollowerNotification(target_uid, userUID);
            }
        } catch (error) {
            console.error("Error updating data in Firestore:", error);
        }
    };

    return (
        <button onClick={handleButtonClick}>
            <img
                src={isClicked ? gameFollowingImage : gameFollowImage}
                alt={isClicked ? "Follow user" : "Unfollow user"}
            />
        </button>
    );
};

export default FollowUser;
