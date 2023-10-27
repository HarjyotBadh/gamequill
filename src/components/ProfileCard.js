import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, doc } from "firebase/firestore";
import { Avatar } from "@material-tailwind/react";
import "../styles/ProfileCard.css";

const ProfileCard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const fetchData = async () => {
    //   const collection = collection(db, "profileData");
    const userRef = doc(db, "profileData", userId);
    const document = await getDoc(userRef);
    if (document.exists) {
      setUserData(document.data());
    } else {
      console.log("No such document!");
    }
  };
  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <div className="profile-card">
      {userData && (
        <>
          <div className="profile-info">
            <div className="profile-picture">
              <Avatar
                src={userData.profilePicture}
                alt="Profile"
                className="custom-avatar medium-avatar"
              />
            </div>
            <h2 className="dark:text-white text-black">{userData.username}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
