import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import gamequillLogo from "../images/gamequill.png";
import "../styles/Login.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"; // Import Firebase Authentication

function Login() {
  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState(""); // Add password state
  const [loginError, setLoginError] = useState(""); // State for login error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await setPersistence(auth, browserLocalPersistence); // Set persistence to local
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // User is successfully logged in here
      if (userCredential.user) {
        // If user exists
        console.log("User exists");
        window.location.href = "/home";
      } else {
        // If user does not exist
        console.log("User does not exist");
      }
      window.location.href = "/home";
      // You can perform additional actions or navigate to another page upon successful login
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login failed:", errorCode, errorMessage);
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <img
        src={gamequillLogo}
        alt="GameQuill Logo"
        className="register-image-container"
      />
      <h1 className="login-page-title">Login Page</h1>
      <form onSubmit={handleSubmit} className="form-container">
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
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {loginError && <p className="error-message">{loginError}</p>}
      <p>
        Don't have an account? <br /> Sign up{" "}
        <Link to="/register" className="link-to-register">
          here
        </Link>
      </p>
      <p>
        Forgot your password? <br /> Reset it{" "}
        <Link to="/reset-password" className="link-to-register">
          here
        </Link>
      </p>
    </div>
  );
}

export default Login;
