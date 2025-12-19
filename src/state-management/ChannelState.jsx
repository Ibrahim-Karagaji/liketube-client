import { createContext, useState, useEffect } from "react";
import getUserChannel from "../services/getUserChannelService";

export const channelContext = createContext();

export default function ChannelState({ children }) {
  const [channelState, setChannelState] = useState({
    id: 0,
    name: "",
    avatar: "",
    category: "",
    subscriptions: 0,
    description: "",
    created_at: "",
    videos_total: 0,
    likes_total: 0,
    views_total: 0,
    comments_total: 0,
  });

  const values = { channelState: channelState, setChannelState };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getUserChannel();

        if (!result.ok) {
          return;
        }

        setChannelState((prev) => {
          return {
            ...prev,
            id: result.userChannel.id,
            name: result.userChannel.name,
            avatar: result.userChannel.avatar_url,
            category: result.userChannel.category,
            subscriptions: result.userChannel.subscriptions,
            description: result.userChannel.description,
            created_at: result.userChannel.created_at,
            videos_total: result.userChannel.videos_total,
            likes_total: result.userChannel.likes_total,
            views_total: result.userChannel.views_total,
            comments_total: result.userChannel.comments_total,
          };
        });
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <channelContext.Provider value={values}>{children}</channelContext.Provider>
  );
}
