import React, { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import TitleCard from "./ProfileTitleCard";
import EditGames from "./EditGames";

function Profile({ profileData, setProfileData }) {
  const [gameCovers, setGameCovers] = useState([]);

  useEffect(() => {
    const corsAnywhereUrl = "http://localhost:8080/";
    const apiUrl = "https://api.igdb.com/v4/covers";

    const gameIds = [19565, 19560, 1519, 25076]; // List of game IDs

    const fetchCovers = async () => {
      const coverPromises = gameIds.map(async (id) => {
        const response = await fetch(corsAnywhereUrl + apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
            Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
          },
          body: `
            fields url;
            where game = ${id};
          `,
        });
        const data = await response.json();
        return data[0]?.url || null;
      });

      const covers = await Promise.all(coverPromises);
      setGameCovers(covers);
    };

    fetchCovers();
  }, []);
  return (
    <div class="bg-white dark:bg-gray-500 h-screen">
      <div
        class="bg-white dark:bg-gray-500"
        className="formattingBox"
        style={{ height: "100px" }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          width: "100%",
          height: 250,
          marginLeft: "100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            color: "white",
            height: 75,
          }}
        >
          <div className="Profile Picture">
            <img
              class="rounded-full"
              style={{ width: 100, height: 100 }}
              src={profileData.profilePicture}
              alt="Profile Picture"
            ></img>
          </div>
          <div className="name" style={{ width: 100, height: 25 }}>
            {profileData.name}
          </div>
          <div
            className="Pronouns"
            style={{
              width: 100,
              height: 50,
              textAlign: "center",
            }}
          >
            {profileData.pronouns}
          </div>
        </div>
        <div
          className="Bio"
          style={{
            border: "2px solid white",
            width: 475,
            height: 200,
            alignContent: "center",
            marginLeft: "10px",
            color: "white",
            display: "block",
            padding: "10px",
          }}
        >
          {profileData.bio}
        </div>
        <div
          className="menuButtons"
          style={{
            border: "2px solid white",
            color: "white",
            width: 300,
            height: 600,
            marginLeft: 100,
            padding: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <EditProfile
            profileData={profileData}
            setProfileData={setProfileData}
          />
        </div>
      </div>
      <div
        style={{
          marginLeft: "100px",
          color: "white",
          display: "flex",
          gap: 20,
        }}
      >
        Favorite Games
        <EditGames
          profileData={profileData}
          setProfileData={setProfileData}
          gameCovers={gameCovers}
          setGameCovers={setGameCovers}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          marginLeft: "100px",
          border: "1px solid white",
          width: 450,
          height: 150,
          padding: 10,
          gap: 10,
          color: "white",
        }}
        className="FavoriteGames"
      >
        <div
          className="Game1"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          <TitleCard gameData={gameCovers[0]} />
        </div>
        <div
          className="Game2"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          <TitleCard gameData={gameCovers[1]} />
        </div>
        <div
          className="Game3"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          <TitleCard gameData={gameCovers[2]} />
        </div>
        <div
          className="Game4"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          <TitleCard gameData={gameCovers[3]} />
        </div>
      </div>
      <div style={{ marginLeft: "100px", color: "white" }}>Favorite Genres</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          marginLeft: "100px",
          border: "1px solid white",
          width: 450,
          height: 150,
          padding: 10,
          gap: 10,
          color: "white",
        }}
        className="FavoriteGenres"
      >
        <div
          className="Genre1"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          {profileData.favoriteGenres[0]}
        </div>
        <div
          className="Genre2"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          {profileData.favoriteGenres[1]}
        </div>
        <div
          className="Genre3"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          {profileData.favoriteGenres[2]}
        </div>
        <div
          className="Genre4"
          style={{
            border: "1px solid white",
            width: 100,
            height: 125,
            textAlign: "center",
          }}
        >
          {profileData.favoriteGenres[3]}
        </div>
      </div>
    </div>
  );
}
export default Profile;
