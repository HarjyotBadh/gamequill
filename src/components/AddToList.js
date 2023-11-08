import React, { useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  updateDoc,
  addDoc,
  doc,
  arrayUnion,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import "../styles/AddToList.css";
export default function ListButton({ gameID }) {
  const [showPopup, setShowPopup] = useState(false);
  const [listName, setListName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLists, setFilteredLists] = useState([]);
  const handleAddToList = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleListNameChange = (e) => {
    setListName(e.target.value);
  };
  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);

    // Filter lists based on the search query
    const listsCollection = collection(db, "lists");
    const q = query(
      listsCollection,
      where("owner", "==", auth.currentUser.uid),
      where("name", ">=", e.target.value),
      where("name", "<=", e.target.value + "\uf8ff"),
      limit(10)
    );

    const listResults = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const listData = doc.data();
      listResults.push({
        id: doc.id,
        name: listData.name,
      });
    });
    setFilteredLists(listResults);

    // getDocs(q)
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       const listData = doc.data();
    //       listResults.push({
    //         id: doc.id,
    //         name: listData.name,
    //       });
    //     });
    //     setFilteredLists(listResults);
    //   })
    //   .catch((error) => {
    //     console.error("Error searching lists:", error);
    //   });
  };
  const handleCreateNewList = async () => {
    try {
      const userId = auth.currentUser.uid;
      const newListRef = await addDoc(collection(db, "lists"), {
        games: [gameID],
        name: listName,
        owner: userId,
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
  const handleAddToExistingList = async (listId) => {
    try {
      // Add the game to the existing list
      const listDocRef = doc(db, "lists", listId);
      await updateDoc(listDocRef, {
        games: arrayUnion(gameID), // Assuming game is available in scope
      });

      // Redirect the user to the list page
      window.location.href = `list/${listId}`;
    } catch (error) {
      console.error("Error adding game to existing list:", error);
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
          strokeLineCap="round"
          strokeLineJoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      {showPopup && (
        <div className="list-popup">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a list"
          />
          <ul>
            {filteredLists.map((list) => (
              <li key={list.id}>
                <button onClick={() => handleAddToExistingList(list.id)}>
                  Add to {list.name}
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={listName}
            onChange={handleListNameChange}
            placeholder="Enter new list name"
          />
          <button onClick={handleCreateNewList}>Create New List</button>
          <button onClick={handleClosePopup}>Close</button>
          {/* Display existing lists here */}
        </div>
      )}
    </div>
  );
}
