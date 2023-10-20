import React from "react";
import { useLocation } from "react-router-dom";
import SearchPage from "../pages/SearchPage";

function SearchPageWrapper() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  console.log(query);

  return <SearchPage searchQuery={query} />;
}

export default SearchPageWrapper;
