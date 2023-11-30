import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TitleCard from "../components/TitleCard";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import "../styles/AboutPage.css";

export default function AboutPage() {
    const [gamesData, setGamesData] = useState([]);
    const game_ids = [142, 72, 127044, 40193];

    useEffect(() => {
        (async () => {
            const fetchedGamesData = await fetchMultipleGameData(game_ids);
            setGamesData(fetchedGamesData);
        })();
    }, []);

    // Wait until gamesData is populated to render the page.
    if (gamesData.length === 0) return <div>Loading...</div>;

    return (
        <div class="about-background">
            <NavBar />

            <div class="about-grid">
                <div class="about-meettheteam">MEET THE TEAM</div>
                <div class="about-meettheteam-about">
                    The functionality of this website wouldn't be possible without the combined
                    efforts of its four developers. Read about each of them here:
                </div>
                <div class="about-bio">
                    <div className="about-img">
                        <TitleCard gameData={gamesData[0].game} />
                    </div>
                    <div class="about-text">
                        <h4 class="about-name">HARJYOT BADH</h4>
                        <p>
                            "Harjyot Badh is a Computer Science Student at Purdue University with a
                            concentration in Software Engineering and Machine Intelligence. He also
                            is purusing a Certficiate in Entreprenuership and Innovation. He is a
                            passionate gamer and loves to play games in his free time. For
                            GameQuill, Harjyot worked on the backend and frontend of the website. He
                            also worked on the database and the API. Harjyot worked primarly on the
                            game page, review page, and notifications. Harjyot's favorite game is
                            Star Wars Battlefront 2, the classic one. Spider-Man is his all time
                            favorite fictional character."
                        </p>
                    </div>
                </div>
                <div class="about-bio">
                    <div class="about-text">
                        <h4 class="about-name">JACK FURMANEK</h4>
                        <p>
                            "Jack Furmanek is a Computer Science student at Purdue University, and
                            also pursuing a minor in Mathematics. In his free time, he likes to play
                            video games, watch TV shows, and build LEGO sets. Jack is interested in
                            frontend programming, graphic design, and the user experience. He was
                            responsible for the general layout of the home page, defining the site's
                            visual style. He also designed some of the site's icons, including the
                            ones for genres."
                        </p>
                    </div>
                    <div className="about-img">
                        <TitleCard gameData={gamesData[1].game} />
                    </div>
                </div>
                <div class="about-bio">
                    <div className="about-img">
                        <TitleCard gameData={gamesData[2].game} />
                    </div>
                    <div class="about-text">
                        <h4 class="about-name">BAILEY HARRELL</h4>
                        <p>
                            "Bailey Harrell is a Computer Science Student at Purdue University with
                            a concentration in Software Engineering and Computer Graphics. He also
                            is pursuing a minor in Film and Video Studies. Bailey was born and
                            raised in Fort Worth, Texas, and came to Purdue for school. For
                            GameQuill, Bailey worked primarily on the Profile Page, Lists, and the
                            Search Page. Bailey's favorite game is Marvel's Spider-Man 2 because
                            Spider-Man is his all time favorite fictional character. An avid
                            cinephile, Bailey enjoys watching movies and writing reviews on
                            Letterboxd. He came up with the idea for GameQuill from utilizing this
                            app so often, and many of the features were directly inspired from that
                            application."
                        </p>
                    </div>
                </div>
                <div class="about-bio">
                    <div class="about-text">
                        <h4 class="about-name">AAYUSH NARAYANAN</h4>
                        <p>
                            "Aayush Narayanan is a Computer Science Student at Purdue University
                            with a concentration in Software Engineering and Machine Intelligence.
                            Aayush was born and raised in Boston, Massachusetts, and came to Purdue
                            for school. For GameQuill, Aayush worked primarily on the
                            Authenticartion, Wishlist, Recent Activity, and Reposts. Aayush's
                            favorite game is JJ Squawkers because it is extremely fun. In his free
                            time, Aayush likes to play and watch basketball."
                        </p>
                    </div>
                    <div className="about-img">
                        <TitleCard gameData={gamesData[3].game} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
