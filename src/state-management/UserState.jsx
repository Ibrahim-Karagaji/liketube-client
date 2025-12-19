import { useState, createContext } from "react";

export const userContext = createContext();

export default function User({ children }) {
  const [userState, setUserState] = useState({
    userName: "",
    email: "",
    avatar: "",
    createdAt: "",
  });

  const values = {
    userState: userState,
    setUserState: setUserState,
  };

  return <userContext.Provider value={values}>{children}</userContext.Provider>;
}
