import NavBar from "./components/NavBar";
import GamePageWrapper from "./components/GamePageWrapper";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login"; // Import your Login component
import Register from "./components/Register"; // Import your Register componen
import ResetPassword from "./components/ResetPassword"; // Import the ResetPassword component

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/test" element={<h1>Test</h1>} />{" "}
      <Route path="/login" element={<Login />} />{" "}
      <Route path="/register" element={<Register />} />{" "}
      <Route path="/reset-password" element={<ResetPassword />} />{" "}
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={<GamePageWrapper />} />
    </Routes>
  );

}

export default App;
