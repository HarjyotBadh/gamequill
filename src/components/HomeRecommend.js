import React from "react";
import "../styles/HomeRecommend.css";
import UserRecommend from "./UserRecommend";
import i11 from "../images/temp_images/11.png";
import i12 from "../images/temp_images/12.png";
import i13 from "../images/temp_images/13.png";
import i21 from "../images/temp_images/21.png";
import i22 from "../images/temp_images/22.png";
import i23 from "../images/temp_images/23.png";
import i31 from "../images/temp_images/31.png";
import i32 from "../images/temp_images/32.png";
import i33 from "../images/temp_images/33.png";
import i41 from "../images/temp_images/41.png";
import i42 from "../images/temp_images/42.png";
import i43 from "../images/temp_images/43.png";

function App() {

    return (
        <div class="recommend-container">
            <h1 class="trending-head">BASED ON YOUR FAVORITE GENRES</h1>
            <div class="recommend-grid">
                <div><UserRecommend genre={"Real Time Strategy (RTS)"} c1={i11} c2={i12} c3={i13} i1={15123} i2={3568} i3={2239} /></div>
                <div><UserRecommend genre={"Adventure"} c1={i21} c2={i22} c3={i23} i1={204627} i2={165192} i3={22439}/></div>
                <div><UserRecommend genre={"Indie"} c1={i31} c2={i32} c3={i33} i1={235846} i2={124031} i3={27034}/></div>
                <div><UserRecommend genre={"Puzzle"} c1={i41} c2={i42} c3={i43} i1={192731} i2={198499} i3={8750}/></div>
            </div>
        </div>
    )

}
export default App;