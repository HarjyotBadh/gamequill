import React, { useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  updateDoc,
  addDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
export default function ListButton({ gameID }) {
  const [showPopup, setShowPopup] = useState(false);
  const handleAddToList = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleCreateNewList = async () => {
    // Redirect to a new page to create a new list
    // You can use React Router or any routing library for this
    // Set up a route like '/createList'
    // Pass the game data as a prop to the new page
    try {
      const userId = auth.currentUser.uid;
      const newListRef = await addDoc(collection(db, "lists"), {
        games: [gameID],
      });

      const newListId = newListRef.id;

      // Add the new listId to the user's profileData
      const userDocRef = doc(db, "profileData", userId);
      await updateDoc(userDocRef, {
        lists: arrayUnion(newListRef.id),
      });

      // Redirect the user to the new list page
      window.location.href = `/list/${newListId}`;
    } catch (error) {
      console.error("Error creating new list:", error);
    }
  };
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
        onClick={handleAddToList}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      {showPopup && (
        <div className="popup">
          <button onClick={handleCreateNewList}>Create New List</button>
          <button onClick={handleClosePopup}>Close</button>
          {/* Display existing lists here */}
        </div>
      )}
    </div>
  );
}
