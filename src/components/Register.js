import React, { useState } from "react";
import { Link } from "react-router-dom";
import gamequillLogo from "../images/gamequill.png";
import "../styles/Register.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState(""); // Separate email error state
  const [showPopup, setShowPopup] = useState(false);

  const checkUsernameAvailability = async (proposedUsername) => {
    const firestore = getFirestore();
    const usersCollection = collection(firestore, "profileData");

    const q = query(usersCollection, where("username", "==", proposedUsername));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setUsernameError("Username is already taken");
      return false;
    }

    setUsernameError("");
    return true;
  };

  const checkEmailAvailability = async (proposedEmail) => {
    const firestore = getFirestore();
    const usersCollection = collection(firestore, "profileData");

    const q = query(usersCollection, where("email", "==", proposedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setEmailError("Email is already in use"); // Set the email error message
      return false;
    }

    setEmailError(""); // Clear the email error if email is available
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    setPasswordError("");
    setPasswordMatchError("");
    setRegistrationError("");
    setUsernameError("");

    const isEmailAvailable = await checkEmailAvailability(email);

    if (!isEmailAvailable) {
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(username);

    if (!isUsernameAvailable) {
      return;
    }

    const auth = getAuth();
    const firestore = getFirestore();
    const profileDataCollection = collection(firestore, "profileData"); // Change the collection reference to "profileData"

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      const userData = {
        bio: "",
        username,
        usernameLowerCase: username.toLowerCase(),
        email,
        pronouns: "",
        favoriteGames: ["", "", "", ""],
        favoriteGenres: ["", "", "", ""],
        currentlyPlayingGame: "",
        name: "",
        profilePicture:
          "https://firebasestorage.googleapis.com/v0/b/gamequill-3bab8.appspot.com/o/profilePictures%2FdefaultProfilePicture.png?alt=media&token=3d964f48-c8b6-4fab-8f5e-d7ebf6addc61",
      };

      // Store user data in Firestore
      await setDoc(doc(profileDataCollection, user.uid), userData); // make sure to use user.uid

      console.log("Registration successful. Verification email sent:", user);

      window.location.href = "/registrationsuccess"; // You might want to change this part to wait until the user verifies their email.
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration failed:", errorCode, errorMessage);
      setRegistrationError(errorMessage);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="register-container">
      <img
        src={gamequillLogo}
        alt="GameQuill Logo"
        className="image-container"
      />
      <h1 className="register-title">Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-input">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameError && <p className="error-message">{usernameError}</p>}
        </div>
        <div className="form-input">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
        <div className="form-input">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>
        <div className="form-input">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {registrationError && showPopup && (
        <div className="popup-container">
          <div className="popup">
            <p className="popup-message">{registrationError}</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
      <p>
        Already have an account? <br />{" "}
        <Link to="/login" className="link-to-login">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Register;
