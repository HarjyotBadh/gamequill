import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import DefaultProfilePicture from "../images/defaultProfilePicture.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function ProfilePage({}) {
  const [loading, setLoading] = useState(true);

  var uid;
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user);
        uid = user.uid; // use the uid from the auth state change
        await fetchData(uid); // fetch data here with the uid
      } else {
        window.location.href = "/login";
      }
      setLoading(false); // set loading to false after auth check
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  const defaultProfileData = {
    profilePicture: DefaultProfilePicture,
    bio: "",
    pronouns: "",
    favoriteGames: ["", "", "", ""],
    favoriteGenres: ["", "", "", ""],
    name: "",
  };

  const [profileData, setProfileData] = useState(defaultProfileData);

  // useEffect(() => {
  const fetchData = async (uid) => {
    const docRef = doc(db, "profileData", uid);
    // const snapshot = await getDocs(
    //   collection(db, "profileData", accountNumber)
    // );
    const snapshot = await getDoc(docRef);
    //console.log("print");

    if (!snapshot.empty) {
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
      };
      setProfileData(data);
    } else {
      setProfileData(defaultProfileData);
    }
    if (snapshot.exists()) {
      console.log("Doc data", snapshot.data());
    } else {
      console.log("Doc does not exist");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  //   fetchData();
  // }, []);

  return (
    <div>
      <NavBar />
      <Profile profileData={profileData} setProfileData={setProfileData} />
    </div>
  );
}
