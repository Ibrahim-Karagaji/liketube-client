import HomePage from "./HomePage";
import Themes from "../state-management/Themes";
import Signup from "./auth/Signup";
import SignIn from "./auth/SignIn";
import UserChannel from "./UserChannel";
import ConfirmAccount from "./auth/ConfirmAccount";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Content from "./Content";
import SubscribedChannels from "./SubscribedChannels";
import CreateChannel from "./CreateChannel";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./Loading";
import { useState, useEffect, useContext } from "react";
import getUser from "../services/getUserService";
import UserProfile from "./UserProfile";
import { userContext } from "../state-management/UserState";
import { settingsContext } from "../state-management/Settings";
import PlayList from "./PlayList";
import History from "./History";
import UploadVdeo from "./UploadVdeo";
import VideosState from "../state-management/VideosState";
import UserVideos from "./UserVideos";
import DisplayVideo from "./DisplayVideo";
import LikedVideos from "../state-management/LikedVideos";
import SubscribedChannelsState from "../state-management/SubscribedChannelsState";
import PlayListVideos from "../state-management/PlayListVideos";
import WatchHistroyVideos from "../state-management/WatchHistroyVideos";
import LikedUserVideos from "./LikedUserVideos";
import ChannelInfo from "./ChannelInfo";
import SocialMediaInfoState from "../state-management/SocialMediaInfoState";
import Search from "./Search";
import UserFeedback from "./UserFeedback";
import DeveloperPage from "./DeveloperPage";
import TermsPolicy from "./TermsPolicy";
import NotFound from "./NotFound";

export default function Layout() {
  const [loading, setLoading] = useState(true);

  const user = useContext(userContext);
  const settings = useContext(settingsContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUser();

        if (result.ok) {
          user.setUserState((prev) => {
            return {
              ...prev,
              userName: result.user.user_name,
              email: result.user.email,
              avatar: result.user.avatar_url,
              createdAt: result.user.created_at,
            };
          });

          settings.setSettings((prev) => {
            return {
              ...prev,
              save_watch_history: result.user.save_watch_history,
              notifications: result.user.notifications,
            };
          });

          return;
        }

        localStorage.removeItem("token");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <SocialMediaInfoState>
      <WatchHistroyVideos>
        <PlayListVideos>
          <SubscribedChannelsState>
            <LikedVideos>
              <VideosState>
                <Themes>
                  <BrowserRouter>
                    <Routes>
                      <Route path="*" element={<NotFound />}></Route>
                      <Route path="/" element={<HomePage />}>
                        <Route index element={<Content />} />
                        <Route
                          path="/subscriptions"
                          element={<SubscribedChannels />}
                        />
                        <Route path="/play-list" element={<PlayList />} />
                        <Route path="/channel-info" element={<ChannelInfo />} />
                        <Route
                          path="/liked-videos"
                          element={<LikedUserVideos />}
                        />
                        <Route path="/history" element={<History />} />
                        <Route path="/searching" element={<Search />} />
                        <Route
                          path="/display-video"
                          element={<DisplayVideo />}
                        />
                      </Route>
                      <Route path="/user-channel" element={<UserChannel />} />
                      <Route
                        path="/developer-page"
                        element={<DeveloperPage />}
                      />
                      <Route path="/user-feedback" element={<UserFeedback />} />
                      <Route path="/term-policy" element={<TermsPolicy />} />
                      <Route path="/upload-video" element={<UploadVdeo />} />
                      <Route path="/user-videos" element={<UserVideos />} />
                      <Route path="/sign-up" element={<Signup />} />
                      <Route path="/sign-in" element={<SignIn />} />
                      <Route
                        path="/confirm-account"
                        element={<ConfirmAccount />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                      />
                      <Route
                        path="/create-channel"
                        element={<CreateChannel />}
                      />
                      <Route path="/user-profile" element={<UserProfile />} />
                    </Routes>
                  </BrowserRouter>
                </Themes>
              </VideosState>
            </LikedVideos>
          </SubscribedChannelsState>
        </PlayListVideos>
      </WatchHistroyVideos>
    </SocialMediaInfoState>
  );
}
