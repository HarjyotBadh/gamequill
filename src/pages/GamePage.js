import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import MediaPlayer from "../components/MediaPlayer";
import DescriptionBox from "../components/DescriptionBox";
import "../styles/GamePage.css";
import TestComponent from "../components/TestComponent";

export default function GamePage({ game_id }) {
  const [gameData, setGameData] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [videos, setVideos] = useState([]);
  const [searchParams] = useSearchParams();
  game_id = searchParams.get("game_id");
  console.log("The game id is: " + game_id);

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

  const sample_id = 119388;
  // Cyberpunk 2077: 1877
  // ToTK: 119388
  // Starfield: 96437
  // Minecraft: 135400
  // Skyrim: 165192

  // game_id = sample_id;

  // Sets dark mode based on user's system preferences
  const [darkMode, setDarkMode] = React.useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sets dark mode based on user's system preferences
  React.useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDarkMode(e.matches);

    matcher.addListener(onChange);

    return () => {
      matcher.removeListener(onChange);
    };
  }, []);

  // Fetch game data from IGDB API
  useEffect(() => {
    const corsAnywhereUrl = "http://localhost:8080/";
    const apiUrl = "https://api.igdb.com/v4/games";

    fetch(corsAnywhereUrl + apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
      },
      body: `
                fields name,cover.url,involved_companies.company.name,rating,aggregated_rating,screenshots.url,videos.video_id,genres.name,summary,storyline,platforms.name,age_ratings.*,age_ratings.content_descriptions.*;
                    where id = ${game_id};
                    `,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          const game = data[0];
          setGameData(game);

          // Get screenshots URLs
          const screenshotUrls = game.screenshots
            ? game.screenshots.map((s) => s.url.replace("t_thumb", "t_1080p"))
            : [];
          setScreenshots(screenshotUrls);

          // Get video IDs
          const videoIds = game.videos
            ? game.videos.map((v) => v.video_id)
            : [];
          setVideos(videoIds);

          console.log("summary: " + screenshotUrls);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [game_id]);

  return (
    <div
      className={`game-page-wrapper ${darkMode ? "dark" : "light"}`}
      data-theme={darkMode ? "dark" : "light"}
    >
      <NavBar />

      <div className="game-content-container">
        <div className="left-content">
          <TitleCard gameData={gameData} />
          <MediaPlayer screenshots={screenshots} youtubeLinks={videos} />
        </div>

        <div className="right-content">
          <DescriptionBox gameData={gameData} />
        </div>
      </div>
    </div>
  );
}
