import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { Avatar } from "@material-tailwind/react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="card-global p-4 flex items-center gap-4 transition-transform hover:scale-105 h-full">
      {userData && (
        <>
          <div className="flex-shrink-0">
            <Avatar
              src={userData.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full border border-[var(--glass-border)]"
            />
          </div>
          <h2
            className="font-semibold text-lg"
            style={{ color: "var(--text-color)" }}
          >
            {userData.username}
          </h2>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
