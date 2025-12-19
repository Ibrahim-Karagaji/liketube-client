import { createContext, useEffect, useState } from "react";
import getPlayListVideosService from "../services/getPlayListVideosService";

export const playListVideosContext = createContext();

export default function PlayListVideos({ children }) {
  const [playListVideosState, setPlayListVideosState] = useState({
    videos: [],
    loadding: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getPlayListVideosService();
        if (result.ok) {
          setPlayListVideosState((prev) => {
            return { ...prev, loadding: false, videos: result.videos };
          });
        }
      } catch (err) {
        return err;
      }
    }
    fetchData();
  }, []);

  const values = {
    playListVideosState: playListVideosState,
    setPlayListVideosState,
  };
  return (
    <playListVideosContext.Provider value={values}>
      {children}
    </playListVideosContext.Provider>
  );
}
