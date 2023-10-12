import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, deleteUser } from "../firebase"; // Import Firebase auth
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import "../styles/EditProfile.css";

export default function EditProfile({ profileData, setProfileData }) {
  console.log(profileData);
  const uid = "GPiU3AHpvyOhnbsVSzap";
  const [hasChanges, setHasChanges] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setHasChanges(true);
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        const user = auth.currentUser;
        await user.delete();
        // Redirect to the sign-in page or perform other actions after successful deletion
        window.location.href = "/login";
      } catch (error) {
        // Handle errors, e.g., display an error message
        console.error("Error deleting account:", error);
      }
    }
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
    await setHasChanges(true);
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
            <button type="button" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button type="button" onClick={handleInputChange}>
              Change Username
            </button>
            <button type="submit">Save</button>
            <button
              type="close"
              onClick={() => {
                if (hasChanges) {
                  setHasChanges(false);
                  window.location.reload();
                }
                close();
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
