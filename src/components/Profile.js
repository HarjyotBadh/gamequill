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
  const [loadingCovers, setLoadingCovers] = useState(true);

  const auth = getAuth();
  var isUser = false;
  if (auth.currentUser != null && userId === auth.currentUser.uid) {
    isUser = true;
  }
  useEffect(() => {
    // const apiUrl = "http://localhost:8080/https://api.igdb.com/v4/games";
    const apiUrl = "https://api.igdb.com/v4/covers";

    const fetchCovers = async () => {
      if (auth.currentUser === null && userId === auth.currentUser?.uid) {
        window.location.href = "/login";
        return;
      }

      try {
        const docRef = doc(db, "profileData", userId);
        const docSnapshot = await getDoc(docRef);
        const data = docSnapshot.data();

        if (!data) {
          console.error("No profile data found");
          return;
        }

        const favoriteGames = data.favoriteGames || [];
        setCurrentlyPlayingGame(data.currentlyPlayingGame);
        setFeaturedList(data.featuredList || null);

        const coverPromises = favoriteGames.map(async (id) => {
          if (!id) return null;

          const ob = {
            igdbquery: `fields url; where game = ${id};`,
          };
          const functionUrl =
            "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBCovers";

          try {
            const response = await fetch(functionUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(ob),
            });

            if (!response.ok) {
              console.error(
                `Error fetching cover for game ${id}: ${response.status}`
              );
              return null;
            }

            const data = await response.json();
            return data.data?.[0]?.url || null;
          } catch (err) {
            console.error(`Error fetching cover for game ${id}:`, err);
            return null;
          }
        });

        const covers = await Promise.all(coverPromises);
        setGameCovers(covers);
        setGenres(data.favoriteGenres || []);
        setGameIds(favoriteGames);
      } catch (error) {
        console.error("Error fetching profile covers:", error);
      } finally {
        setLoadingCovers(false);
      }
    };

    fetchCovers();
  }, [userId]);

  return (
    <div className="bg-white dark:bg-gray-500 min-h-screen">
      <div className="h-16 dark:bg-gray-500 bg-white"></div>

      {/* Main content container - uses grid for two-column layout */}
      <div className="w-full px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Profile info, favorites, and recent reviews */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile header section */}
          <div className="flex flex-row gap-6">
            <div className="flex flex-col items-center">
              <img
                className="rounded-full w-32 h-32 border-2 dark:border-white border-black object-cover"
                src={profileData.profilePicture}
                alt="Profile"
              />
              <div className="name dark:text-white text-black font-bold mt-2">
                {profileData.name}
              </div>
              <div className="dark:text-white text-black text-sm">
                {profileData.pronouns}
              </div>
              <div className="mt-2">
                {isUser ? (
                  <EditProfile
                    profileData={profileData}
                    setProfileData={setProfileData}
                  />
                ) : (
                  <FollowUser target_uid={userId} />
                )}
              </div>
            </div>
            <div className="flex-1 border-2 dark:border-white border-black rounded-xl p-4 dark:text-white text-black min-h-[150px]">
              {profileData.bio}
            </div>
          </div>

          {/* Favorite Games section */}
          <div className="flex flex-col gap-2">
            <div className="dark:text-white text-black flex gap-4 items-center font-semibold">
              Favorite Games
              {isUser && (
                <EditGames
                  gameCovers={gameCovers}
                  setGameCovers={setGameCovers}
                  gameIds={profileData.favoriteGames}
                />
              )}
            </div>
            <div className="border-2 dark:border-white border-black rounded-xl p-4 flex justify-center">
              {loadingCovers ? (
                <div className="flex items-center justify-center h-32 dark:text-white text-black">
                  Loading favorite games...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 max-w-xl">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="aspect-[3/4] border dark:border-white border-black rounded-lg overflow-hidden"
                    >
                      <Link
                        to={`/game?game_id=${gameIds[idx]}`}
                        className="block w-full h-full"
                      >
                        <ProfileTitleCard gameData={gameCovers[idx]} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Favorite Genres section */}
          <div className="flex flex-col gap-2">
            <div className="dark:text-white text-black flex gap-4 items-center font-semibold">
              Favorite Genres
              {isUser && <EditGenre genres={genres} setGenres={setGenres} />}
            </div>
            <div className="border-2 dark:border-white border-black rounded-xl p-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {profileData.favoriteGenres.map((genre, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 border dark:border-white border-black rounded-lg dark:text-white text-black"
                  >
                    <GenreIcon g={genre} />
                    <span className="text-sm mt-1">
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reviews section */}
          <div className="mt-4">
            <FiveRecentReviews user_id={userId} />
          </div>
        </div>

        {/* Right column - Currently Playing and Featured List */}
        <div className="flex flex-col gap-6 dark:text-white text-black">
          {/* Currently Playing section */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center font-semibold">
              Currently Playing
              {isUser && (
                <EditCurrentlyPlayingGame
                  currentlyPlayingGame={currentlyPlayingGame}
                  setCurrentlyPlayingGame={setCurrentlyPlayingGame}
                />
              )}
            </div>
            {currentlyPlayingGame ? (
              <div className="w-[140px] aspect-[3/4] border-2 dark:border-white border-black rounded-xl overflow-hidden">
                <Link
                  to={`/game?game_id=${currentlyPlayingGame.id}`}
                  className="block w-full h-full"
                >
                  <ProfileTitleCard gameData={currentlyPlayingGame.cover.url} />
                </Link>
              </div>
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </div>

          {/* Featured List section */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center font-semibold">
              Featured List
              {isUser && <EditFeaturedList setFeaturedList={setFeaturedList} />}
            </div>
            {featuredList ? (
              <div className="w-full">
                <ListPreview list={featuredList} />
              </div>
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
