import Popup from "reactjs-popup";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";

import "../styles/EditProfile.css"; // Import the CSS file

export default function EditProfile({ profileData, setProfileData }) {
  const [formData, setFormData] = useState({
    name: profileData.name || "", // Initialize with profileData.name or an empty string
    pronouns: profileData.pronouns || "", // Initialize with profileData.pronouns or an empty string
    bio: profileData.bio || "", // Initialize with profileData.bio or an empty string
    profilePicture: "",
  });
  useEffect(() => {
    setFormData({
      name: profileData.name || "",
      pronouns: profileData.pronouns || "",
      bio: profileData.bio || "",
      profilePicture: "",
    });
  }, [profileData]);
  //console.log("profileData:", profileData);
  //console.log("formData:", formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    const updatedFormData = { ...formData };
    // Update Firestore with new data
    if (updatedFormData.profilePicture !== profileData.profilePicture) {
      console.log("updating profile picture");
      // Update Firestore with new data
      const docRef = await addDoc(
        collection(db, "profileData"),
        updatedFormData
      );

      // Get the newly created document ID
      const docId = docRef.id;

      // Update the profileData state with the new document ID
      setProfileData((prevProfileData) => ({
        ...prevProfileData,
        id: docId,
        ...updatedFormData,
      }));
      console.log(profileData);
    } else {
      // If no new picture was uploaded, simply update other fields
      setProfileData((prevProfileData) => ({
        ...prevProfileData,
        ...updatedFormData,
      }));
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `profilePictures/${file.name}`);

    uploadBytesResumable(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setFormData({
          ...formData,
          profilePicture: downloadURL,
        });
      });
    });
  };
  return (
    <Popup
      trigger={<button className="button">Edit Profile</button>}
      modal
      nested
      contentStyle={{
        border: "2px solid white",
        color: "white",
        height: 500,
        width: 500,
        backgroundColor: "grey",
      }}
    >
      {(close) => (
        <div className="modal">
          <div className="content">Edit Profile</div>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="inputField"
            value={formData.name}
            onChange={handleInputChange}
          ></input>
          <input
            type="text"
            placeholder="Enter Pronouns"
            className="inputField"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleInputChange}
          ></input>
          <input
            type="text"
            placeholder="Enter Bio"
            className="inputField"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          ></input>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            name="profile picture"
          />
          <div>
            <button
              onClick={(e) => {
                close();
                handleSubmit();
              }}
              className="doneButton"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
