import { useContext, useState, useEffect } from "react";
import { settingsContext } from "../state-management/Settings";
import { themesContext } from "../state-management/Themes";
import { subscribedChannelsContext } from "../state-management/SubscribedChannelsState";
import { userContext } from "../state-management/UserState";
import clsx from "clsx";
import ShowMessage from "./ShowMessage";
import Loading from "./Loading";
import { useLocation, useNavigate } from "react-router-dom";
import getChannelVideosService from "../services/getChannelVideosService";
import getSocialMediaInfoService from "../services/getSocialMediaInfoService";
import subscribeToChannelService from "../services/subscribeToChannelService";
import unsubscribeToChannelService from "../services/unsubscribeToChannelService";
import getChannelInfoService from "../services/getChannelInfoService";
import { useInView } from "react-intersection-observer";

export default function ChannelInfo() {
  const channeld = useLocation().state?.id || "";
  const navigate = useNavigate();

  const settings = useContext(settingsContext);
  const themes = useContext(themesContext);
  const subscribedChannels = useContext(subscribedChannelsContext);
  const user = useContext(userContext);

  const subscrib =
    subscribedChannels.subscribedChannelsState.channels.some(
      (item) => item.id == channeld
    ) || false;

  const [subscribeMode, setSubscribeMode] = useState(
    subscrib ? "subscribed" : "unsubscribed"
  );

  const [message, setMessage] = useState({ message: "", status: null });
  const [loading, setLoading] = useState(false);
  const [videosState, setVideosState] = useState({
    videos: [],
    loading: true,
    limiet: 8,
  });

  const [socialMediaInfo, setSocialMediaInfo] = useState({
    socialMedia: {},
    loading: true,
  });
  const [channelInfo, setChannelInfo] = useState({});
  const { ref, inView } = useInView({ threshold: 0.7 });

  useEffect(() => {
    if (!user?.userState?.userName || !channeld) {
      setMessage((prev) => ({
        ...prev,
        message:
          settings.settingsState.language === "English"
            ? "please log in to access this page"
            : "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        status: false,
      }));

      const timer = setTimeout(() => {
        navigate("/");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [channeld, channeld, user?.userState?.userName]);

  useEffect(() => {
    if (inView) {
      setVideosState((prev) => {
        return { ...prev, limiet: videosState.limiet + videosState.limiet };
      });
    }
    async function fetchData() {
      try {
        const result = await getChannelVideosService(
          channeld,
          videosState.limiet
        );

        if (!result.ok) {
          setVideosState((prev) => {
            return { ...prev, loading: true };
          });
          return;
        }

        setVideosState((prev) => {
          return { ...prev, loading: false, videos: result.videos };
        });
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [, inView]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getSocialMediaInfoService(channeld);

        if (!result.ok) {
          setSocialMediaInfo((prev) => {
            return { ...prev, loading: true };
          });
          return;
        }
        setSocialMediaInfo((prev) => {
          return { ...prev, loading: false, socialMedia: result.socialMedia };
        });
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getChannelInfoService(channeld);

        if (result.ok) {
          setChannelInfo(result.stats);

          setLoading(false);
          return;
        }
        navigate("/");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [channeld]);

  async function handleSubscribeToChannel() {
    if (!user?.userState?.userName) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settings.settingsState.language == "English"
              ? "You have to log ni first"
              : "يجب عليك تسجيل دخول",
          status: false,
        };
      });
    }

    setLoading(true);
    try {
      const result = await subscribeToChannelService(channeld);

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });
        setSubscribeMode("unsubscribe");

        location.pathname = location.pathname;
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleuUnsubscribeToChannel() {
    setLoading(true);
    try {
      const result = await unsubscribeToChannelService(channeld);

      if (result.ok) {
        setSubscribeMode("subscribed");

        location.pathname = location.pathname;

        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[5px] h-133 md:h-130 overflow-auto">
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
      {loading && <Loading />}
      <div
        className={clsx("flex-col sm:flex-row flex gap-2 w-full", {
          "flex md::flex-col-reverse":
            settings.settingsState.language == "Arabic",
        })}
      >
        <div
          className={clsx(
            "grid rounded-[5px] p-1 md:p-2 w-full h-fit",
            themes.fcolor.bg
          )}
        >
          <img
            className="rounded-full w-30 h-30 m-auto border-4 shadow-md border-[#eee]"
            src={
              channelInfo?.avatar_url
                ? channelInfo?.avatar_url
                : "public/Anonymous-user.jpg"
            }
            alt="channel avatar"
          />
          <h2 className="text-center my-2 font-semibold text-2xl">
            {channelInfo?.name}
          </h2>
          <div className="flex items-center m-auto">
            <div className="flex gap-1 items-center">
              {settings.settingsState.language == "English" ? (
                <p
                  className={clsx(
                    "p-1 rounded-[5px] text-[10px]",
                    themes.mainColor.bg
                  )}
                >
                  {channelInfo?.subscriptions} subscribers
                </p>
              ) : (
                <p
                  className={clsx(
                    "p-1 rounded-[5px] text-[10px]",
                    themes.mainColor.bg
                  )}
                >
                  مشترك {channelInfo?.subscriptions}
                </p>
              )}
              {settings.settingsState.language == "English" ? (
                <p
                  className={clsx(
                    "p-1 rounded-[5px] text-[10px]",
                    themes.mainColor.bg
                  )}
                >
                  {channelInfo?.views_total} views
                </p>
              ) : (
                <p
                  className={clsx(
                    "p-1 rounded-[5px] text-[10px]",
                    themes.mainColor.bg
                  )}
                >
                  مشاهدة {channelInfo?.subscriptions}
                </p>
              )}
            </div>
          </div>
          <p className="text-[12px] sm:text-[14px] font-sans text-center line-clamp-3 overflow-hidden">
            {channelInfo?.description}
          </p>
          <div className={clsx("grid gap-1 p-1 mt-2")}>
            <h3
              className={clsx(
                "text-[13px] sm:text-[15px] font-semibold p-1 rounded-[5px] line-clamp-1 overflow-hidden",
                themes.mainColor.bg,
                { "text-end": settings.settingsState.language == "Arabic" }
              )}
            >
              {settings.settingsState.language == "English"
                ? "Social media"
                : "وسائل التواصل الاجتماعي"}
            </h3>
            <div className="grid grid-cols-2 gap-0.5">
              {socialMediaInfo?.socialMedia &&
              Object.keys(socialMediaInfo.socialMedia).length > 1 ? (
                Object.entries(socialMediaInfo.socialMedia).map(
                  ([key, value], index) => {
                    if (key !== "id")
                      return (
                        <div
                          key={index}
                          className={clsx(
                            "flex items-center gap-1 text-[11px] p-1 line-clamp-1 overflow-hidden",
                            themes.mainColor.bg,
                            {
                              "justify-start flex-row-reverse":
                                settings.settingsState.language === "Arabic",
                            }
                          )}
                        >
                          {settings.settingsState.language === "English" ? (
                            <>
                              <p>{key}:</p>
                              <a href={value}>{value}</a>
                            </>
                          ) : (
                            <>
                              <p>
                                :
                                {key === "facebook"
                                  ? "فيسبوك"
                                  : key === "twitter"
                                  ? "تويتر"
                                  : key === "snapchat"
                                  ? "سناب شات"
                                  : key === "instagram"
                                  ? "انستغرام"
                                  : "تيلقرام"}
                              </p>
                              <a href={value}>{value}</a>
                            </>
                          )}
                        </div>
                      );
                  }
                )
              ) : (
                <p className="text-sm text-gray-400">
                  No social media links available.
                </p>
              )}
            </div>
          </div>
          {subscribeMode == "subscribed" ? (
            <button
              onClick={() => {
                handleuUnsubscribeToChannel();
              }}
              className={clsx(
                "sm:p-2 p-1 rounded-[10px] bg-blue-700 duration-150 hover:bg-blue-800 mt-4",
                themes.secondColor.color
              )}
            >
              {settings.settingsState.language == "English"
                ? "Unsubscribe"
                : "إلغاء الاشتراك"}
            </button>
          ) : (
            <button
              onClick={() => {
                handleSubscribeToChannel();
              }}
              className={clsx(
                "sm:p-2 p-1 rounded-[10px] duration-150 mt-4 hover:bg-[#f1f1f147]",
                themes.fcolor.bg,
                themes.secondColor.color
              )}
            >
              {settings.settingsState.language == "English"
                ? "Subscribe"
                : "اشتراك"}
            </button>
          )}
        </div>
        <div
          className={clsx(
            "grid gap-3 rounded-[5px] relative w-full content-start"
          )}
        >
          <div
            className={clsx("flex justify-between items-center", {
              "flex-row-reverse": settings.settingsState.language == "Arabic",
            })}
          >
            <h1
              className={clsx(
                "h-10 text-[19px]",
                settings.settingsState.language === "Arabic"
                  ? "text-end pr-2 border-r-6 border-blue-600"
                  : "pl-2 border-l-6 border-blue-600"
              )}
            >
              {settings.settingsState.language == "English"
                ? "Lateset"
                : "الاحدث"}
            </h1>
            {settings.settingsState.language == "English" ? (
              <p className="text-[12px] text-gray-300 font-semibold">
                {videosState?.videos?.length} Videos
              </p>
            ) : (
              <p className="text-[12px] text-gray-300 font-semibold">
                {videosState?.videos?.length} الفيديوهات
              </p>
            )}
          </div>
          {videosState.loading ? (
            <div className="grid grid-cols-2 max-[1000px]:grid-cols-1 max-[640px]:grid-cols-2 max-[470px]:grid-cols-1 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse"
                >
                  <div className="relative overflow-hidden">
                    <div className="w-full h-32 sm:h-36 bg-gray-300 dark:bg-gray-700" />
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                    <div className="flex justify-between mt-3">
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-2 sm:px-0 videoscard">
              {videosState.videos.map((item, index) => (
                <div
                  onClick={() => {
                    navigate(`/display-video`, { state: { videoid: item.id } });
                  }}
                  key={index}
                  ref={
                    index == videosState.videos.length - 1 &&
                    channelInfo?.videos_total >= videosState?.limiet
                      ? ref
                      : null
                  }
                  className={clsx(
                    "group relative flex flex-col rounded-lg overflow-hidden",
                    "bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700",
                    "shadow-sm hover:shadow-md transition-all duration-200 font-sans"
                  )}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.thumbnail}
                      className="w-full h-28 sm:h-32 object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {item.optionsButton}
                    </div>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-2 text-[11px] sm:text-[12px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-1">
                      <img
                        src={item.avatar_url}
                        alt={item.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>{item.video_created.split("T")[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                  {inView && (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Loading more...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {message.status !== null ? (
        <ShowMessage value={{ message, setMessage }} />
      ) : null}
    </div>
  );
}
