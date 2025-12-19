import { useState, createContext, useEffect } from "react";
import getLikedVideosService from "../services/getLikedVideosService";
import { video } from "framer-motion/client";

export const likedVideosContext = createContext();

export default function LikedVideos({ children }) {
  const [likeVideosState, setlLikevVideosState] = useState({
    videos: [],
    loadding: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLikedVideosService();

        if (result.ok) {
          setlLikevVideosState((prev) => {
            return { ...prev, loadding: false, videos: result.videos };
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const values = { likeVideosState: likeVideosState, setlLikevVideosState };

  return (
    <likedVideosContext.Provider value={values}>
      {children}
    </likedVideosContext.Provider>
  );
}
