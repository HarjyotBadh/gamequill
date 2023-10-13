import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
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

        setFormData((prevState) => ({
            ...prevState,
            profilePicture: downloadURL,
        }));
    };

    const handleReauthentication = async (password) => {
        const user = auth.currentUser;

        if (user) {
            // Prompt the user to re-provide their sign-in credentials
            const credentials = EmailAuthProvider.credential(
                user.email,
                password
            );
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

            // Delete the user's document from Firestore
            const userDocRef = doc(db, "profileData", user.uid);
            await deleteDoc(userDocRef);

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
                                name="username"
                                placeholder="Enter Username"
                                value={formData.username}
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
                        <button onClick={openDeleteModal}>
                            Delete Account
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

                    {showDeleteModal && (
                        <div className="delete-account-modal">
                            <div className="delete-account-modal-content">
                                <span
                                    className="close"
                                    onClick={closeDeleteModal}
                                >
                                    &times;
                                </span>
                                <p>
                                    Are you sure you want to delete your
                                    account? Please enter your password to
                                    confirm. This action is irreversible.
                                </p>
                                {deleteError && (
                                    <p className="error-message">
                                        {deleteError}
                                    </p>
                                )}
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your password"
                                />
                                <button onClick={handleDeleteAccount}>
                                    Confirm Deletion
                                </button>
                                <button onClick={closeDeleteModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Popup>
    );
}
