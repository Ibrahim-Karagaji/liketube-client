import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import { playListVideosContext } from "../state-management/PlayListVideos";
import deleteVideoFromPlayListService from "../services/deleteVideoFromPlayListService";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import Loading from "./Loading";

export default function PlayList() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const user = useContext(userContext);
  const playListVideos = useContext(playListVideosContext);

  const navigate = useNavigate();

  const [message, setMessage] = useState({ message: "", status: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.userState?.userName) {
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
  }, []);

  async function handleDeleteVideoFromPlayList(videoid) {
    setLoading(true);
    try {
      const result = await deleteVideoFromPlayListService(videoid);

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

  return (
    <div className={clsx("rounded-[5px] h-133 md:h-130 overflow-auto")}>
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
      {loading && <Loading />}
      <div
        className={clsx(
          "grid p-2 pt-5 rounded-[5px] h-full content-start overflow-auto",
          themes.fcolor.bg
        )}
      >
        <i class="fa-solid fa-list text-center md:text-[25px] text-[20px]"></i>
        <h2 className="text-center mt-3 font-semibold tracking-tight">
          {settings.settingsState.language == "English"
            ? "playlist videos"
            : "قائمة تشغيل مقاطع الفيديو"}
        </h2>
        <p className="text-center text-[11px] sm:text-[13px] text-gray-300">
          {settings.settingsState.language == "English"
            ? "here's videos that you added to the playlist"
            : "إليك مقاطع الفيديو التي أضفتها إلى قائمة التشغيل"}
        </p>
        {playListVideos.playListVideosState.videos.length !== 0 ? (
          <div
            className={clsx(
              "grid gap-2 p-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 rounded-[5px]"
            )}
          >
            {playListVideos.playListVideosState.videos.map((item, index) => (
              <div className="grid">
                <div
                  onClick={() => {
                    navigate(`/display-video`, { state: { videoid: item.id } });
                  }}
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
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                     transition-all duration-300"
                    >
                      {item.optionsButton}
                    </div>
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
                        <span>{item.created_at.split("T")[0]}</span>
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
                <button
                  onClick={() => {
                    handleDeleteVideoFromPlayList(item.id);
                  }}
                  className={clsx(
                    "p-1 rounded-[10px] text-[13px] m-1 duration-150 hover:bg-[#9393933d] max-w-fit",
                    themes.fcolor.bg
                  )}
                >
                  {settings.settingsState.language == "English"
                    ? "Delete"
                    : "حذف"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid mt-20 text-center gap-2.5">
            <i className="fa-solid fa-ban text-[30px] md:text-[80px]"></i>
            <p className="text-[12px] md:text-[20px]">
              {settings.settingsState.language === "English"
                ? "you didn't add videos to playlist"
                : "لم تقم بإضافة مقاطع الفيديو إلى قائمة التشغيل"}
            </p>
          </div>
        )}
      </div>
      {message.status !== null ? (
        <ShowMessage value={{ message, setMessage }} />
      ) : null}
    </div>
  );
}
