import { createContext, useState, useEffect, useContext } from "react";
import getVideoService from "../services/getVideosService";
import { categoriesContext } from "./Categories";

export const videosContaxt = createContext();

export default function VideosState({ children }) {
  const catagory = useContext(categoriesContext);

  const [videosState, setVideosState] = useState({
    videos: [],
    loading: true,
    limit: 8,
    videos_totle: 0,
  });

  useEffect(() => {
    setVideosState((prev) => {
      return { ...prev, loading: true };
    });
    async function fetchData() {
      try {
        const result = await getVideoService(
          videosState.limit,
          catagory.categoriesState.selected
        );

        if (result.ok) {
          setVideosState((prev) => {
            return {
              ...prev,
              loading: false,
              videos: result.videos,
              videos_totle: result.videos_totle,
            };
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setVideosState((prev) => {
          return { ...prev, loading: false };
        });
      }
    }
    fetchData();
  }, [catagory.categoriesState.selected, videosState.limit]);

  const values = { videosState: videosState, setVideosState };

  return (
    <videosContaxt.Provider value={values}>{children}</videosContaxt.Provider>
  );
}
