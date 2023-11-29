import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import tempcover from "../images/temp_images/tempcover.png";
import TitleCard from "../components/TitleCard";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import "../styles/AboutPage.css";
import { useFormControl } from "@mui/material";

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
          The functionality of this website wouldn't be possible without the
          combined efforts of its four developers. Read about each of them here:
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
              "This is Jack's bio/testimonial. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum."
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
              "Bailey Harrell is a Computer Science Student at Purdue University
              with a concentration in Software Engineering and Computer
              Graphics. He also is pursuing a minor in Film and Video Studies.
              Bailey was born and raised in Fort Worth, Texas, and came to
              Purdue for school. For GameQuill, Bailey worked primarily on the
              Profile Page, Lists, and the Search Page. Bailey's favorite game
              is Marvel's Spider-Man 2 because Spider-Man is his all time
              favorite fictional character. An avid cinephile, Bailey enjoys
              watching movies and writing reviews on Letterboxd. He came up with
              the idea for GameQuill from utilizing this app so often, and many
              of the features were directly inspired from that application."
            </p>
          </div>
        </div>
        <div class="about-bio">
          <div class="about-text">
            <h4 class="about-name">AAYUSH NARAYANAN</h4>
            <p>
              "This is Aayush's bio/testimonial. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum."
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
