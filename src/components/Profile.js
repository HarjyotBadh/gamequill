import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import EditProfile from "./EditProfile";
import ProfileTitleCard from "./ProfileTitleCard";
import EditGames from "./EditGames";
import "../styles/Profile.css";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import EditGenre from "./EditGenre";
import { Link } from "react-router-dom";
import FollowUser from "./FollowUser";
import EditCurrentlyPlayingGame from "./EditCurrentlyPlayingGame";
import EditFeaturedList from "./EditFeaturedList";
import FiveRecentReviews from "./FiveRecentReviews";
import ListPreview from "./ListPreview";
import Footer from "./Footer";
import GenreIcon from "./GenreIcon";

function Profile({ profileData, setProfileData, userId }) {
  const [gameCovers, setGameCovers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [gameIds, setGameIds] = useState([]);
  const [currentlyPlayingGame, setCurrentlyPlayingGame] = useState(null);
  const [featuredList, setFeaturedList] = useState(null);

  const auth = getAuth();
  var isUser = false;
  if (auth.currentUser != null && userId === auth.currentUser.uid) {
    isUser = true;
  }
  useEffect(() => {
    // const apiUrl = "http://localhost:8080/https://api.igdb.com/v4/games";
    const apiUrl = "https://api.igdb.com/v4/covers";

    const fetchCovers = async () => {
      if (auth.currentUser === null && userId === auth.currentUser.uid) {
        window.location.href = "/login";
      }
      const docRef = doc(db, "profileData", userId);
      const docSnapshot = await getDoc(docRef);
      const favoriteGames = docSnapshot.data().favoriteGames || [];
      setCurrentlyPlayingGame(docSnapshot.data().currentlyPlayingGame);
      setFeaturedList(docSnapshot.data().featuredList || null);
      const coverPromises = favoriteGames.map(async (id) => {
        const ob = {
          igdbquery: `
          fields url;
          where game = ${id};
        `,
      };
      const functionUrl = "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBCovers";

      const response = await fetch(functionUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
          body: JSON.stringify(ob),
      });
      const data = await response.json();
      const igdbResponse = data.data;
        // const response = await fetch(apiUrl, {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        //     Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo",
        //   },
        //   body: `
        //     fields url;
        //     where game = ${id};
        //   `,
        // });
        // const data = await response.json();
        // return data[0]?.url || null;
        return igdbResponse[0]?.url || null;
      });

      const covers = await Promise.all(coverPromises);
      setGameCovers(covers);

      setGenres(profileData.favoriteGenres);

      setGameIds(favoriteGames);
    };

    fetchCovers();
  }, [userId]);

  return (
    <div className="bg-white dark:bg-gray-500">
      <div className="formattingBox h-16 dark:bg-gray-500 bg-white"></div>
      <div className="profileScreen bg-white dark:bg-gray-500 flex flex-row">
        <div className="profileAndFavorites dark:bg-gray-500 bg-white flex flex-col">
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
              <div className="follow-button">
                {!isUser && <FollowUser target_uid={userId} />}
              </div>
            </div>
            <div className="Bio border-2 dark:border-white border-black w-96 h-48 mx-4 p-2 dark:text-white text-black">
              {profileData.bio}
            </div>
          </div>
          <div className="formattingBox h-16 dark:bg-gray-500 bg-white"></div>
          <div className="ml-20 dark:text-white text-black flex gap-4">
            Favorite Games
            {isUser && (
              <EditGames
                gameCovers={gameCovers}
                setGameCovers={setGameCovers}
                gameIds={profileData.favoriteGames}
              />
            )}
          </div>
          <div className="FavoriteGames flex justify-start ml-20 border-2 dark:border-white border-black w-96 h-36 p-2 gap-4 dark:text-white text-black">
            <div className="GameCover1 w-30 h-32 text-center border dark:border-white border-black">
              <Link to={`/game?game_id=${gameIds[0]}`}>
                <ProfileTitleCard gameData={gameCovers[0]} />
              </Link>
            </div>
            <div className="GameCover2 w-30 h-32 text-center border dark:border-white border-black">
              <Link to={`/game?game_id=${gameIds[1]}`}>
                <ProfileTitleCard gameData={gameCovers[1]} />
              </Link>
            </div>
            <div className="GameCover3 w-30 h-32 text-center border dark:border-white border-black">
              <Link to={`/game?game_id=${gameIds[2]}`}>
                <ProfileTitleCard gameData={gameCovers[2]} />
              </Link>
            </div>
            <div className="GameCover4 w-30 h-32 text-center border dark:border-white border-black">
              <Link to={`/game?game_id=${gameIds[3]}`}>
                <ProfileTitleCard gameData={gameCovers[3]} />
              </Link>
            </div>
          </div>
          <div className="ml-20 dark:text-white text-black flex gap-4">
            Favorite Genres
            {isUser && <EditGenre genres={genres} setGenres={setGenres} />}
          </div>
          <div className="FavoriteGenres flex justify-start ml-20 border-2 dark:border-white border-black w-96 p-2 gap-4 dark:text-whitetext-black">
            {profileData.favoriteGenres.map((genre, index) => (
              <div
                key={index}
                className="w-24 text-center border dark:border-white border-black"
              >
                <GenreIcon g={genre} />
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </div>
            ))}
          </div>
          <div class="five-recent">
            <FiveRecentReviews user_id={userId} />
          </div>
        </div>
        <div className="currentlyPlayingAndFeaturedList dark:text-white text-black flex flex-col">
          <div className="currentlyPlaying dark:text-white text-black flex flex-col">
            <div className="dark:text-white text-black flex gap-4">
              Currently Playing:
              {isUser && (
                <EditCurrentlyPlayingGame
                  currentlyPlayingGame={currentlyPlayingGame}
                  setCurrentlyPlayingGame={setCurrentlyPlayingGame}
                />
              )}
            </div>
            {currentlyPlayingGame ? (
              <div className="currentlyPlayingFormat dark:text-white text-black flex flex-col w-50">
                <div
                  style={{
                    width: "150px",
                    height: "200px",
                    border: "2px solid white",
                    borderRadius: "20px",
                  }}
                >
                  <Link to={`/game?game_id=${currentlyPlayingGame.id}`}>
                    <ProfileTitleCard
                      className="currentlyPlayingGame"
                      gameData={currentlyPlayingGame.cover.url}
                    />
                  </Link>
                </div>
              </div>
            ) : (
              "None"
            )}
          </div>
          <div className="featuredList dark:text-white text-black flex flex-col">
            <div className="dark:text-white text-black flex gap-4">
              Featured List:
              {isUser && <EditFeaturedList setFeaturedList={setFeaturedList} />}
            </div>
            {featuredList ? (
              <div className="featuredListFormat dark:text-white text-black flex flex-col w-50">
                <div
                  style={{
                    width: "300px",
                    height: "200px",
                  }}
                >
                  <ListPreview list={featuredList} />
                </div>
              </div>
            ) : (
              "None"
            )}
          </div>
        </div>

        {isUser && (
          <div className="menuButtons border-2 dark:border-white border-black w-72 h-100 ml-10 p-2 dark:text-white text-black flex flex-col mh">
            <EditProfile
              profileData={profileData}
              setProfileData={setProfileData}
            />
            <p>
              <Link to="/recent-reviews" className="button">
                Recent Activity
              </Link>
            </p>
            <p>
              <Link to="/wishlist" className="button">
                Wishlist
              </Link>
            </p>
            <p>
              <Link to="/likes" className="button">
                Liked Games
              </Link>
            </p>
            <p>
              <Link to="/played" className="button">
                Played Games
              </Link>
            </p>
            <p>
              <Link to="/lists" className="button">
                My Lists
              </Link>
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
