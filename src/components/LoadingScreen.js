import React from "react";
import "../styles/LoadingScreen.css";
import logo from "../images/gamequill.png";

export default function LoadingScreen() {
  return (
    <div className="loading-screen-container">
      <img src={logo} alt="GameQuill Logo" className="loading-logo" />
      <h3>Loading...</h3>
    </div>
  );
}
