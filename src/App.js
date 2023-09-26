import React from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { Route, Routes } from 'react-router-dom';

function App() {
  return <Routes>
    <Route path="/" element = {<NavBar />} />
    <Route path="/test" element = {<h1>test</h1>} />
    <Route path="/home" element = {<HomePage />} />
  </Routes>;
}
export default App;
