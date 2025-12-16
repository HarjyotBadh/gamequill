import React, { useState, useEffect } from "react";
import UpcomingItem from "./UpcomingItem";
import NoCover from "../images/temp_images/Default_No_Image_Available_Vertical.jpg";
import "../styles/HomeUpcoming.css";
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

export default function HomeUpcoming() {
  const [upcomingGames, setUpcomingGames] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getGames = async (userId) => {
      try {
        const apiUrl = "https://api.igdb.com/v4/release_dates";

        let arr = new Array(6);
        console.log("arr size:  " + arr.length);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRange = 2600000;
        const futureTime = currentTime + timeRange;
        console.log("currentTime:  " + currentTime);
        console.log("futureTime:  " + futureTime);
        const ob = {
          igdbquery: `fields game.*, game.cover.url, game.hypes, date, platform; where date > ${currentTime} & game.hypes > 5; sort game.hypes desc; limit 50;`,
        };
        const functionUrl =
          "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBDates";

        const response = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ob),
        });
        const data = await response.json();
        const igdbResponse = data.data;
        const gameResults = igdbResponse;

        let gameRandom = gameResults.sort(() => Math.random() - 0.5);
        gameRandom = gameResults.slice(0, 6);

        console.log(gameRandom);

        if (isMounted) setUpcomingGames(gameRandom);
      } catch (error) {
        console.error(error);
      }
    };

    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log("theuserId from HU:  " + currentUser.uid);
      getGames(currentUser.uid);
    } else {
      const unsub = auth.onAuthStateChanged((authObj) => {
        if (authObj && isMounted) {
          console.log("theuserId from HU:  " + authObj.uid);
          getGames(authObj.uid);
        }
        unsub();
      });
    }

    return () => {
      isMounted = false;
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
    <div className="upcoming-container">
      <h1 className="trending-head text-gradient">UPCOMING GAMES</h1>
      <div className="upcoming-grid">
        {upcomingGames.map((gameData, index) => (
          <div key={gameData.game?.id || index}>
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
