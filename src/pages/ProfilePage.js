import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import DefaultProfilePicture from "../images/defaultProfilePicture.png";
export default function ProfilePage({ accountNumber }) {
  const defaultProfileData = {
    profilePicture: DefaultProfilePicture,
    bio: "test",
    pronouns: "",
    favoriteGames: [
      "Halo",
      "God of War",
      "Spider-Man",
      "Red Dead Redemption 2",
    ],
    favoriteGenres: ["Adventure", "FPS", "RPG", "Strategy"],
    name: "John Doe",
  };

  const [profileData, setProfileData] = useState(defaultProfileData);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "profileData", accountNumber);
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

    fetchData();
  }, []);

  return (
    <div>
      <NavBar />
      <Profile profileData={profileData} setProfileData={setProfileData} />
    </div>
  );
}
