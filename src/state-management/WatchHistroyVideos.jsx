import { useState, useEffect, createContext } from "react";
import getWatchHistroyVideos from "../services/getWatchHistroyVideos";

export const watchHistroyVideosContext = createContext();

export default function watchHistroyVideos({ children }) {
  const [watchHistroyVideosState, setWatchHistroyVideosState] = useState({
    videos: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getWatchHistroyVideos();

        if (result.ok)
          setWatchHistroyVideosState((prev) => {
            return { ...prev, videos: result.videos };
          });
      } catch (err) {
        console.log(er);
      }
    }
    fetchData();
  }, []);

  const values = {
    watchHistroyVideosState: watchHistroyVideosState,
    setWatchHistroyVideosState,
  };
  return (
    <watchHistroyVideosContext.Provider value={values}>
      {children}
    </watchHistroyVideosContext.Provider>
  );
}
