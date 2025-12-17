// MyListsPage.js

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import ListPreview from "../components/ListPreview";
import { getMultipleListData } from "../functions/ListFunctions";

const MyListsPage = ({ userId }) => {
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    try {
      if (!auth.currentUser) return;
      const docRef = doc(db, "profileData", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const listIds = docSnap.data().lists || [];
        const listsData = await getMultipleListData(listIds);
        setLists(listsData);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

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
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-gradient text-center mb-10">
          My Lists
        </h1>

        {lists.length === 0 ? (
          <div
            className="text-center text-xl mt-10"
            style={{ color: "var(--text-color)" }}
          >
            You don't have any lists yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lists.map((list) => (
              <div key={list.id} className="h-full">
                <ListPreview list={list} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListsPage;
