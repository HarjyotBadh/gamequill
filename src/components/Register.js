import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import gamequillLogo from "../images/gamequill.png";
import "./Register.css"; // Import the CSS file
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    console.log("Submit button clicked");
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Registration successful:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Registration failed:", errorCode, errorMessage);
      });
  };

  return (
    <div className="register-container">
      <img src={gamequillLogo} alt="GameQuill Logo" className="logo" />
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
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
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
