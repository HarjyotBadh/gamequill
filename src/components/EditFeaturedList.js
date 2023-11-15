import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import Popup from "reactjs-popup";
import { getListData } from "../functions/ListFunctions";
export default function EditFeaturedList({ setFeaturedList }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLists, setFilteredLists] = useState([]);

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filterLists = async () => {
      if (searchQuery !== "") {
        // Filter lists based on the search query
        const listsCollection = collection(db, "lists");
        const q = query(
          listsCollection,
          where("owner", "==", auth.currentUser.uid),
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
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
      } else {
        setFilteredLists([]);
      }
    };
    filterLists();
  }, [searchQuery]);

  const handleSelectList = async (listId) => {
    // Set the selected list to the parent component state
    const featuredList = await getListData(listId);
    setFeaturedList(featuredList);
    const docRef = doc(db, "profileData", auth.currentUser.uid);
    try {
      await updateDoc(docRef, {
        featuredList: featuredList,
      });
      console.log("Featured List updated successfully");
    } catch (error) {
      console.error("Error updating featured list:", error);
    }
  };

  return (
    <Popup
      trigger={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      }
      position="bottom center"
      closeOnDocumentClick
      modal
      nested
      contentStyle={{
        border: "2px solid white",
        height: 550,
        width: 550,
        backgroundColor: "grey",
      }}
    >
      {(close) => (
        <div className="featured-list-popup">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a list"
          />
          <ul>
            {filteredLists.map((list) => (
              <li key={list.id}>
                <button onClick={() => handleSelectList(list.id)}>
                  {list.name}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="close"
            onClick={() => {
              close();
            }}
          >
            Close
          </button>
        </div>
      )}
    </Popup>
  );
}
