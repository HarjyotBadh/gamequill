import React, { useState, useEffect } from "react";
import addWishlistImage from "../images/buttons/addwishlist.png";
import removeImage from "../images/buttons/remove.png";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "../styles/WishListButton.css";

const WishlistButton = ({ gameID }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);
        const docSnap = await getDoc(docRef);
        const docWishlist = docSnap.data().wishlist;

        if (docWishlist.includes(gameID)) {
          setIsClicked(true); // Set the button to 'on' state
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, [gameID]);

  const handleButtonClick = async () => {
    setIsClicked((prevState) => !prevState);

    const user = auth.currentUser.uid;
    const docRef = doc(db, "profileData", user);

    try {
      if (isClicked) {
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
    <button className="wishlistButton" onClick={handleButtonClick}>
      <img
        src={isClicked ? removeImage : addWishlistImage}
        alt={isClicked ? "Remove from Wishlist" : "Add to Wishlist"}
      />
    </button>
  );
};

export default WishlistButton;
