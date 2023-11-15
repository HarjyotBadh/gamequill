import React, { useState, useEffect } from "react";
import gameLoggedImage from "../images/buttons/gq-played-shadow.png";
import gameNotLoggedImage from "../images/buttons/gq-notplayed-shadow.png";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "../styles/GameLikeLog.css";
const GameLog = ({ gameID }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
            const user = auth.currentUser.uid;
            const docRef = doc(db, "profileData", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docPlays = docSnap.data().plays;
                if (docPlays && docPlays.includes(gameID)) {
                    setIsClicked(true); // Set the button to 'on' state
                }
            } else {
                console.log("No such document!");
            }
        } else {
            console.log("User not logged in");
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
}, [gameID, auth.currentUser]);

  // The code that runs every time the button is clicked
  const handleButtonClick = async () => {
    setIsClicked((prevState) => !prevState);

    const user = auth.currentUser.uid;
    const docRef = doc(db, "profileData", user);

    try {
      if (isClicked) {
        // Remove the gameID from the 'played' array
        await updateDoc(docRef, {
          plays: arrayRemove(gameID),
        });
        // console.log('Removed game ID from array');
      } else {
        // Add the gameID to the 'played' array
        await updateDoc(docRef, {
          plays: arrayUnion(gameID),
        });
        // console.log('Added game ID to array');
      }
    } catch (error) {
      console.error("Error updating data in Firestore:", error);
    }
  };

  return (
    <button className="gameLog" onClick={handleButtonClick}>
      <img
        src={isClicked ? gameLoggedImage : gameNotLoggedImage}
        alt={isClicked ? "Game logged!" : "Game not logged."}
      />
    </button>
  );
};

export default GameLog;
