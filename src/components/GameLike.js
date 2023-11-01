import React, { useState, useEffect } from "react";
import gameLikedImage from "../images/buttons/gq-liked-shadow.png";
import gameNotLikedImage from "../images/buttons/gq-notliked-shadow.png";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "../styles/GameLikeLog.css";
const GameLike = ({ gameID }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);
        const docSnap = await getDoc(docRef);
        const docLikes = docSnap.data().likes;

        if (docLikes.includes(gameID)) {
          setIsClicked(true); // Set the button to 'on' state
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, [gameID]); // Add gameID as a dependency

  // The code that runs every time the button is clicked
  const handleButtonClick = async () => {
    setIsClicked((prevState) => !prevState);

    const user = auth.currentUser.uid;
    const docRef = doc(db, "profileData", user);

    try {
      if (isClicked) {
        // Remove the gameID from the 'likes' array
        await updateDoc(docRef, {
          likes: arrayRemove(gameID),
        });
        // console.log('Removed game ID from Like array');
      } else {
        // Add the gameID to the 'likes' array
        await updateDoc(docRef, {
          likes: arrayUnion(gameID),
        });
        // console.log('Added game ID to Like array');
      }
    } catch (error) {
      console.error("Error updating data in Firestore:", error);
    }
  };

  return (
    <button className="gameLike" onClick={handleButtonClick}>
      <img
        src={isClicked ? gameLikedImage : gameNotLikedImage}
        alt={isClicked ? "Game liked!" : "Game not liked."}
      />
    </button>
  );
};

export default GameLike;
