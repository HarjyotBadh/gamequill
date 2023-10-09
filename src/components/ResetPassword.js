import React, { useState } from "react";
import "./ResetPassword.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Password reset logic here (e.g., send a reset email)
    // You can add code to handle the password reset process
    setResetSuccess(true);
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
        </form>
      )}
    </div>
  );
}

export default ResetPassword;