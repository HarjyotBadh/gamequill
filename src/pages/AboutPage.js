import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TitleCard from "../components/TitleCard";
import { fetchMultipleGameData } from "../functions/GameFunctions";

export default function AboutPage() {
  const [gamesData, setGamesData] = useState([]);
  const game_ids = [142, 72, 127044, 40193];

  useEffect(() => {
    (async () => {
      const fetchedGamesData = await fetchMultipleGameData(game_ids);
      setGamesData(fetchedGamesData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wait until gamesData is populated to render the page.
  if (gamesData.length === 0) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            MEET THE TEAM
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: "var(--text-color)" }}
          >
            The functionality of this website wouldn't be possible without the
            combined efforts of its four developers. Read about each of them
            here:
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Harjyot */}
          <div className="card-global p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 max-w-xs flex-shrink-0">
              <TitleCard gameData={gamesData[0].game} />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h4 className="text-3xl font-bold mb-4 text-gradient">
                HARJYOT BADH
              </h4>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                "Harjyot Badh is a Computer Science Student at Purdue University
                with a concentration in Software Engineering and Machine
                Intelligence. He also is purusing a Certficiate in
                Entreprenuership and Innovation. He is a passionate gamer and
                loves to play games in his free time. For GameQuill, Harjyot
                worked on the backend and frontend of the website. He also
                worked on the database and the API. Harjyot worked primarly on
                the game page, review page, and notifications. Harjyot's
                favorite game is Star Wars Battlefront 2, the classic one.
                Spider-Man is his all time favorite fictional character."
              </p>
            </div>
          </div>

          {/* Jack */}
          <div className="card-global p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-grow text-center md:text-left order-2 md:order-1">
              <h4 className="text-3xl font-bold mb-4 text-gradient">
                JACK FURMANEK
              </h4>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                "Jack Furmanek is a Computer Science student at Purdue
                University, and also pursuing a minor in Mathematics. In his
                free time, he likes to play video games, watch TV shows, and
                build LEGO sets. Jack is interested in frontend programming,
                graphic design, and the user experience. He was responsible for
                the general layout of the home page, defining the site's visual
                style. He also designed some of the site's icons, including the
                ones for genres."
              </p>
            </div>
            <div className="w-full md:w-1/3 max-w-xs flex-shrink-0 order-1 md:order-2">
              <TitleCard gameData={gamesData[1].game} />
            </div>
          </div>

          {/* Bailey */}
          <div className="card-global p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 max-w-xs flex-shrink-0">
              <TitleCard gameData={gamesData[2].game} />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h4 className="text-3xl font-bold mb-4 text-gradient">
                BAILEY HARRELL
              </h4>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                "Bailey Harrell is a Computer Science Student at Purdue
                University with a concentration in Software Engineering and
                Computer Graphics. He also is pursuing a minor in Film and Video
                Studies. Bailey was born and raised in Fort Worth, Texas, and
                came to Purdue for school. For GameQuill, Bailey worked
                primarily on the Profile Page, Lists, and the Search Page.
                Bailey's favorite game is Marvel's Spider-Man 2 because
                Spider-Man is his all time favorite fictional character. An avid
                cinephile, Bailey enjoys watching movies and writing reviews on
                Letterboxd. He came up with the idea for GameQuill from
                utilizing this app so often, and many of the features were
                directly inspired from that application."
              </p>
            </div>
          </div>

          {/* Aayush */}
          <div className="card-global p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-grow text-center md:text-left order-2 md:order-1">
              <h4 className="text-3xl font-bold mb-4 text-gradient">
                AAYUSH NARAYANAN
              </h4>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                "Aayush Narayanan is a Computer Science Student at Purdue
                University with a concentration in Software Engineering and
                Machine Intelligence. Aayush was born and raised in Boston,
                Massachusetts, and came to Purdue for school. For GameQuill,
                Aayush worked primarily on the Authenticartion, Wishlist, Recent
                Activity, and Reposts. Aayush's favorite game is JJ Squawkers
                because it is extremely fun. In his free time, Aayush likes to
                play and watch basketball."
              </p>
            </div>
            <div className="w-full md:w-1/3 max-w-xs flex-shrink-0 order-1 md:order-2">
              <TitleCard gameData={gamesData[3].game} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
