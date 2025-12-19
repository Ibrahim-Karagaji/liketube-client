import { useContext, useEffect, useState } from "react";
import { serachContext } from "../state-management/SearchState";
import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import getChannelsService from "../services/getChannelsService";
import searchVideoService from "../services/searchVideoService";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

export default function Search() {
  const searchState = useContext(serachContext);
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);

  const { ref, inView } = useInView({ threshold: 1.0 });

  const [channels, setChannels] = useState({
    channels_totle: 0,
    channels: [],
    loading: true,
    limit: 8,
  });

  const [videos, setVideos] = useState({
    videos_totle: 0,
    videos: [],
    loading: true,
    limit: 6,
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getChannelsService(
          channels.limit,
          searchState.searchState.serach
        );

        if (result.ok) {
          setChannels((prev) => {
            return {
              ...prev,
              channels_totle: result.total_channels,
              channels: result.channels,
            };
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setChannels((prev) => {
          return { ...prev, loading: false };
        });
      }
    }
    fetchData();
  }, [searchState.searchState.serach, channels.limit]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await searchVideoService(
          videos.limit,
          searchState.searchState.serach
        );
        if (result.ok) {
          setVideos((prev) => {
            return {
              ...prev,
              videos: result.videos,
              videos_totle: result.total_videos,
            };
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setVideos((prev) => {
          return { ...prev, loading: false };
        });
      }
    }
    fetchData();
  }, [searchState.searchState.serach, videos.limit]);

  useEffect(() => {
    if (!inView) return;

    if (searchState.searchState.content == "videos")
      setVideos((prev) => {
        return { ...prev, limit: (prev.limit += prev.limit) };
      });
    else
      setChannels((prev) => {
        return { ...prev, limit: (prev.limit += prev.limit) };
      });
  }, [inView]);

  return (
    <div className="p-1 md:p-2 grid overflow-auto">
      <div
        className={clsx(
          "flex gap-1 items-center justify-center text-[13px] md:text-[15px]"
        )}
      >
        <div
          onClick={() => {
            searchState.setSearchState((prev) => {
              return {
                ...prev,
                content: "videos",
              };
            });
          }}
          className={clsx(
            "flex gap-1 items-center py-1 md:py-2 px-3 md:px-4 rounded-[10px] duration-150",
            searchState.searchState.content === "channels"
              ? themes.thirdColor.bg
              : "bg-[#585757]"
          )}
        >
          <p>
            {settings.settingsState.language == "English"
              ? "Videos"
              : "فيديوهات"}
          </p>
          <i class="fa-solid fa-video"></i>
        </div>
        <div
          onClick={() => {
            searchState.setSearchState((prev) => {
              return {
                ...prev,
                content: "channels",
              };
            });
          }}
          className={clsx(
            "flex gap-1 items-center py-1 md:py-2 px-3 md:px-4 rounded-[10px] duration-150",
            searchState.searchState.content === "videos"
              ? themes.thirdColor.bg
              : "bg-[#585757]"
          )}
        >
          <p>
            {settings.settingsState.language == "English"
              ? "Channels"
              : "قنوات"}
          </p>
          <i class="fa-solid fa-earth-africa"></i>
        </div>
      </div>
      {settings.settingsState.language == "English" ? (
        <p className="text-center text-gray-500 mt-2 md:text-[14px] text-[11px]">
          click <span className="font-extrabold">search</span> button to search
          again
        </p>
      ) : (
        <p className="text-center text-gray-500 mt-2 md:text-[14px] text-[11px]">
          للبحث مرة اخرى <span className="font-extrabold">البحث</span> انقر على
          زر
        </p>
      )}
      <h1
        className={clsx(
          "duration-150 h-8 content-center font-semibold text-[16px] md:text-[19px] my-5",
          settings.settingsState.language == "English"
            ? "border-l-6 border-blue-600 pl-2"
            : "border-r-6 border-blue-600 text-right pr-2"
        )}
      >
        {searchState.searchState.content == "channels"
          ? settings.settingsState.language == "English"
            ? "Channels"
            : "قنوات"
          : settings.settingsState.language == "English"
          ? "Videos"
          : "فيدوهات"}
      </h1>
      <div className={clsx("overflow-auto p-1")}>
        {searchState.searchState.content == "videos" ? (
          videos.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={clsx(
                    "group relative flex flex-col rounded-xl overflow-hidden",
                    "bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700",
                    "shadow-sm font-sans animate-pulse",
                    themes.mainColor.bg
                  )}
                >
                  <div className="relative overflow-hidden">
                    <div className="w-full h-32 sm:h-36 bg-gray-300 dark:bg-gray-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0" />
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    <div className="flex items-center gap-0.5 -ml-1 mt-1">
                      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                      <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded ml-1" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] sm:text-[12px] mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 bg-gray-300 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 bg-gray-300 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : videos.videos.length != 0 ? (
            <div
              className={clsx(
                "grid gap-2 p-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 rounded-[5px]"
              )}
            >
              {videos.videos.map((item, index) => (
                <Link to={"/display-video"} state={{ videoid: item.id }}>
                  <div
                    ref={videos.limit <= videos.videos_totle ? ref : null}
                    className="grid"
                  >
                    <div
                      key={index}
                      className={clsx(
                        "group relative flex flex-col rounded-xl overflow-hidden",
                        "bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700",
                        "shadow-sm hover:shadow-lg transition-all duration-300 font-sans",
                        themes.mainColor.bg
                      )}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={item.thumbnail}
                          className="w-full h-32 sm:h-36 object-cover transition-all duration-300
                     group-hover:scale-[1.08] group-hover:brightness-85"
                        />
                        <div
                          className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                      <div className="p-3 flex flex-col gap-2">
                        <p
                          className="font-medium text-gray-900 dark:text-white
                     line-clamp-2 text-[12px] sm:text-[14px] 
                     leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400
                     transition-colors"
                        >
                          {item.title}
                        </p>
                        <div className="flex items-center gap-0.5 -ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="18px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            stroke="#99a1af"
                            fill="#99a1af"
                          >
                            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-7-.5-14.5T799-507q-5 29-27 48t-52 19h-80q-33 0-56.5-23.5T560-520v-40H400v-80q0-33 23.5-56.5T480-720h40q0-23 12.5-40.5T563-789q-20-5-40.5-8t-42.5-3q-134 0-227 93t-93 227h200q66 0 113 47t47 113v40H400v110q20 5 39.5 7.5T480-160Z" />
                          </svg>
                          <p className="text-[11px] sm:text-[12px] text-gray-500 dark:text-gray-400">
                            {item.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] sm:text-[12px] text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{item.video_created.split("T")[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 font-medium">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span>{item.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid content-center text-center mt-25 gap-4">
              <h1 className="text-2xl">
                {settings.settingsState.language == "English"
                  ? "No results"
                  : "لا توجد نتائج"}
              </h1>
              <i class="fa-solid fa-ban text-6xl"></i>
            </div>
          )
        ) : channels.loading ? (
          <div className="grid [@media(min-width:820px)]:grid-cols-2 grid-cols-1 gap-2 mt-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="grid" key={index}>
                <div
                  className={clsx(
                    "flex p-2 rounded-[5px] gap-2",
                    "shadow-[0px_0px_5px_0px_#f1f1f1]",
                    "animate-pulse",
                    themes.mainColor.bg
                  )}
                >
                  <div className="rounded-full sm:w-15 sm:h-15 w-13 h-13 bg-gray-300 dark:bg-gray-700" />
                  <div className="grid gap-2 content-start w-full">
                    <div className="flex justify-between items-center gap-2">
                      <div className="h-4 md:h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full max-w-60" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/5 max-w-60" />
                    </div>
                    <div
                      className={clsx("sm:flex grid gap-1", {
                        "justify-end":
                          settings.settingsState.language === "Arabic",
                      })}
                    >
                      <div className="h-5 w-28 bg-gray-300 dark:bg-gray-700 rounded-[5px]" />
                      <div className="h-5 w-28 bg-gray-300 dark:bg-gray-700 rounded-[5px]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : channels.channels.length != 0 ? (
          <div className="grid [@media(min-width:820px)]:grid-cols-2 grid-cols-1 gap-2 mt-3">
            {channels.channels.map((item, index) => {
              return (
                <div
                  ref={channels.limit <= channels.channels_totle ? ref : null}
                  className="grid"
                  key={index}
                >
                  <div
                    onClick={() => {
                      navigate("/channel-info", { state: { id: item.id } });
                    }}
                    className={clsx(
                      "flex p-2 rounded-[5px] gap-2 shadow-[0px_0px_5px_0px_#f1f1f1] duration-150 hover:-translate-y-0.5",
                      themes.mainColor.bg
                    )}
                  >
                    <img
                      className={clsx("rounded-full sm:w-15 sm:h-15 w-13 h-13")}
                      src={item.avatar_url}
                      alt="channel image"
                    />
                    <div className="grid gap-1 content-start w-full">
                      <div className="flex justify-between items-center">
                        <h2 className="text-[15px] md:text-[18px] line-clamp-1 overflow-hidden">
                          {item.name}
                        </h2>
                        <span
                          className={clsx(
                            "text-[9px] p-1 rounded-[10px]",
                            themes.fcolor.bg
                          )}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 max-w-60 line-clamp-2 overflow-hidden">
                        {item.description}
                      </p>
                      <div
                        className={clsx("sm:flex grid gap-1", {
                          "justify-end":
                            settings.settingsState.language == "Arabic",
                        })}
                      >
                        <div
                          className={clsx(
                            "flex gap-1 items-center rounded-[5px] p-1 w-fit",
                            themes.fcolor.bg
                          )}
                        >
                          {settings.settingsState.language == "English" ? (
                            <>
                              <i class="fa-regular fa-calendar-days text-[10px]"></i>
                              <p className="text-[10px]">
                                created at {item.created_at.split("T")[0]}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-[9px]">
                                تم انشاؤه {item.created_at.split("T")[0]}
                              </p>
                              <i class="fa-regular fa-calendar-days text-[10px]"></i>
                            </>
                          )}
                        </div>
                        <div
                          className={clsx(
                            "flex gap-1 items-center rounded-[5px] p-1 w-fit",
                            themes.fcolor.bg
                          )}
                        >
                          {settings.settingsState.language == "English" ? (
                            <>
                              <i class="fa-regular fa-calendar-days text-[10px]"></i>
                              <p className="text-[10px]">
                                subscribers {item.subscripbers}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-[9px]">
                                المشتركين{item.subscripbers}
                              </p>
                              <i class="fa-solid fa-users text-[10px]"></i>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid content-center text-center mt-25 gap-4">
            <h1 className="text-2xl">
              {settings.settingsState.language == "English"
                ? "No results"
                : "لا توجد نتائج"}
            </h1>
            <i class="fa-solid fa-ban text-6xl"></i>
          </div>
        )}
      </div>
    </div>
  );
}
