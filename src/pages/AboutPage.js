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
                    <img class="about-img" src={tempcover} alt="what?" />
                    <div class="about-text">
                        <h4 class="about-name">HARJYOT BADH</h4>
                        <p>"This is Harjyot's bio/testimonial. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                    </div>
                </div>
                <div class="about-bio">
                    
                    <div class="about-text">
                        <h4 class="about-name">JACK FURMANEK</h4>
                        <p>Jack Furmanek is a Computer Science student at Purdue University, and also pursuing a minor in Mathematics. In his free time, he likes to play video games, watch TV shows, and build LEGO sets. Jack is interested in frontend programming, graphic design, and the user experience. He was responsible for the general layout of the home page, defining the site's visual style. He also designed some of the site's icons, including the ones for genres.</p>
                    </div>
                    <img class="about-img" src={tempcover} alt="what?" />
                </div>
                <div class="about-bio">
                    <img class="about-img" src={tempcover} alt="what?" />
                    <div class="about-text">
                        <h4 class="about-name">BAILEY HARRELL</h4>
                        <p>"This is Bailey's bio/testimonial. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                    </div>
                </div>
                <div class="about-bio">
                    
                    <div class="about-text">
                        <h4 class="about-name">AAYUSH NARAYANAN</h4>
                        <p>"This is Aayush's bio/testimonial. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                    </div>
                    <img class="about-img" src={tempcover} alt="what?" />
                </div>
            </div>

            <Footer />
        </div>
    )
}
