import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../styles/logout.css"; // Import the CSS file
import "../styles/Login.css";

function Logout() {
  const auth = getAuth();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = async () => {
    setShowConfirmation(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <h1>Logout Page</h1>
      <button
        onClick={handleLogout}
        className="link-to-register" 
      >
        Log Out
      </button>
      <br />
      <Link to="/">Go back to Home</Link>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="popup-container">
          <div className="popup">
            <p>Are you sure you want to log out?</p>
            <button onClick={confirmLogout}>Yes</button>
            <button onClick={cancelLogout}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logout;
