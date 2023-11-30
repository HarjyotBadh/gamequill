import React, { useState, useEffect } from "react";
import {
    setDoc,
    doc,
    deleteDoc,
    query,
    collection,
    where,
    getDocs,
    writeBatch,
    arrayRemove,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
    getAuth,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";
import { db } from "../firebase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import "../styles/EditProfile.css";

const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "var(--rating-color)",
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "var(--rating-color)",
        },
    },
});

export default function EditProfile({ profileData, setProfileData }) {
    const auth = getAuth();
    var uid;
    uid = auth.currentUser.uid;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [notificationSettings, setNotificationSettings] = useState({
        steam: true,
        playstation: true,
        xbox: true,
    });

    // Handle change in notification settings
    const handleNotificationChange = (platform) => (event) => {
        setNotificationSettings(prevSettings => ({
            ...prevSettings,
            [platform]: event.target.checked,
        }));
    };

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
        setNotificationSettings({
            steam: profileData.notificationPreferences?.steam ?? true,
            playstation: profileData.notificationPreferences?.playstation ?? true,
            xbox: profileData.notificationPreferences?.xbox ?? true,
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
            const credentials = EmailAuthProvider.credential(user.email, password);
            try {
                await reauthenticateWithCredential(user, credentials);
                console.log("Re-authentication successful");
                return true; // Reauthentication successful
            } catch (error) {
                console.error("Error re-authenticating:", error);
                return false; // Reauthentication failed
            }
        }
        return false; // User not found
    };

    const handleDeleteAccount = async () => {
        try {
            // Re-authenticate the user
            const reauthSuccess = await handleReauthentication(password);

            if (!reauthSuccess) {
                console.error("Re-authentication failed. Cannot delete account.");
                setDeleteError("Re-authentication failed. Cannot delete account.");
                return; // Exit the function if reauthentication failed
            }

            const user = auth.currentUser;

            // Delete the user's reviews from Firestore
            let batch1 = writeBatch(db);
            const reviewsQuery = query(collection(db, "reviews"), where("uid", "==", user.uid));
            const reviewsSnapshot = await getDocs(reviewsQuery);
            reviewsSnapshot.forEach((doc) => {
                batch1.delete(doc.ref);
            });
            await batch1.commit();

            // Remove the user's UID from the "follows" array of all other users
            let batch2 = writeBatch(db);
            const followersQuery = query(
                collection(db, "profileData"),
                where("follows", "array-contains", user.uid)
            );
            const followersSnapshot = await getDocs(followersQuery);
            followersSnapshot.forEach((doc) => {
                batch2.update(doc.ref, {
                    follows: arrayRemove(user.uid),
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Merge formData with notificationSettings
        const updatedData = {
            ...formData,
            notificationPreferences: notificationSettings,
            usernameLowerCase: formData.username.toLowerCase(),
        };

        // Update Firestore with new data
        const docRef = doc(db, "profileData", uid);
        await setDoc(docRef, updatedData, { merge: true });

        // Update the profileData state with the new data
        setProfileData((prevProfileData) => ({
            ...prevProfileData,
            ...updatedData,
            profilePicture: updatedData.profilePicture,
        }));

        // Close the modal
        setShowModal(false);

    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => setShowModal(true)}
                style={{
                    margin: "4px",
                    padding: "8px 16px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: "gray",
                    width: "200px",
                    textTransform: "none",
                }}
            >
                Edit Profile
            </Button>

            <Dialog
                open={showModal}
                onClose={() => setShowModal(false)}
                maxWidth="md"
                PaperProps={{
                    style: {
                        backgroundColor: "var(--wrapper)",
                        color: "var(--text-color)",
                        borderRadius: "10px",
                        padding: "20px",
                    },
                }}
            >
                <DialogTitle>Edit Profile</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText
                            style={{
                                color: "var(--secondary-text-color)",
                            }}
                        >
                            Update your profile details.
                        </DialogContentText>
                        <CustomTextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            // Change the color of the text to white
                            InputLabelProps={{
                                style: {
                                    color: "var(--text-color)",
                                },
                            }}
                            // Change the color of the underline to white
                            InputProps={{
                                style: {
                                    color: "var(--secondary-text-color)",
                                    backgroundColor: "var(--background)",
                                },
                            }}
                        />
                        <CustomTextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                style: {
                                    color: "var(--text-color)",
                                },
                            }}
                            // Change the color of the underline to white
                            InputProps={{
                                style: {
                                    color: "var(--secondary-text-color)",
                                    backgroundColor: "var(--background)",
                                },
                            }}
                        />
                        <CustomTextField
                            label="Pronouns"
                            name="pronouns"
                            value={formData.pronouns}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                style: {
                                    color: "var(--text-color)",
                                },
                            }}
                            // Change the color of the underline to white
                            InputProps={{
                                style: {
                                    color: "var(--secondary-text-color)",
                                    backgroundColor: "var(--background)",
                                },
                            }}
                        />
                        <CustomTextField
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            margin="normal"
                            InputLabelProps={{
                                style: {
                                    color: "var(--text-color)",
                                },
                            }}
                            // Change the color of the underline to white
                            InputProps={{
                                style: {
                                    color: "var(--secondary-text-color)",
                                    backgroundColor: "var(--background)",
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            // margin="normal"
                            style={{
                                backgroundColor: "var(--rating-color)",
                            }}
                        >
                            Upload Profile Picture
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileUpload}
                            />
                        </Button>
                    </DialogContent>

                    <DialogContent
                        style={{
                            backgroundColor: "var(--background)",
                            color: "var(--text-color)",
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
                            Sales Notification Settings
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.steam}
                                        onChange={handleNotificationChange("steam")}
                                        name="steam"
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "var(--rating-color)",
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                {
                                                    backgroundColor: "var(--rating-color)",
                                                },
                                            "& .MuiSwitch-switchBase.Mui-checked:hover": {
                                                backgroundColor:
                                                    "rgba(var(--rating-color-rgb), 0.08)",
                                            },
                                        }}
                                    />
                                }
                                label="Steam Sales Notifications"
                                sx={{
                                    ".MuiFormControlLabel-label": {
                                        color: "var(--secondary-text-color)",
                                    },
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.playstation}
                                        onChange={handleNotificationChange("playstation")}
                                        name="playstation"
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "var(--rating-color)",
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                {
                                                    backgroundColor: "var(--rating-color)",
                                                },
                                            "& .MuiSwitch-switchBase.Mui-checked:hover": {
                                                backgroundColor:
                                                    "rgba(var(--rating-color-rgb), 0.08)",
                                            },
                                        }}
                                    />
                                }
                                label="PlayStation Sales Notifications"
                                sx={{
                                    ".MuiFormControlLabel-label": {
                                        color: "var(--secondary-text-color)",
                                    },
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.xbox}
                                        onChange={handleNotificationChange("xbox")}
                                        name="xbox"
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "var(--rating-color)",
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                {
                                                    backgroundColor: "var(--rating-color)",
                                                },
                                            "& .MuiSwitch-switchBase.Mui-checked:hover": {
                                                backgroundColor:
                                                    "rgba(var(--rating-color-rgb), 0.08)",
                                            },
                                        }}
                                    />
                                }
                                label="Xbox Sales Notifications"
                                sx={{
                                    ".MuiFormControlLabel-label": {
                                        color: "var(--secondary-text-color)",
                                    },
                                }}
                            />
                        </FormGroup>
                    </DialogContent>

                    <DialogActions style={{ justifyContent: "space-between" }}>
                        <Button
                            onClick={openDeleteModal}
                            style={{
                                backgroundColor: "#eb4034",
                                color: "white",
                                borderRadius: "10px",
                            }}
                        >
                            Delete Account
                        </Button>
                        <div>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: "var(--rating-color)",
                                    color: "white",
                                    marginRight: "8px",
                                    borderRadius: "10px",
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => setShowModal(false)}
                                style={{
                                    backgroundColor: "var(--rating-color)",
                                    color: "white",
                                    borderRadius: "10px",
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={showDeleteModal}
                onClose={closeDeleteModal}
                PaperProps={{
                    style: {
                        backgroundColor: "var(--wrapper)",
                        color: "var(--text-color)",
                    },
                }}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        style={{
                            color: "var(--secondary-text-color)",
                        }}
                    >
                        Are you sure you want to delete your account? Please enter your password to
                        confirm. This action is irreversible.
                    </DialogContentText>
                    <CustomTextField
                        type="password"
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            style: {
                                color: "var(--text-color)",
                            },
                        }}
                        // Change the color of the underline to white
                        InputProps={{
                            style: {
                                color: "var(--secondary-text-color)",
                                backgroundColor: "var(--background)",
                            },
                        }}
                    />
                    {deleteError && <p className="error-message">{deleteError}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeleteAccount}
                        style={{
                            backgroundColor: "#eb4034",
                            color: "white",
                        }}
                    >
                        Confirm Deletion
                    </Button>
                    <Button
                        onClick={closeDeleteModal}
                        style={{
                            backgroundColor: "var(--rating-color)",
                            color: "white",
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
