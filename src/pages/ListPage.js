import React from "react";
import { useParams } from "react-router-dom";

const ListPage = () => {
  const { listId } = useParams();

  // Fetch list data from Firebase using the listId
  // Display the list and its games

  return <div>List Page for {listId}</div>;
};

export default ListPage;
