import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the email exists in Firebase Authentication
      const userExists = await checkIfEmailExists(email);

      if (userExists) {
        await sendPasswordResetEmail(auth, email);
        setResetSuccess(true);
        setResetError(null);
      } else {
        setResetSuccess(false);
        setResetError("Email not associated with any account.");
      }
    } catch (error) {
      setResetSuccess(false);
      setResetError(error.message);
    }
  };

  const checkIfEmailExists = async (email) => {
    try {
      // Implement a real check here using Firebase Authentication
      // For this example, let's assume the email exists if it's not empty
      return email !== "";
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {resetSuccess ? (
        <p>Password reset instructions sent to your email.</p>
      ) : (
        <form onSubmit={handleSubmit} className="reset-password-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
          {resetError && <p className="error-message">{resetError}</p>}
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
