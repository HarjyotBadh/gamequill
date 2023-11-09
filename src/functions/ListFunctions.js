import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
export const getListData = async (listId) => {
  try {
    const listDocRef = doc(db, "lists", listId);
    const listDoc = await getDoc(listDocRef);
    const listData = listDoc.data();
    return {
      id: listDoc.id,
      name: listData.name || `List ${listDoc.id}`,
      games: listData.games || [],
      ranked: listData.ranked || false,
      owner: listData.owner || null,
    };
  } catch (error) {
    console.error("Error fetching list data:", error);
  }
};

export const getMultipleListData = async (listIds) => {
  const listDataPromises = listIds.map(async (listId) => {
    return await getListData(listId);
  });

  try {
    const listDataArray = await Promise.all(listDataPromises);
    return listDataArray;
  } catch (error) {
    console.error("Error fetching multiple list data:", error);
    return [];
  }
};
