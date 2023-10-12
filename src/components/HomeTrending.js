import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import "../styles/HomeTrending.css";
import Featured1 from "./Featured1";
import Featured2 from "./Featured2";

function App() {
    const [gameData0, setGameData0] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [gameData1, setGameData1] = useState(null);
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
                    fields name,screenshots.url,cover.url,rating,aggregated_rating,id;
                    where id = ${game_id[0]};
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    const game = data[0];
                    setGameData0(game);

                    const screenshotUrls = game.screenshots ? game.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots(screenshotUrls);

                    console.log("summary: " + gameData0.id);
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
                if (data.length) setGameData1(data[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id[1]]);

    // If gameData0 is null, wait until it's not null to render the page.
    if (!gameData0) return <div>Loading...</div>;
    if (!gameData1) return <div>Loading...</div>;

    return (
        <div class="trending-container">
            <h1 class="trending-head">TRENDING GAMES</h1>
            <div class="trending-featured1">
                <Link to={`/game?game_id=${gameData0.id}`}>
                    <Featured1 gameData={gameData0} screenshots={screenshots} />
                </Link>
            </div>
            <Link to={`/game?game_id=${gameData0.id}`}>
                <Featured2 gameData={gameData0} screenshots={screenshots} />
            </Link>
            <Link to={`/game?game_id=${gameData1.id}`}>
                <Featured2 gameData={gameData1} screenshots={screenshots} />
            </Link>
            <Link to={`/game?game_id=${gameData0.id}`}>
                <Featured2 gameData={gameData0} screenshots={screenshots} />
            </Link>
            <Link to={`/game?game_id=${gameData0.id}`}>
                <Featured2 gameData={gameData0} screenshots={screenshots} />
            </Link>
        </div>
    );
  }
  export default App;