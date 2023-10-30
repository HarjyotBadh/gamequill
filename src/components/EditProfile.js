import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { setDoc, doc, deleteDoc, query, collection, where, getDocs, writeBatch, arrayRemove} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getAuth,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { db } from "../firebase";
import "../styles/EditProfile.css";

export default function EditProfile({ profileData, setProfileData }) {
  // console.log(profileData);
  //const uid = "GPiU3AHpvyOhnbsVSzap";
  const auth = getAuth();
  var uid;
  // if (auth.currentUser == null) {
  //   window.location.href = "/login";
  //   //uid = "GPiU3AHpvyOhnbsVSzap";
  // } else {
  uid = auth.currentUser.uid;
  // }
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPassword("");
    setDeleteError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    setFormData({
      name: profileData.name || "",
      username: profileData.username || "",
      pronouns: profileData.pronouns || "",
      bio: profileData.bio || "",
      profilePicture: profileData.profilePicture || "",
    });
  }, [profileData]);

  const [formData, setFormData] = useState({
    name: profileData.name || "",
    username: profileData.username || "",
    pronouns: profileData.pronouns || "",
    bio: profileData.bio || "",
    profilePicture: profileData.profilePicture || "",
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

    await setFormData((prevState) => ({
      ...prevState,
      profilePicture: downloadURL,
    }));
  };

  const handleReauthentication = async (password) => {
    const user = auth.currentUser;

    if (user) {
      // Prompt the user to re-provide their sign-in credentials
      const credentials = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        console.log("Re-authentication successful");
      } catch (error) {
        console.error("Error re-authenticating:", error);
        // Handle the error, and possibly prompt the user to sign in again
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Re-authenticate the user
      await handleReauthentication(password);
  
      const user = auth.currentUser;
  
      // Delete the user's reviews from Firestore
      let batch1 = writeBatch(db);
      const reviewsQuery = query(collection(db, 'reviews'), where('uid', '==', user.uid));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      reviewsSnapshot.forEach((doc) => {
        batch1.delete(doc.ref);
      });
      await batch1.commit();
  
      // Remove the user's UID from the "follows" array of all other users
      let batch2 = writeBatch(db);
      const followersQuery = query(collection(db, 'profileData'), where('follows', 'array-contains', user.uid));
      const followersSnapshot = await getDocs(followersQuery);
      followersSnapshot.forEach((doc) => {
        batch2.update(doc.ref, {
          follows: arrayRemove(user.uid)
        });
      });
      await batch2.commit();
  
      // Delete the user's document from Firestore
      const userDocRef = doc(db, "profileData", user.uid);
      await deleteDoc(userDocRef);
  
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      try {
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn("No profile picture found to delete.", storageError);
      }
  
      // Delete the user's account from Firebase Authentication
      await deleteUser(user);
  
      // Redirect to the login page after successful deletion
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError(error.message || "Error deleting account");
    }
  };
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = { ...formData };

    // Update Firestore with new data
    const docRef = doc(db, "profileData", uid);
    await setDoc(docRef, updatedFormData, { merge: true });

    // Update the profileData state with the new data
    await setProfileData((prevProfileData) => ({
      ...prevProfileData,
      ...updatedFormData,
      profilePicture: updatedFormData.profilePicture,
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
        height: 700,
        width: 700,
        backgroundColor: "grey",
      }}
    >
      {(close) => (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="pronouns">Pronouns:</label>
              <input
                type="text"
                name="pronouns"
                id="pronouns"
                placeholder="Enter Pronouns"
                value={formData.pronouns}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="bio">Bio:</label>
              <input
                type="text"
                name="bio"
                id="bio"
                placeholder="Enter Bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                name="profilePicture"
                id="profilePicture"
              />
            </div>
            <button className="deleteButton" onClick={openDeleteModal}>
              Delete Account
            </button>
            <button type="submit">Save</button>
            <button
              type="close"
              onClick={() => {
                if (hasChanges) {
                  setHasChanges(false);
                  handleSubmit();
                  window.location.reload();
                }
                close();
              }}
            >
              Close
            </button>
          </form>

          {showDeleteModal && (
            <div className="delete-account-modal">
              <div className="delete-account-modal-content">
                <span className="close" onClick={closeDeleteModal}>
                  &times;
                </span>
                <p>
                  Are you sure you want to delete your account? Please enter
                  your password to confirm. This action is irreversible.
                </p>
                {deleteError && <p className="error-message">{deleteError}</p>}
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                />
                <button onClick={handleDeleteAccount}>Confirm Deletion</button>
                <button onClick={closeDeleteModal}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Popup>
  );
}
