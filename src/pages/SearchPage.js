import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import NavBar from "../components/NavBar";

const SearchPage = ({ searchQuery }) => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  console.log(searchQuery);

  const renderGame = ({ item }) => (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>{item.title}</Text>
      <Text style={styles.gameDescription}>{item.description}</Text>
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
        {searchQuery}
        <View style={styles.resultsContainer}>
          <FlatList
            data={games}
            renderItem={renderGame}
            keyExtractor={(item) => item.id}
            style={styles.gamesList}
          />
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
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
