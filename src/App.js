import GamePageWrapper from "./components/GamePageWrapper";
import ProfilePageWrapper from "./components/ProfilePageWrapper";
import HomePage from "./pages/HomePage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import SearchPageWrapper from "./components/SearchPageWrapper";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Profile" element={<ProfilePageWrapper />} />
      <Route path="/test" element={<h1>Test</h1>} />{" "}
      <Route path="/login" element={<Login />} />{" "}
      <Route path="/register" element={<Register />} />{" "}
      <Route path="/reset-password" element={<ResetPassword />} />{" "}
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={<GamePageWrapper />} />
      <Route
        path="/registrationsuccess"
        element={<RegistrationSuccessPage />}
      />
      <Route path="/search" element={<SearchPageWrapper />} />
    </Routes>
  );
}

export default App;
