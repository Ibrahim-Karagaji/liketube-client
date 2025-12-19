import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { videosContaxt } from "../state-management/VideosState";
import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import { useNavigate } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import { useInView } from "react-intersection-observer";
export default function VideosCard() {
  const video = useContext(videosContaxt);
  const settings = useContext(settingsContext);
  const user = useContext(userContext);

  const { ref, inView } = useInView({ threshold: 1.0 });

  const [message, setMessage] = useState({ message: "", status: null });

  const navigate = useNavigate();

  useEffect(() => {
    if (!inView) return;
    video.setVideosState((prev) => {
      return { ...prev, limit: (video.videosState.limit += 8) };
    });
  }, [inView]);

  return video.videosState.loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2 sm:px-0 videoscard">
      {Array.from({ length: 8 }).map((_, index) => (
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
  ) : video.videosState.videos.length > 0 ? (
    <div
      className={clsx(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 sm:px-0 videoscard"
      )}
    >
      {video.videosState.videos.map((item, index) => (
        <div
          ref={
            video.videosState.videos_totle >= video.videosState.limit
              ? ref
              : null
          }
          onClick={() => {
            if (!user.userState.userName) {
              setMessage((prev) => {
                return {
                  ...prev,
                  message:
                    settings.settingsState.language == "English"
                      ? "You have to sign up/in first"
                      : "يجب عليك تسجيل دخول او انشاء حساب",
                  status: false,
                };
              });
              return;
            }
            navigate(`/display-video`, { state: { videoid: item.id } });
          }}
          key={index}
          className={clsx(
            "group relative flex flex-col rounded-xl overflow-hidden",
            "bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700",
            "shadow-sm hover:shadow-lg transition-all duration-300 font-sans"
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
          {message.status !== null ? (
            <ShowMessage value={{ message, setMessage }} />
          ) : null}
        </div>
      ))}
      {inView && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading more...</p>
        </div>
      )}
    </div>
  ) : (
    <div className="content-center grid h-full">
      <div className="grid justify-center text-center gap-2.5 ">
        <i className="fa-solid fa-ban text-[40px] md:text-[80px]"></i>
        <p className="text-[14px] md:text-[20px]">
          {settings.settingsState.language == "English"
            ? "No video uploaded yet"
            : "لم يتم تحميل الفيديو بعد"}
        </p>
      </div>
    </div>
  );
}
