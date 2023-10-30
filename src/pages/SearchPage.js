import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import { Link } from "react-router-dom";
import "../styles/SearchPage.css";
import GameColumn from "../components/GamesColumn";
import UserColumn from "../components/UserColumn";
import { db } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Footer from "../components/Footer";

const SearchPage = ({ searchQuery }) => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const searchGames = async () => {
    try {
      const corsAnywhereUrl = "http://localhost:8080/";
      const apiUrl = "https://api.igdb.com/v4/games";

      const response = await fetch(corsAnywhereUrl + apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
          Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
        },
        body: `search "${searchQuery}";fields name, cover.url, aggregated_rating, involved_companies.company.name; limit:50; where category = (0,8,9);`,
      });

      const data = await response.json();
      if (data.length) {
        const gamesData = data.map((game) => ({
          id: game.id,
          gameData: {
            ...game,
            aggregated_rating: game.aggregated_rating || 0, // Set to 0 if aggregated_rating is undefined
          },
        }));
        //TODO: Sort by our rating system once fully implemented
        gamesData.sort(
          (a, b) => b.gameData.aggregated_rating - a.gameData.aggregated_rating
        );
        console.log(gamesData);
        setGames(gamesData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchUsers = async () => {
    try {
      const userResults = [];

      const usersCollection = collection(db, "profileData");
      const q = query(
        usersCollection,
        where("usernameLowerCase", ">=", searchQuery.toLowerCase()),
        where("usernameLowerCase", "<=", searchQuery.toLowerCase() + "\uf8ff"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userResults.push({
          username: userData.username,
          userId: doc.id,
        });
      });

      setUsers(userResults);
      // console.log(users[0].username);
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      searchGames();
      searchUsers();
    }
  }, [searchQuery]);

  return (
    <div className="bg-white dark:bg-gray-500 h-screen">
      <NavBar />
      <div className="searchPageTitle" textAlign="center">
        <h1 className="text-4xl dark:text-white text-black">
          Search results for "{searchQuery}"
        </h1>
        <div className="headingsGameUser dark:text-white text-black">
          <h2>Games</h2>
          <h2>Users</h2>
        </div>
      </div>
      <div className="searchContainer bg-white dark:bg-gray-500">
        <div className="resultsContainer bg-white dark:bg-gray-500">
          <GameColumn games={games} />
          <UserColumn users={users} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
