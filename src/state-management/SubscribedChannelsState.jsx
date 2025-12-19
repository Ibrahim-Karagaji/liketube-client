import { useState, useEffect, createContext } from "react";
import getSubscribedChannelsService from "../services/getSubscribedChannelsService";

export const subscribedChannelsContext = createContext();

export default function SubscribedChannels({ children }) {
  const [subscribedChannelsState, setSubscribedChannelsState] = useState({
    channels: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getSubscribedChannelsService();

        if (result.ok) {
          setSubscribedChannelsState((prev) => {
            return { ...prev, loading: false, channels: result.videos };
          });
        }
      } catch (err) {
        return err;
      }
    }
    fetchData();
  }, []);

  const values = {
    subscribedChannelsState: subscribedChannelsState,
    setSubscribedChannelsState,
  };
  return (
    <subscribedChannelsContext.Provider value={values}>
      {children}
    </subscribedChannelsContext.Provider>
  );
}
