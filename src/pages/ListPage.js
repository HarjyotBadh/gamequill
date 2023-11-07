import { React, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchMultipleGameData } from "../functions/GameFunctions";
import TitleCard from "../components/TitleCard";
import "../styles/ListPage.css";

const ListPage = () => {
  const { list_id } = useParams();
  const [listData, setListData] = useState("");
  const [gameIds, setGameIds] = useState([]);
  const [gameDataArray, setGameDataArray] = useState([]);

  // Fetch game data based on the played items
  const fetchGameDatas = async () => {
    if (gameIds.length > 0) {
      try {
        const gameDataArray = await fetchMultipleGameData(gameIds);
        setGameDataArray(gameDataArray);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    } else {
      setGameDataArray([]);
    }
  };

  useEffect(() => {
    //fetchListData();
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        console.log(theuserId);
        fetchListData(theuserId);
      } else {
        // not logged in
      }
    });
    const fetchListData = async (userId) => {
      const docRef = doc(db, "lists", list_id);
      const snapshot = await getDoc(docRef);
      setListData(snapshot.data());
      setGameIds(snapshot.data().games);
    };
  }, []);
  useEffect(() => {
    fetchGameDatas();
  }, [gameIds]);
  //fetchListData();

  // Fetch list data from Firebase using the listId
  // Display the list and its games

  return (
    <div className="listPage">
      <Navbar />
      <div className="list-container">
        <h1 className="list-title">{listData.name}</h1>
        <div className="list">
          {gameDataArray.map((gameData) => (
            <TitleCard key={gameData.id} gameData={gameData.game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
