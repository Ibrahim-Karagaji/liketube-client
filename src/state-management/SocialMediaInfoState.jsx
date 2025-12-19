import { createContext, useEffect, useState, useContext } from "react";
import getSocialMediaInfoService from "../services/getSocialMediaInfoService";
import { channelContext } from "./ChannelState";

export const socialMediaInfoContext = createContext();

function SocialMediaInfoState({ children }) {
  const channel = useContext(channelContext);

  const [socialMediaInfo, setSocialMediaInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        if (channel.channelState.id) {
          const result = await getSocialMediaInfoService(
            channel.channelState.id
          );
          if (result.ok) {
            setSocialMediaInfo(result.socialMedia);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [channel.channelState.id]);

  const values = { socialMediaInfo: socialMediaInfo, setSocialMediaInfo };
  return (
    <socialMediaInfoContext.Provider value={values}>
      {children}
    </socialMediaInfoContext.Provider>
  );
}

export default SocialMediaInfoState;
