// MyListsPage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import ListPreview from "../components/ListPreview";
import { getListData, getMultipleListData } from "../functions/ListFunctions";
import "../styles/MyLists.css";

const MyListsPage = ({ userId }) => {
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    try {
      const docRef = doc(db, "profileData", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const listIds = docSnap.data().lists || [];

      const listsData = await getMultipleListData(listIds);

      setLists(listsData);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  //fetchLists();
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        fetchLists();
      }
    });

    // Cleanup
    return () => unsub();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-500 h-screen">
      <NavBar />
      <h2 className="listPageTitle text-black dark:text-white">My Lists</h2>
      <div className="my-lists-container bg-white dark:bg-gray-500">
        {lists.map((list) => (
          <ListPreview key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default MyListsPage;
