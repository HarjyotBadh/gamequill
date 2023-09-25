import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";

export default function GamePage({game_id}) {
    const [gameData, setGameData] = useState(null);
    const sample_id = 96437;
    game_id = sample_id;

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
                    where id = ${game_id};
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) setGameData(data[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id]);

    return (
        <div>
            <NavBar />
            <TitleCard gameData={gameData} />
        </div>
    )
}
