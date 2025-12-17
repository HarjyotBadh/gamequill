import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import LoadingScreen from "../components/LoadingScreen";
export default function ProfilePage({ userId }) {
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let uid;
  useEffect(() => {
    const fetchData = async (uid) => {
      const docRef = doc(db, "profileData", uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const docData = snapshot.data();
        const data = {
          profilePicture:
            docData.profilePicture || defaultProfileData.profilePicture,
          bio: docData.bio || defaultProfileData.bio,
          pronouns: docData.pronouns || defaultProfileData.pronouns,
          favoriteGames:
            docData.favoriteGames || defaultProfileData.favoriteGames,
          favoriteGenres:
            docData.favoriteGenres || defaultProfileData.favoriteGenres,
          name: docData.name || defaultProfileData.name,
          username: docData.username || defaultProfileData.username,
          notificationPreferences:
            docData.notificationPreferences ||
            defaultProfileData.notificationPreferences,
          currentlyPlayingGame:
            docData.currentlyPlayingGame ||
            defaultProfileData.currentlyPlayingGame,
          featuredList: docData.featuredList || defaultProfileData.featuredList,
        };
        setProfileData(data);
      } else {
        setProfileData(defaultProfileData);
      }
      if (snapshot.exists()) {
        // Doc data exists
      } else {
        console.error("Doc does not exist");
        window.location.href = "/home";
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        uid = user.uid; // use the uid from the auth state change
        if (userId) {
          uid = userId;
        }
        await fetchData(uid); // fetch data here with the uid
      } else {
        if (userId) {
          uid = userId;
          await fetchData(uid);
        } else {
          window.location.href = "/login";
        }
      }
      setLoading(false); // set loading to false after auth check
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  const defaultProfileData = {
    profilePicture: "",
    bio: "",
    pronouns: "",
    favoriteGames: ["", "", "", ""],
    favoriteGenres: ["", "", "", ""],
    name: "",
    username: "",
    notificationPreferences: {
      xbox: true,
      playstation: true,
    },
    currentlyPlayingGame: null,
    featuredList: null,
  };

  const [profileData, setProfileData] = useState(defaultProfileData);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <NavBar />
      <Profile
        profileData={profileData}
        setProfileData={setProfileData}
        userId={userId}
      />
    </div>
  );
}
