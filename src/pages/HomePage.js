import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import HomeTrending from "../components/HomeTrending";
import HomeActivity from "../components/HomeActivity";
import HomeRecommend from "../components/HomeRecommend";
import "../styles/HomePage.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer from "../components/Footer";
import HomePerRecommend from "../components/HomePerRecommend";

function App() {
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is already signed in:", user);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <div>
      <NavBar />
      <div class="grid-container">
        {/* <div class="grid-pad"></div> */}
        <div class="grid-featured">
          <HomeTrending />
        </div>
        <div class="grid-activity">
          <HomeActivity />
        </div>
        {/* <div class="grid-pad"></div> */}
        {/* <div class="grid-pad"></div> */}
        <div class="grid-recommend">
          <HomePerRecommend />
          <HomeRecommend />
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default App;
