import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import gamequillLogo from "../images/gamequill.png";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // login logic here
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <img src={gamequillLogo} alt="GameQuill Logo" className="image-container" />
      <h1 className="login-page-title">Login Page</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-input">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
      <p>
        Don't have an account? <br /> Sign up{" "}
        <Link to="/register" className="link-to-register">
         here
        </Link>
      </p>
    </div>
  );
}


export default Login;
