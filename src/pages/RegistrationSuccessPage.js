import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/SuccessRegPage.css";

export default function RegistrationSuccessPage() {
  return (
    <div className="success-container">
      <div className="success-card">
        <h2 className="success-title">Registration Successful!</h2>
        <p className="success-message">
          A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.
        </p>
        <Link to="/login">
          <button className="success-button">Go to Login</button>
        </Link>
      </div>
    </div>
  );
}
