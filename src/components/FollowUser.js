import React, { useState, useEffect } from 'react';
import gameFollowImage from '../images/buttons/gq-follow-shadow.png';
import gameFollowingImage from '../images/buttons/gq-following-shadow.png';
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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
                console.error('Error fetching data from Firestore:', error);
            }
        };

        fetchData();
    }, [target_uid]); // Add gameID as a dependency

    // The code that runs every time the button is clicked
    const handleButtonClick = async () => {
        setIsClicked(prevState => !prevState);

        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);

        try {
            if (isClicked) {
                // Remove the gameID from the 'likes' array
                await updateDoc(docRef, {
                    follows: arrayRemove(target_uid)
                });
                // console.log('Removed game ID from Like array');
            } else {
                // Add the gameID to the 'likes' array
                await updateDoc(docRef, {
                    follows: arrayUnion(target_uid)
                });
                // console.log('Added game ID to Like array');
            }
        } catch (error) {
            console.error('Error updating data in Firestore:', error);
        }
    }

    return (
        <button onClick={handleButtonClick}>
            <img
                src={isClicked ? gameFollowingImage : gameFollowImage}
                alt={isClicked ? 'Follow user' : 'Unfollow user'}
            />
        </button>
    );
}

export default FollowUser;
