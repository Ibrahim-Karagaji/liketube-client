import clsx from "clsx";
import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import Loading from "./Loading";
import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getVideoService from "../services/getVideoService";
import addLikeToVideoService from "../services/addLikeToVideoService";
import deleteLikeFromVideoService from "../services/deleteLikeFromVideoService";
import addToPlayListService from "../services/addToPlayListService";
import deleteVideoFromPlayListService from "../services/deleteVideoFromPlayListService";
import subscribeToChannelService from "../services/subscribeToChannelService";
import unsubscribeToChannelService from "../services/unsubscribeToChannelService";
import getVideoCommentsService from "../services/getVideoCommentsService";
import addCommentService from "../services/addCommentService";
import deleteCommentServce from "../services/deleteCommentServce";
import incrementVideoViewsService from "../services/incrementVideoViewsService";
import recordViewHistoryService from "../services/recordViewHistoryService";
import { likedVideosContext } from "../state-management/LikedVideos";
import { subscribedChannelsContext } from "../state-management/SubscribedChannelsState";
import { playListVideosContext } from "../state-management/PlayListVideos";
import ShowMessage from "./ShowMessage";

export default function DisplayVideo() {
  const playerRef = useRef(null);
  const commentInput = useRef(null);

  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const user = useContext(userContext);
  const likedVideos = useContext(likedVideosContext);
  const subscribedChannels = useContext(subscribedChannelsContext);
  const playListVideos = useContext(playListVideosContext);

  const navigate = useNavigate();

  const { videoid } = useLocation().state || {};

  const [videoState, setVideoState] = useState({
    video: {
      channel_avatar: "",
      channel_id: "",
      channel_name: "",
      description: "",
      likes: 0,
      subscriptions: 0,
      thumbnail: "",
      title: "",
      video_created: "",
      video_id: "",
      video_url: "",
      views: 0,
    },
    loading: true,
  });
  const [mode, setMode] = useState("overview");
  const [commentState, setCommentState] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState({ message: "", status: null });

  const handleCancelInput = () => {
    setCommentState("");
    if (commentInput.current) commentInput.current.value = "";
  };

  useEffect(() => {
    async function getVideoComments() {
      setLoading(true);
      try {
        const result = await getVideoCommentsService(videoState.video.video_id);

        setComments(result.comments);
      } catch (err) {
        setMessage((prev) => {
          return { ...prev, message: err.message, status: false };
        });
      } finally {
        setLoading(false);
      }
    }
    getVideoComments();
  }, [videoState.video.video_id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getVideoService(videoid);

        if (result.ok) {
          setVideoState((prev) => {
            return {
              ...prev,
              video: {
                channel_avatar: result.video.channel_avatar,
                channel_id: result.video.channel_id,
                channel_name: result.video.channel_name,
                description: result.video.description,
                likes: result.video.likes,
                subscriptions: result.video.subscriptions,
                thumbnail: result.video.subscriptions,
                title: result.video.subscriptions,
                video_created: result.video.video_created,
                video_id: result.video.video_id,
                video_url: result.video.video_url,
                views: result.video.views,
              },
            };
          });
          return;
        }
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!user.userState.userName || !videoid) {
      setMessage({
        message:
          settings.settingsState.language === "English"
            ? "Please log in to access this page"
            : "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        status: false,
      });

      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [videoid, user.userState.userName]);

  useEffect(() => {
    if (!videoState?.video?.video_url) return;

    const match = videoState.video.video_url.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = match?.[1];

    if (!videoId) {
      setVideoState((prev) => {
        return { ...prev, loading: true };
      });
      return;
    }

    setVideoState((prev) => {
      return { ...prev, loading: false };
    });

    const loadYT = () => {
      if (!window.YT || !window.YT.Player) {
        console.log("YT API not ready yet");
        return;
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          fs: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              handleIncrementVideoViews();
              if (settings.settingsState.save_watch_history) {
                recordViewHistory();
              }
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = loadYT;
    } else {
      loadYT();
    }
  }, [videoState?.video?.video_url]);

  async function handleAddlikeToVideo() {
    setLoading(true);
    try {
      const result = await addLikeToVideoService(videoState.video.video_id);

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteLikeFromVideo() {
    setLoading(true);

    try {
      const result = await deleteLikeFromVideoService(
        videoState.video.video_id
      );

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function hadnleAddToPlayList() {
    setLoading(true);
    try {
      const result = await addToPlayListService(videoState.video.video_id);

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVideoFromPlayList() {
    setLoading(true);
    try {
      const result = await deleteVideoFromPlayListService(
        videoState.video.video_id
      );

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribeToChannel() {
    setLoading(true);
    try {
      const result = await subscribeToChannelService(
        videoState.video.channel_id
      );

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);
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
      const result = await unsubscribeToChannelService(
        videoState.video.channel_id
      );

      if (result.ok) {
        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);

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

  async function handleAddComment() {
    setLoading(true);
    try {
      const result = await addCommentService(
        commentState,
        videoState.video.video_id
      );

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 300);

        if (commentInput.current) commentInput.current.value = "";
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteComment(commentid) {
    setLoading(true);
    try {
      const result = await deleteCommentServce(
        videoState.video.video_id,
        commentid
      );

      if (result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });

        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 1000);
      }
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleIncrementVideoViews() {
    try {
      await incrementVideoViewsService(videoState.video.video_id);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function recordViewHistory() {
    try {
      await recordViewHistoryService(videoState.video.video_id);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={clsx("h-screen p-2 overflow-auto", {
        "flex-row-reverse": settings.settingsState.language === "Arabic",
      })}
    >
      {loading && <Loading />}
      <div className="relative w-full h-[60%]">
        <div id="youtube-player" className="w-full h-full"></div>
        {videoState.loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-red-500 font-semibold text-center p-2">
            Invalid YouTube link provided.
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-center mt-2 md:text-[15px] text-[11px]">
        <button
          onClick={() => {
            setMode(mode === "overview" ? "comments" : "overview");
          }}
          className={clsx(
            "flex gap-2 p-2 rounded-[10px] items-center duration-200",
            themes.fcolor.bgHover,
            { "shadow-[0px_0px_5px_0px_#f1f1f1]": mode === "overview" }
          )}
        >
          <h2>
            {settings.settingsState.language === "English"
              ? "overview"
              : "نظرة عامة"}
          </h2>
          <i className="fa-solid fa-address-card"></i>
        </button>
        <button
          onClick={() => {
            setMode(mode === "overview" ? "comments" : "overview");
          }}
          className={clsx(
            "flex gap-2 p-2 rounded-[10px] items-center duration-200",
            themes.fcolor.bgHover,
            { "shadow-[0px_0px_5px_0px_#f1f1f1]": mode === "comments" }
          )}
        >
          <h2>
            {settings.settingsState.language === "English"
              ? "comments"
              : "تعليقات"}
          </h2>
          <i className="fa-solid fa-comment"></i>
        </button>
      </div>
      {mode === "comments" ? (
        <div
          className={clsx("grid mt-2 mb-20", {
            "text-end": settings.settingsState.language === "Arabic",
          })}
        >
          <div className="h-[35vh] overflow-y-auto p-1">
            <div className="grid p-2 md:p-3 rounded-[10px] bg-[#93939322]">
              <h2 className="font-semibold mb-2">
                {settings.settingsState.language === "English"
                  ? `Comments ${comments?.length}`
                  : `تعليقات ${comments?.length}`}
              </h2>
              <div
                className={clsx("flex gap-2", {
                  "flex-row-reverse":
                    settings.settingsState.language === "Arabic",
                })}
              >
                <img
                  className="rounded-[50%] md:w-13 w-10 md:h-13 h-10"
                  src={
                    user.userState.avatar
                      ? user.userState.avatar
                      : "public/Anonymous-user.jpg"
                  }
                  alt=""
                />
                <input
                  ref={commentInput}
                  onBlur={(e) => setCommentState(e.target.value)}
                  className={clsx(
                    "border-b border-b-[#ffffff80] focus:border-b-white transition-colors duration-200 w-full text-[12px] md:text-[14px] outline-none",
                    {
                      inputAr: settings.settingsState.language === "Arabic",
                    }
                  )}
                  placeholder={
                    settings.settingsState.language === "Arabic"
                      ? "اضف تعليق"
                      : "add comment"
                  }
                  type="text"
                />
              </div>
              <div
                className={clsx(
                  "flex items-center gap-2 text-[13px] md:text-[15px] mt-2.5",
                  {
                    "justify-end": settings.settingsState.language === "Arabic",
                  }
                )}
              >
                <button
                  onClick={() => {
                    handleAddComment();
                  }}
                  className={clsx(
                    "p-1 md:p-2 rounded-[10px] duration-200 hover:bg-[#ffffff1d]",
                    themes.fcolor.bg
                  )}
                >
                  {settings.settingsState.language === "English"
                    ? "add"
                    : "اضافة"}
                </button>
                <button
                  onClick={handleCancelInput}
                  className={clsx(
                    "p-1 md:p-2 rounded-[10px] duration-200 hover:bg-[#ffffff1d]",
                    themes.fcolor.bg
                  )}
                >
                  {settings.settingsState.language === "English"
                    ? "cancel"
                    : "الغاء"}
                </button>
              </div>
              <div
                className={clsx(
                  "grid md:p-2 p-1 rounded-[5px] mt-2 gap-2",
                  themes.mainColor.bg
                )}
              >
                {comments?.length > 0 ? (
                  comments.map((item, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "flex border-b border-b-[#ffffff80] p-1 gap-1 md:text-[14px] text-[12px]",
                        {
                          "content-end flex-row-reverse":
                            settings.settingsState.language === "Arabic",
                        }
                      )}
                    >
                      <img
                        className="sm:w-9 sm:h-9 md:w-11 md:h-11 w-7 h-7 rounded-full object-cover"
                        src={item.avatar_url}
                        alt={item.userName}
                      />
                      <div className="grid gap-1 w-full">
                        <h3 className="font-semibold">@{item.user_name}</h3>
                        <span
                          className={clsx("text-[10px] opacity-70 pl-3", {
                            "pr-3": settings.settingsState.language == "Arabic",
                          })}
                        >
                          {item.email}
                        </span>
                        <p>{item.comment}</p>
                        <span
                          className={clsx(
                            "md:text-[12px] text-[10px] text-end text-[#939393]",
                            {
                              "text-start":
                                settings.settingsState.language === "Arabic",
                            }
                          )}
                        >
                          {item.created_at.split("T")[0]}
                        </span>
                        {user.userState.email === item.email && (
                          <button
                            onClick={() => handleDeleteComment(item.id)}
                            className={clsx(
                              "rounded-[5px] duration-200 hover:bg-[#f1f1f129] font-semibold",
                              themes.fcolor.bg,
                              themes.secondColor.color
                            )}
                          >
                            {settings.settingsState.language == "English"
                              ? "delete"
                              : "حذف"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={clsx(
                      "flex flex-col items-center justify-center gap-2 py-4 text-[#939393]",
                      settings.settingsState.language === "Arabic" &&
                        "text-right"
                    )}
                  >
                    <i className="fa-solid fa-comments text-2xl"></i>
                    <p className="sm:text-sm text-[12px]">
                      {settings.settingsState.language === "English"
                        ? "No comments yet. Be the first to comment!"
                        : "لا توجد تعليقات بعد. كن أول من يعلق!"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            "flex flex-col md:flex-row items-start md:items-center p-2 md:p-3 rounded-lg mt-3 gap-2 mb-20",
            themes.fcolor.bg,
            settings.settingsState.language !== "English" &&
              "md:flex-row-reverse"
          )}
        >
          <img
            onClick={() =>
              navigate("/channel-info", {
                state: { id: videoState.video.channel_id },
              })
            }
            src={
              videoState.video.channel_avatar
                ? videoState.video.channel_avatar
                : "public/Anonymous-user.jpg"
            }
            className={clsx(
              "rounded-full w-12 h-12 md:w-14 md:h-14 object-cover",
              { "ml-auto": settings.settingsState.language === "Arabic" }
            )}
            alt="channel"
          />
          <div
            className={clsx(
              "flex flex-col gap-2 w-full",
              settings.settingsState.language !== "English" && "text-right"
            )}
          >
            <div
              className={clsx(
                "flex flex-col md:flex-row md:items-center justify-between w-full gap-2",
                settings.settingsState.language !== "English" &&
                  "md:flex-row-reverse"
              )}
            >
              <div>
                <h1
                  className={clsx(
                    "text-lg font-semibold flex items-center gap-1",
                    settings.settingsState.language !== "English" &&
                      "flex-row-reverse"
                  )}
                >
                  {settings.settingsState.language === "English"
                    ? `${videoState.video.channel_name} channel`
                    : `قناة ${videoState.video.channel_name}`}
                  <i className="fa-solid fa-check text-blue-500 text-sm"></i>
                </h1>
                <div
                  className={clsx(
                    "text-xs opacity-70 sm:flex grid items-center gap-1 sm:gap-2",
                    settings.settingsState.language !== "English" &&
                      "flex-row-reverse"
                  )}
                >
                  <span>
                    {settings.settingsState.language === "English"
                      ? `${videoState.video.subscriptions} subscribers`
                      : `${videoState.video.subscriptions} مشترك`}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400 opacity-60"></span>
                  <span>
                    {settings.settingsState.language === "English"
                      ? `${videoState.video.views} views`
                      : `${videoState.video.views} مشاهدة`}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400 opacity-60"></span>
                  <span>
                    {settings.settingsState.language === "English"
                      ? `${videoState.video.likes} likes`
                      : `${videoState.video.likes} إعجاب`}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400 opacity-60"></span>
                  <span>
                    {settings.settingsState.language === "English"
                      ? `created at ${
                          videoState.video.video_created.split("T")[0]
                        }`
                      : `تم انشاؤه ${
                          videoState.video.video_created.split("T")[0]
                        }`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const isSubscribed =
                    Array.isArray(
                      subscribedChannels.subscribedChannelsState.channels
                    ) &&
                    subscribedChannels.subscribedChannelsState.channels.some(
                      (item) => item.id === videoState.video.channel_id
                    );

                  if (isSubscribed) {
                    handleuUnsubscribeToChannel();
                  } else {
                    handleSubscribeToChannel();
                  }
                }}
                className={clsx(
                  "px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out transform shadow-md",
                  Array.isArray(
                    subscribedChannels.subscribedChannelsState.channels
                  ) &&
                    subscribedChannels.subscribedChannelsState.channels.some(
                      (item) => item.id === videoState.video.channel_id
                    )
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : clsx(
                        themes.mainColor.bg,
                        themes.secondColor.color,
                        "hover:scale-102 hover:brightness-90"
                      )
                )}
              >
                {Array.isArray(
                  subscribedChannels.subscribedChannelsState.channels
                ) &&
                subscribedChannels.subscribedChannelsState.channels.some(
                  (item) => item.id === videoState.video.channel_id
                )
                  ? settings.settingsState.language === "English"
                    ? "Unsubscribe"
                    : "إلغاء الاشتراك"
                  : settings.settingsState.language === "English"
                  ? "Subscribe"
                  : "اشتراك"}
              </button>
            </div>
            <div
              className={clsx("flex gap-2 mt-2", {
                "justify-end": settings.settingsState.language == "Arabic",
              })}
            >
              <button
                onClick={() => {
                  const isLiked =
                    Array.isArray(likedVideos.likeVideosState.videos) &&
                    likedVideos.likeVideosState.videos.some(
                      (item) => item.id === videoState.video.video_id
                    );

                  if (isLiked) {
                    handleDeleteLikeFromVideo();
                  } else {
                    handleAddlikeToVideo();
                  }
                }}
                className={clsx(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition duration-200 ease-in-out",
                  Array.isArray(likedVideos.likeVideosState.videos) &&
                    likedVideos.likeVideosState.videos.some(
                      (item) => item.id === videoState.video.video_id
                    )
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : clsx(
                        themes.thirdColor.bg,
                        themes.thirdColor.border,
                        "hover:bg-[#212121]/80"
                      )
                )}
              >
                <i
                  className={clsx(
                    "fa-thumbs-up",
                    Array.isArray(likedVideos.likeVideosState.videos) &&
                      likedVideos.likeVideosState.videos.some(
                        (item) => item.id === videoState.video.video_id
                      )
                      ? "fa-solid text-white"
                      : "fa-regular text-[#eeeeee5f]"
                  )}
                ></i>
                {settings.settingsState.language === "English"
                  ? "Like"
                  : "إعجاب"}
              </button>
              <button
                key={videoState.video.video_id}
                onClick={() => {
                  const isInPlaylist =
                    Array.isArray(playListVideos.playListVideosState.videos) &&
                    playListVideos.playListVideosState.videos.some(
                      (item) => item.id === videoState.video.video_id
                    );

                  if (isInPlaylist) {
                    handleDeleteVideoFromPlayList();
                  } else {
                    hadnleAddToPlayList();
                  }
                }}
                className={clsx(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition duration-200 ease-in-out",
                  themes.thirdColor.bg,
                  themes.thirdColor.border,
                  Array.isArray(playListVideos.playListVideosState.videos) &&
                    playListVideos.playListVideosState.videos.some(
                      (item) => item.id === videoState.video.video_id
                    )
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "hover:bg-[#212121]/80"
                )}
              >
                <i
                  className={clsx(
                    "fa-plus fa-minus text-sm",
                    Array.isArray(playListVideos.playListVideosState.videos) &&
                      playListVideos.playListVideosState.videos.some(
                        (item) => item.id === videoState.video.video_id
                      )
                      ? "fa-solid text-white"
                      : "fa-regular text-[#eeeeee5f]"
                  )}
                ></i>
                {Array.isArray(playListVideos.playListVideosState.videos) &&
                playListVideos.playListVideosState.videos.some(
                  (item) => item.id === videoState.video.video_id
                )
                  ? settings.settingsState.language === "English"
                    ? "Delete from Playlist"
                    : "إزالة من القائمة"
                  : settings.settingsState.language === "English"
                  ? "Add to Playlist"
                  : "إضافة إلى القائمة"}
              </button>
            </div>
            <div className="mt-2">
              <h2 className="font-semibold text-sm mb-1">
                {settings.settingsState.language === "English"
                  ? "Video Description"
                  : "وصف الفيديو"}
              </h2>
              <p className="text-xs opacity-80 leading-snug">
                {videoState.video.description}
              </p>
            </div>
          </div>
        </div>
      )}
      {message.status !== null ? (
        <ShowMessage value={{ message, setMessage }} />
      ) : null}
    </div>
  );
}
