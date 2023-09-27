import React, { useState, useEffect } from 'react';
import TitleCard from "../components/TitleCard";

function App() {
    const [gameData0, setGameData0] = useState(null);
    const [gameData1, setGameData1] = useState(null);
    const game_id = [2239, 2240, 2241];

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
                    where id = ${game_id[0]};
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) setGameData0(data[0]);
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

    return (
        <div>
            <p>Trending section</p>
            <p>yeah</p>
            <div style={{ display: 'flex' }}>
                <TitleCard gameData={gameData0} />
                <TitleCard gameData={gameData1} />
            </div>
        </div>
    );
  }
  export default App;