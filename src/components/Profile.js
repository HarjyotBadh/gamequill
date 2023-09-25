import React from "react";
import NavBar from "./NavBar";
import DefaultProfilePicture from "../images/defaultProfilePicture.png";
function Profile() {
  const profilePicture = DefaultProfilePicture;
  const bio = "test";
  const pronouns = "he/him";
  const favoriteGames = [
    "Halo",
    "God of War",
    "Spider-Man",
    "Red Dead Redemption 2",
  ];
  const favoriteGenres = ["Adventure", "FPS", "RPG", "Strategy"];
  return (
    <div class="bg-white dark:bg-gray-500 h-screen">
      <NavBar />
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
          width: 600,
          height: 150,
          marginLeft: "100px",
        }}
      >
        <div className="Profile Picture">
          <img
            class="rounded-full"
            width={100}
            height={100}
            src={profilePicture}
          ></img>
        </div>
        <div
          className="Bio"
          style={{
            border: "2px solid white",
            width: 400,
            height: 100,
            alignContent: "center",
            marginLeft: "10px",
            color: "white",
            display: "block",
            padding: "10px",
          }}
        >
          {bio}
        </div>
        <div
          className="Pronouns"
          style={{
            color: "white",
            width: 100,
            height: 100,
            textAlign: "center",
          }}
        >
          {pronouns}
        </div>
      </div>
      <div style={{ marginLeft: "100px", color: "white" }}>Favorite Games</div>
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
          {favoriteGames[0]}
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
          {favoriteGames[1]}
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
          {favoriteGames[2]}
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
          {favoriteGames[3]}
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
          {favoriteGenres[0]}
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
          {favoriteGenres[1]}
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
          {favoriteGenres[2]}
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
          {favoriteGenres[3]}
        </div>
      </div>
    </div>
  );
}
export default Profile;
