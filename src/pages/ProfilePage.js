import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Profile from "../components/Profile";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import DefaultProfilePicture from "../images/defaultProfilePicture.png";
export default function ProfilePage({ accountNumber }) {
  const profilePicture = DefaultProfilePicture;
  const bio = "test";
  const pronouns = "he/him";
  const favoriteGames = [
    "Halo",
    "God of War",
    "Spider-Man",
    "Red Dead Redemption 2",
  ];
  const favoriteGenres = ["Adventure", "FPS", "RPG", "Strategy"];
  //const [name, setName] = useState("");
  const [profileData, setProfileData] = useState({
    profilePicture: DefaultProfilePicture,
    bio: "test",
    pronouns: "he/him",
    favoriteGames: [
      "Halo",
      "God of War",
      "Spider-Man",
      "Red Dead Redemption 2",
    ],
    favoriteGenres: ["Adventure", "FPS", "RPG", "Strategy"],
    name: "John Doe",
  });
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "profileData"));
      const data = {};

      snapshot.docs.forEach((doc) => {
        const docData = doc.data();
        for (const key in profileData) {
          if (docData[key]) {
            data[key] = docData[key];
          } else {
            data[key] = profileData[key];
          }
        }
      });

      setProfileData(data);
    };

    fetchData();
  }, []);
  return (
    <div>
      <NavBar />
      <Profile profileData={profileData} />
    </div>
  );
}
