import { createContext, useState } from "react";

export const settingsContext = createContext();

export default function Settings({ children }) {
  const [settingsState, setSettings] = useState({
    save_watch_history: true,
    notifications: true,
    language: localStorage.getItem("language") || "English",
  });

  return (
    <settingsContext.Provider value={{ settingsState, setSettings }}>
      {children}
    </settingsContext.Provider>
  );
}
