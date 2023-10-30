import GamePageWrapper from "./components/GamePageWrapper";
import ProfilePageWrapper from "./components/ProfilePageWrapper";
import HomePage from "./pages/HomePage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import ReviewCreationPage from "./pages/ReviewCreationPage";
import SearchPageWrapper from "./components/SearchPageWrapper";
import RecentReviews from "./components/RecentReviews";
import ReviewDetail from "./components/ReviewDetail";
import ReviewPage from "./pages/ReviewPage";
import Wishlist from "./components/Wishlist"; // Add this import

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Profile" element={<ProfilePageWrapper />} />
      <Route path="/login" element={<Login />} />{" "}
      <Route path="/register" element={<Register />} />{" "}
      <Route path="/reset-password" element={<ResetPassword />} />{" "}
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={<GamePageWrapper />} />
      <Route path="/registrationsuccess" element={<RegistrationSuccessPage />} />
      <Route path="/recent-reviews" element={<RecentReviews />} />
      <Route path="/reviewcreation" element={<ReviewCreationPage />} />
      <Route path="/registrationsuccess" element={<RegistrationSuccessPage />} />
      <Route path="/search" element={<SearchPageWrapper />} />
      <Route path="/review/:review_id" element={<ReviewPage />} />
      <Route path="/wishlist" element={<Wishlist/>} />
    </Routes>
  );
}

export default App;
