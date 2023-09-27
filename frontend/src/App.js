import NavBar from "./components/NavBar";
import React from "react";
import { Route, Routes } from 'react-router-dom';

function App() {
  return <Routes>
    <Route path="/" element={<NavBar />} />
    {/* <Route path="/login" element={<Login />} />   If you are url /login -> This will bring you to the Login Page
    <Route path="*" element={<ErrorPage />} />        If you are at any other URL -> Bring you to 404 Error*/}
    <Route path="/test" element = {<h1>Test</h1>} />   {/* If you are at /test -> This will bring you to the Test Page */}
  </Routes>;
    
}
export default App;
