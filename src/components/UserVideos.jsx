import { useContext, useEffect, useState, useRef } from "react";
import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import { channelContext } from "../state-management/ChannelState";
import { userContext } from "../state-management/UserState";
import { useNavigate, Link } from "react-router-dom";
import clsx from "clsx";
import ShowMessage from "./ShowMessage";
import Loading from "./Loading";
import getUserVideosService from "../services/getUserVideosService";
import deleteUserVideoService from "../services/deleteUserVideoService";

export default function UserVideos() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const channel = useContext(channelContext);
  const user = useContext(userContext);

  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState({
    type: "random",
    order: "random",
  });

  const [userVideos, setUserVideos] = useState({ loading: false, videos: [] });
  const [message, setMessage] = useState({ message: "", status: null });
  const deleteDialogRef = useRef(null);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    if (!user?.userState?.userName || !channel?.channelState?.id) {
      setMessage({
        message:
          settings.settingsState.language === "English"
            ? "Please log in to access this page"
            : "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        status: false,
      });

      const timer = setTimeout(() => navigate("/"), 300);
      return () => clearTimeout(timer);
    }

    async function fetchData() {
      setUserVideos((prev) => ({ ...prev, loading: true }));
      try {
        const result = await getUserVideosService(sortOption);
        if (!result.ok) {
          setMessage({ message: result.message, status: false });
          return;
        }
        setUserVideos({ loading: false, videos: result.videos });
      } catch (err) {
        setMessage({
          message: err.message ?? "Error fetching videos",
          status: false,
        });
      } finally {
        setUserVideos((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchData();
  }, [
    user?.userState?.userName,
    channel?.channelState?.id,
    sortOption,
    settings.settingsState.language,
  ]);

  const openDeleteDialog = (videoId) => {
    setVideoToDelete(videoId);
    deleteDialogRef.current?.showModal();
  };

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;
    setUserVideos((prev) => ({ ...prev, loading: true }));
    try {
      const result = await deleteUserVideoService(
        channel.channelState.id,
        videoToDelete
      );
      if (!result.ok) {
        setMessage({ message: result.message, status: false });
      } else {
        setMessage({ message: result.message, status: true });
        setUserVideos((prev) => ({
          ...prev,
          videos: prev.videos.filter((v) => v.id !== videoToDelete),
        }));
      }
    } catch (err) {
      setMessage({
        message: err.message ?? "Error deleting video",
        status: false,
      });
    } finally {
      setUserVideos((prev) => ({ ...prev, loading: false }));
      setVideoToDelete(null);
      deleteDialogRef.current?.close();
    }
  };

  const handleDeleteCancel = () => {
    setVideoToDelete(null);
    deleteDialogRef.current?.close();
  };

  return (
    <div
      className={clsx(
        themes.mainColor.bg,
        themes.secondColor.color,
        "min-h-screen p-4 md:p-6"
      )}
    >
      {userVideos.loading && <Loading />}
      <div
        className={clsx(
          "relative max-w-[1200px] mx-auto p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg mb-6",
          themes.fcolor.bg
        )}
      >
        <div className="absolute top-3 right-3 flex gap-2">
          {["EN", "AR"].map((lang) => (
            <button
              key={lang}
              onClick={() =>
                settings.setSettings({
                  ...settings.settingsState,
                  language: lang === "EN" ? "English" : "Arabic",
                })
              }
              className="px-3 py-1 rounded-full border text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {lang}
            </button>
          ))}
        </div>
        <h1 className="text-xl font-bold mb-4 text-center">
          {settings.settingsState.language === "English"
            ? "Filter Videos"
            : "فرز الفيديوهات"}
        </h1>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            className={clsx(
              "px-5 py-2 rounded-full text-sm font-medium border transition",
              sortOption.type === "random"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            onClick={() => setSortOption({ type: "random", order: "random" })}
          >
            {settings.settingsState.language === "English"
              ? "Random"
              : "عشوائي"}
          </button>

          {["likes", "comments", "views"].map((type) => (
            <div
              key={type}
              className="flex flex-col gap-2 w-40 min-w-[120px] p-2 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm border"
            >
              <h3 className="text-center font-semibold text-sm">
                {settings.settingsState.language === "English"
                  ? type.charAt(0).toUpperCase() + type.slice(1)
                  : type === "likes"
                  ? "اعجابات"
                  : type === "comments"
                  ? "تعليقات"
                  : "مشاهدات"}
              </h3>
              <div className="flex gap-2">
                <button
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition",
                    sortOption.type === type && sortOption.order === "most"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                  )}
                  onClick={() => setSortOption({ type, order: "most" })}
                >
                  {settings.settingsState.language === "English"
                    ? "Most"
                    : "الاكثر"}
                </button>
                <button
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition",
                    sortOption.type === type && sortOption.order === "lowest"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                  )}
                  onClick={() => setSortOption({ type, order: "lowest" })}
                >
                  {settings.settingsState.language === "English"
                    ? "Lowest"
                    : "الاقل"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
        {userVideos.videos.length > 0 ? (
          userVideos.videos.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-base">
                  {item.title}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>{item.views} views</span>
                  <span>{item.video_created.split("T")[0]}</span>
                </div>
                <button
                  onClick={() => openDeleteDialog(item.id)}
                  className="mt-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                >
                  {settings.settingsState.language === "English"
                    ? "Delete"
                    : "حذف"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            {settings.settingsState.language === "English"
              ? "No videos uploaded yet"
              : "لم يتم تحميل الفيديو بعد"}
          </p>
        )}
      </div>
      <Link to={"/"} className="w-full">
        <button
          className={clsx(
            "p-2 w-full mt-2 rounded-[5px] duration-200 hover:bg-[#8080805e]",
            themes.fcolor.bg
          )}
        >
          {settings.settingsState.language == "English" ? "BACK" : "رجوع"}
        </button>
      </Link>
      <dialog
        ref={deleteDialogRef}
        className="rounded-xl p-5 bg-white dark:bg-gray-800 shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <p className="text-center text-sm text-gray-900 dark:text-white">
          {settings.settingsState.language === "English"
            ? "Are you sure you want to delete this video?"
            : "هل أنت متأكد أنك تريد حذف هذا الفيديو؟"}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleDeleteConfirm}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            {settings.settingsState.language === "English" ? "Delete" : "حذف"}
          </button>
          <button
            onClick={handleDeleteCancel}
            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {settings.settingsState.language === "English" ? "Cancel" : "إلغاء"}
          </button>
        </div>
      </dialog>
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
    </div>
  );
}
