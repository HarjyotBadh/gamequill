import React from "react";
import { useParams } from "react-router-dom";

const ListPage = () => {
  const { list_id } = useParams();

  // Fetch list data from Firebase using the listId
  // Display the list and its games

  return <div>List Page for {list_id}</div>;
};

export default ListPage;
