import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import HomeTrending from "../components/HomeTrending";
import HomeActivity from "../components/HomeActivity";
import HomeRecommend from "../components/HomeRecommend";
import "../styles/HomePage.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer from "../components/Footer";
import HomePerRecommend from "../components/HomePerRecommend";
import HomeUpcoming from "../components/HomeUpcoming";

function App() {
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <div className="shitty-background-fix">
      <NavBar />
      <div className="grid-container">
        {/* <div className="grid-pad"></div> */}
        <div className="grid-featured">
          <HomeTrending />
        </div>
        <div className="grid-activity">
          <HomeActivity />
        </div>
        {/* <div className="grid-pad"></div> */}
        {/* <div className="grid-pad"></div> */}
        <div className="grid-recommend">
          <HomePerRecommend />
          <HomeRecommend />
        </div>
        <div className="grid-upcoming">
          <HomeUpcoming />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default App;
