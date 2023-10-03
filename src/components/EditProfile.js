import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import "../styles/EditProfile.css";

export default function EditProfile({ profileData, setProfileData }) {
  console.log(profileData);
  const uid = "GPiU3AHpvyOhnbsVSzap";

  useEffect(() => {
    setFormData({
      name: profileData.name || "",
      pronouns: profileData.pronouns || "",
      bio: profileData.bio || "",
      profilePicture: profileData.profilePicture || "",
    });
  }, [profileData]);

  const [formData, setFormData] = useState({
    name: profileData.name || "",
    pronouns: profileData.pronouns || "",
    bio: profileData.bio || "",
    profilePicture: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    //setHasChanges(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${uid}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    setFormData((prevState) => ({
      ...prevState,
      profilePicture: downloadURL,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = { ...formData };

    // Update Firestore with new data
    const docRef = doc(db, "profileData", uid);
    await setDoc(docRef, updatedFormData, { merge: true });

    // Update the profileData state with the new data
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      ...updatedFormData,
    }));
  };

  return (
    <Popup
      trigger={<button className="button">Edit Profile</button>}
      modal
      nested
      contentStyle={{
        border: "2px solid white",
        //color: "white",
        height: 500,
        width: 500,
        backgroundColor: "grey",
      }}
    >
      {(close) => (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Pronouns"
                name="pronouns"
                value={formData.pronouns}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                name="profile picture"
              />
            </div>
            <button type="submit" onClick={setHasChanges(true)}>
              Save
            </button>
            <button
              type="close"
              onClick={() => {
                close();
                if (hasChanges) {
                  window.location.reload();
                  setHasChanges(false);
                }
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </Popup>
  );
}
