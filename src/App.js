import NavBar from "./components/NavBar";
import ProfilePage from "./pages/ProfilePage";
import React from "react";
import { Route, Routes } from 'react-router-dom';
import Login from "./components/Login"; // Import your Login component
import Register from "./components/Register"; // Import your Register componen


function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />} />
      <Route
        path="/Profile"
        element={<ProfilePage accountNumber="GPiU3AHpvyOhnbsVSzap" />}
      />
      {/* <Route path="/login" element={<Login />} />   If you are url /login -> This will bring you to the Login Page
    <Route path="*" element={<ErrorPage />} />        If you are at any other URL -> Bring you to 404 Error*/}
    <Route path="/test" element = {<h1>Test</h1>} />   {/* If you are at /test -> This will bring you to the Test Page */}
    <Route path="/login" element={<Login />} /> {/* This will render the Login component */}
    <Route path="/register" element={<Register />} /> {/* This will take you to register page*/}
  </Routes>;
    
}
export default App;
