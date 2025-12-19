import { createContext, useState } from "react";

export const serachContext = createContext();

export default function SearchState({ children }) {
  const [searchState, setSearchState] = useState({
    serach: "",
    status: false,
    content: "videos",
  });

  const values = { searchState: searchState, setSearchState };
  return (
    <serachContext.Provider value={values}>{children}</serachContext.Provider>
  );
}
