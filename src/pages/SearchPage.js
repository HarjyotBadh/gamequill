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
          body: `search "${searchQuery}";fields name, cover.url, aggregated_rating; limit:50; where category = (0,8,9);`,
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

      {/* <Text style={styles.gameTitle}>{item.title}</Text>
      <Text style={styles.gameDescription}>{item.description}</Text> */}
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
          <FlatList
            data={games}
            renderItem={renderGame}
            // keyExtractor={(item) => item.id.toString()}
            style={styles.gamesList}
          />
          <FlatList
            data={users}
            renderItem={renderUser}
            // keyExtractor={(item) => item.id}
            style={styles.usersList}
          />
        </View>
      </View>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  gamesList: {
    flex: 3,
  },
  usersList: {
    flex: 1,
  },
  gameContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
  },
  userContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SearchPage;
