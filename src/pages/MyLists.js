// MyListsPage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";

const MyListsPage = ({ userId }) => {
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    try {
      const docRef = doc(db, "profileData", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const listIds = docSnap.data().lists || [];

      const listsData = await Promise.all(
        listIds.map(async (listId) => {
          const listDocRef = doc(db, "lists", listId);
          const listDoc = await getDoc(listDocRef);
          return {
            id: listDoc.id,
            name: listDoc.data().name || `List ${listDoc.id}`,
          };
        })
      );

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
    <div>
      <NavBar />
      <h2>My Lists</h2>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <Link to={`/list/${list.id}`}>{list.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyListsPage;
