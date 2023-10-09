import React from "react";
import NavBar from "../components/NavBar";
import HomeTrending from "../components/HomeTrending";
import HomeActivity from "../components/HomeActivity";
import "../styles/HomePage.css";

function App() {
    return (
        <div>
            <NavBar />
            <div class="grid-container">
                <div class="grid-pad"></div>
                <div class="grid-featured"><HomeTrending /></div>
                <div class="grid-activity"><HomeActivity /></div>
                <div class="grid-pad"></div>
            </div>
        </div>
    );
}
export default App;
