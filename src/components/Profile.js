import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import EditProfile from "./EditProfile";
import ProfileTitleCard from "./ProfileTitleCard";
import EditGames from "./EditGames";
import "../styles/Profile.css";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import EditGenre from "./EditGenre";

function Profile({ profileData, setProfileData }) {
  const [gameCovers, setGameCovers] = useState([]);
  const [genres, setGenres] = useState([]);

  const auth = getAuth();
  //console.log("User: ", auth.currentUser.uid);
  //const uid = "GPiU3AHpvyOhnbsVSzap";
  var uid;
  if (auth.currentUser == null) {
    //window.location.href = "/login";
    uid = "GPiU3AHpvyOhnbsVSzap";
  } else {
    uid = auth.currentUser.uid;
  }
  //
  //const uid = auth.currentUser.uid;
  const docRef = doc(db, "profileData", uid);

  useEffect(() => {
    const corsAnywhereUrl = "http://localhost:8080/";
    const apiUrl = "https://api.igdb.com/v4/covers";

    const fetchCovers = async () => {
      const docSnapshot = await getDoc(docRef);
      const favoriteGames = docSnapshot.data().favoriteGames || [];
      const coverPromises = favoriteGames.map(async (id) => {
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
      setGenres(profileData.favoriteGenres);
    };

    fetchCovers();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-500 h-screen">
      <div className="formattingBox h-16 dark:bg-gray-500 bg-white"></div>
      <div className="ProfileBox flex ml-20">
        <div className="flex flex-col items-center">
          <div className="Profile Picture">
            <img
              className="rounded-full w-32 h-32 border-2 dark:border-white border-black"
              src={profileData.profilePicture}
              alt="Profile Picture"
            />
          </div>
          <div className="name dark:text-white text-black">
            {profileData.name}
          </div>
          <div className="Pronouns dark:text-white text-black">
            {profileData.pronouns}
          </div>
        </div>
        <div className="Bio border-2 dark:border-white border-black w-96 h-48 mx-4 p-2 dark:text-white text-black">
          {profileData.bio}
        </div>
        <div className="menuButtons border-2 dark:border-white border-black w-72 h-60 ml-10 p-2 dark:text-white text-black flex flex-col">
          <EditProfile
            profileData={profileData}
            setProfileData={setProfileData}
          />
        </div>
      </div>
      <div className="ml-20 dark:text-white text-black flex gap-4">
        Favorite Games
        <EditGames
          gameCovers={gameCovers}
          setGameCovers={setGameCovers}
          gameIds={profileData.favoriteGames}
        />
      </div>
      <div className="FavoriteGames flex justify-start ml-20 border-2 dark:border-white border-black w-96 h-36 p-2 gap-4 dark:text-white text-black">
        <div className="GameCover1 w-30 h-32 text-center border dark:border-white border-black">
          <ProfileTitleCard gameData={gameCovers[0]} />
        </div>
        <div className="GameCover2 w-30 h-32 text-center border dark:border-white border-black">
          <ProfileTitleCard gameData={gameCovers[1]} />
        </div>
        <div className="GameCover3 w-30 h-32 text-center border dark:border-white border-black">
          <ProfileTitleCard gameData={gameCovers[2]} />
        </div>
        <div className="GameCover4 w-30 h-32 text-center border dark:border-white border-black">
          <ProfileTitleCard gameData={gameCovers[3]} />
        </div>
      </div>
      <div className="ml-20 dark:text-white text-black flex gap-4">
        Favorite Genres
        <EditGenre genres={genres} setGenres={setGenres} />
      </div>
      <div className="FavoriteGenres flex justify-start ml-20 border-2 dark:border-white border-black w-96 h-36 p-2 gap-4 dark:text-whitetext-black">
        {profileData.favoriteGenres.map((genre, index) => (
          <div
            key={index}
            className="w-24 h-32 text-center border dark:border-white border-black"
          >
            {genre}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
