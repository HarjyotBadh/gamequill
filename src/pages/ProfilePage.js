import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/ProfilePage.css";
import Footer from "../components/Footer";
export default function ProfilePage({ userId }) {
  const [loading, setLoading] = useState(true);

  var uid;
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
        };
        setProfileData(data);
      } else {
        setProfileData(defaultProfileData);
      }
      if (snapshot.exists()) {
        console.log("Doc data", snapshot.data());
      } else {
        console.log("Doc does not exist");
        window.location.href = "/home";
      }
    };
    
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user);
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
  };

  const [profileData, setProfileData] = useState(defaultProfileData);

  

  if (loading) {
    return <div>Loading...</div>;
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
