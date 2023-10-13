import React, { useState, useEffect } from 'react';
import "../styles/HomeActivity.css";
import UserActivity from "./UserActivity";

function App() {
    const [gameCover0, setGameCover0] = useState(null);
    const [gameData0, setGameData0] = useState(null);
    const [gameCover1, setGameCover1] = useState(null);
    const [gameData1, setGameData1] = useState(null);
    const [gameCover2, setGameCover2] = useState(null);
    const [gameData2, setGameData2] = useState(null);
    const usernames = ["aayushn", "wbharrel", "harjyot"];
    const ratings = [4.8, 2.2, 4.6];
    const notes = ["The Legend of Zelda: Breath of the Wild’s sheer freedom and sense of adventure is a remarkable achievement. Right from the start, the vast landscape of Hyrule is..."
        , "All the charm in the universe couldn't save Balan Wonderworld’s half-baked platforming and ill-advised one-button design from being a complete bore."
        , "In the 87 hours that it took me to beat Elden Ring, I was put through an absolute wringer of emotion: Anger as I was beaten down by its toughest..."]
    const game_id = [7346, 135992, 119133];

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
                    fields cover.url,id;
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
                    fields cover.url,id;
                    where id = ${game_id[1]};
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    const game = data[0];
                    setGameData1(game);

                    const gameUrl = game.cover.url.replace('t_thumb', 't_1080p');
                    setGameCover1(gameUrl);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id[1]]);

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
                    fields cover.url,id;
                    where id = ${game_id[2]};
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    const game = data[0];
                    setGameData2(game);

                    const gameUrl = game.cover.url.replace('t_thumb', 't_1080p');
                    setGameCover2(gameUrl);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id[2]]);

    return (
        <div>
            <div class="activity-container">
                <h1 class="user-head">YOUR FRIENDS HAVE LIKED...</h1>
                <div class="user-activity"><UserActivity cover={gameCover0} username={usernames[0]} rating={ratings[0]} note={notes[0]} id={game_id[0]}/></div>
                <div class="user-activity"><UserActivity cover={gameCover1} username={usernames[1]} rating={ratings[1]} note={notes[1]} id={game_id[1]}/></div>
                <div class="user-activity"><UserActivity cover={gameCover2} username={usernames[2]} rating={ratings[2]} note={notes[2]} id={game_id[2]}/></div>
            </div>
        </div>
    );
  }
  export default App;