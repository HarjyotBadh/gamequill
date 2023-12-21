import React, { useState, useEffect } from "react";
import UpcomingItem from "./UpcomingItem"
import NoCover from "../images/temp_images/Default_No_Image_Available_Vertical.jpg"
import "../styles/HomeUpcoming.css"
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

export default function HomeUpcoming() {
  const [upcomingGames, setUpcomingGames] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        console.log("theuserId from HU:  " + theuserId);
        getGames(theuserId);
      } else {
        // not logged in
      }
    });

    const getGames = async (userId) => {
      try {
        // const apiUrl = "http://localhost:8080/https://api.igdb.com/v4/games";
        const apiUrl = "https://api.igdb.com/v4/release_dates";

        let arr = new Array(6);
        console.log("arr size:  " + arr.length);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRange = 2600000; // one month is about 2.6 million seconds
        const futureTime = currentTime + timeRange;
        console.log("currentTime:  " + currentTime);
        console.log("futureTime:  " + futureTime);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
            Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo",
          },
          body: `fields game.*, game.cover.url, date, platform; where date > ${currentTime}; sort date asc; limit 100;`,
        });


        const gameResults = await response.json();

        let gameRandom = gameResults.sort(() => Math.random() - 0.5);
        gameRandom = gameResults.slice(0, 6);

        console.log(gameRandom);

        setUpcomingGames(gameRandom);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  const formatCoverUrl = (url) => {
        if (url) {
            return url.replace("/t_thumb/", "/t_cover_big/");
        } else {
            return NoCover;
        }
    };

  return (
    <div class="upcoming-container">
      <h1 className="trending-head">UPCOMING GAMES</h1>
      <div class="upcoming-grid">
        {upcomingGames.map((gameData, index) => (
          <div key={index}>
            <UpcomingItem
              name={gameData.game?.name}
              cover={formatCoverUrl(gameData.game?.cover?.url)}
              gameid={gameData.game?.id || ""}
              ti={gameData?.date}
              platform={
                gameData.platform ? gameData.platform : "No Platform Specified"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
