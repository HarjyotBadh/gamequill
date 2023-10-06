import React, { useState, useEffect } from 'react';
import "../styles/HomeActivity.css";
import UserActivity from "./UserActivity";

function App() {
    const [gameCover0, setGameCover0] = useState(null);
    const [gameData0, setGameData0] = useState(null);
    const game_id = [7346, 2240, 2241];

    useEffect(() => {
        const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";
        fetch(
            corsAnywhereUrl + apiUrl,
            { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': '71i4578sjzpxfnbzejtdx85rek70p6',
                    'Authorization': 'Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp',
                },
                body: `
                    fields cover.url;
                    where id = ${game_id[0]};
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    const game = data[0];
                    setGameData0(game);

                    console.log("game.cover.url:  " + game.cover.url);
                    const gameUrl = game.cover.url.replace('t_thumb', 't_1080p');
                    setGameCover0(gameUrl);
                    console.log("gameCover0: " + gameCover0);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id[0]]);

    useEffect(() => {
        const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";
        fetch(
            corsAnywhereUrl + apiUrl,
            { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': '71i4578sjzpxfnbzejtdx85rek70p6',
                    'Authorization': 'Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp',
                },
                body: `
                    fields name,cover.url,involved_companies.company.name,rating,aggregated_rating;
                    where id = ${game_id[1]};
                `
            })
            .then(response => response.json())
            .then(data => {
                //if (data.length) setGameData1(data[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id[1]]);

    return (
        <div>
            <div class="activity-container">
                <h1>Your friends have liked...</h1>
                <div class="user-activity"><UserActivity cover={gameCover0}/></div>
                <div class="user-activity"><UserActivity /></div>
                <div class="user-activity"><UserActivity /></div>
            </div>
        </div>
    );
  }
  export default App;