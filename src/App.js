import NavBar from "./components/NavBar";
import GamePage from "./pages/GamePage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login"; // Import your Login component
import Register from "./components/Register"; // Import your Register componen

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/Profile"
        element={<ProfilePage accountNumber="GPiU3AHpvyOhnbsVSzap" />}
      />
      <Route path="/test" element={<h1>Test</h1>} />{" "}
      {/* If you are at /test -> This will bring you to the Test Page */}
      <Route path="/login" element={<Login />} />{" "}
      {/* This will render the Login component */}
      <Route path="/register" element={<Register />} />{" "}
      {/* This will take you to register page*/}
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}
export default App;
