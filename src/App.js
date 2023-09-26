import NavBar from "./components/NavBar";
import GamePage from "./pages/GamePage";
import React from "react";
import { Route, Routes } from 'react-router-dom';

function App() {
  return <Routes>
    <Route path="/" element={<NavBar />} />
    <Route path="/test" element = {<h1>Test</h1>} />   {/* If you are at /test -> This will bring you to the Test Page */}
    <Route path="/game" element={<GamePage />} />
  </Routes>;
    
}
export default App;
