import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import tempcover from "../images/temp_images/tempcover.png";
import "../styles/AboutPage.css";

export default function AboutPage() {
    return (
        <div class="about-background">
            <NavBar />

            <div class="about-grid">
                <div class="about-meettheteam">
                    MEET THE TEAM
                </div>
                <div class="about-meettheteam-about">
                    The functionality of this website wouldn't be possible without the combined efforts of its four developers. Read about each of them here:
                </div>

                <div class="about-bio">
                    
                    <div class="about-text">
                        <h4 class="about-name">JACK FURMANEK</h4>
                        <p>Jack Furmanek is a Computer Science student at Purdue University, and also pursuing a minor in Mathematics. In his free time, he likes to play video games, watch TV shows, and build LEGO sets. Jack is interested in frontend programming, graphic design, and the user experience. He was responsible for the general layout of the home page, defining the site's visual style. He also designed some of the site's icons, including the ones for genres.</p>
                    </div>
                    <img class="about-img" src={tempcover} alt="what?" />
                </div>

            </div>

            <Footer />
        </div>
    )
}
