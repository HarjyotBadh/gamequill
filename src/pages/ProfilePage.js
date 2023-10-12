import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import DefaultProfilePicture from "../images/defaultProfilePicture.png";
import { getAuth } from "firebase/auth";
export default function ProfilePage({}) {
  const auth = getAuth();
  var uid;
  // if (auth.currentUser == null) {
    //window.location.href = "/login";
    uid = "GPiU3AHpvyOhnbsVSzap";
  // } else {
  //   uid = auth.currentUser.uid;
  //   console.log("User: ", auth.currentUser.uid);
  // }

  const defaultProfileData = {
    profilePicture: DefaultProfilePicture,
    bio: "my bio",
    pronouns: "",
    favoriteGames: [
      "Spider-Man",
      "God of War",
      "Pokemon Platinum",
      "Red Dead Redemption 2",
    ],
    favoriteGenres: ["Adventure", "FPS", "RPG", "Strategy"],
    name: "John Doe",
  };

  const [profileData, setProfileData] = useState(defaultProfileData);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "profileData", uid);
      // const snapshot = await getDocs(
      //   collection(db, "profileData", accountNumber)
      // );
      const snapshot = await getDoc(docRef);
      //console.log("print");

      if (!snapshot.empty) {
        const docData = snapshot.data();
        if (docData.profilePicture == null) {
          console.log("Profile picture is null==============================");
        }
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
      // if (profileData.profilePicture == null) {
      //   console.log("Profile picture is null==============================");
      // }

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
