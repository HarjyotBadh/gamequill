import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import { Link } from "react-router-dom";

const SearchPage = ({ searchQuery }) => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);

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
    <div style={styles.gameContainer}>
      <Link to={`/game?game_id=${item.id}`}>
        <TitleCard gameData={item.gameData} />
      </Link>
    </div>
  );

  const renderUser = ({ item }) => (
    <div style={styles.userContainer}>
      <div style={styles.username}>{item.username}</div>
    </div>
  );

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        <div style={styles.resultsContainer}>
          <div style={styles.gamesColumn}>
            {games.map((game) => (
              <div key={game.id} style={styles.gameContainer}>
                <Link to={`/game?game_id=${game.id}`}>
                  <TitleCard gameData={game.gameData} />
                </Link>
              </div>
            ))}
          </div>
          <div style={styles.usersColumn}>
            {users.map((user) => (
              <div key={user.id} style={styles.userContainer}>
                <div style={styles.username}>{user.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
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
};

export default SearchPage;
