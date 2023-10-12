import React from "react";
import "../styles/HomeRecommend.css";
import UserRecommend from "./UserRecommend";

function App() {

    return (
        <div class="recommend-container">
            <h1 class="trending-head">BASED ON YOUR FAVORITE GENRES</h1>
            <div class="recommend-grid">
                <div><UserRecommend genre={"Action"} /></div>
                <div><UserRecommend /></div>
                <div><UserRecommend /></div>
                <div><UserRecommend /></div>
            </div>
        </div>
    )

}
export default App;