import React from "react";
import NavBar from "../components/NavBar";
import HomeTrending from "../components/HomeTrending";
import "../styles/HomePage.css";

function App() {
    return (
        <div>
            <NavBar />
            <div class="grid-container">
            <div class="grid-pad">1</div>
            <div class="grid-featured"><HomeTrending /></div>
            <div class="grid-activity">8, 9, 10, 11</div>
            <div class="grid-pad">12</div>
</div>
        </div>
    );
}
export default App;
