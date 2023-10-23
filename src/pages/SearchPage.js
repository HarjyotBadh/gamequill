import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import { Link } from "react-router-dom";

const SearchPage = ({ searchQuery }) => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  console.log(searchQuery);
  useEffect(() => {
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
            // title: game.name,
            // description: "", // Add description logic if available
            id: game.id,
            gameData: game,
          }));
          setGames(gamesData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (searchQuery) {
      searchGames();
    }
  }, [searchQuery]);

  const renderGame = ({ item }) => (
    <View style={styles.gameContainer}>
      <Link to={`/game?game_id=${item.id}`}>
        <TitleCard gameData={item.gameData} />
      </Link>
    </View>
  );

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{item.username}</Text>
    </View>
  );

  return (
    <div>
      <NavBar />
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <View style={styles.gamesColumn}>
            <FlatList
              data={games}
              renderItem={renderGame}
              style={styles.gamesList}
              numColumns={2}
            />
          </View>
          <View style={styles.usersColumn}>
            <FlatList
              data={users}
              renderItem={renderUser}
              style={styles.usersList}
            />
          </View>
        </View>
      </View>
    </div>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gamesColumn: {
    flexBasis: "48%",
    marginRight: "2%",
  },
  usersColumn: {
    flexBasis: "48%",
  },
  gameContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  userContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SearchPage;
