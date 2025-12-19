import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import { channelContext } from "../state-management/ChannelState";
import { useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useNavigate, Link } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import Loading from "./Loading";
import uploadVideoService from "../services/uploadVideoService";

export default function UploadVdeo() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const user = useContext(userContext);
  const channel = useContext(channelContext);

  const submitInput = useRef(null);

  const [message, setMessage] = useState({ message: "", status: null });
  const [loading, setLoading] = useState(false);

  const [videoInfo, setVideoInfo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
  });

  const navigate = useNavigate();

  async function fetchData() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f14f";
    try {
      const result = await uploadVideoService(
        videoInfo,
        channel.channelState.id
      );

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
        submitInput.current.disabled = false;
        submitInput.current.style.backgroundColor = "#f1f1f1";
        return;
      }

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });

      setTimeout(() => {
        window.location.pathname = "/";
      }, 300);
    } catch (err) {
      setMessage((prev) => {
        return {
          ...prev,
          message: result.message?.message ?? result.message,
          status: result.ok,
        };
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const userName = user?.userState?.userName;
    const channelId = channel?.channelState?.id;
    const lang = settings?.settingsState?.language;

    if (!userName || !channelId) {
      setMessage({
        message:
          lang === "English"
            ? "Please log in to access this page"
            : "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        status: false,
      });

      const timer = setTimeout(() => {
        navigate("/");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    user?.userState?.userName,
    channel?.channelState?.id,
    settings?.settingsState?.language,
  ]);

  return (
    <div
      className={clsx(
        themes.mainColor.bg,
        themes.secondColor.color,
        "h-screen content-center p-1"
      )}
    >
      {loading && <Loading />}
      <form
        onSubmit={(e) => e.preventDefault()}
        className={clsx(
          themes.fcolor.bg,
          "relative gap-1 text-center grid w-full max-w-full sm:max-w-[550px] md:max-w-[650px] rounded-lg p-1 sm:p-1.5 m-auto shadow-[0px_0px_2px_0px_#e5e5e5]"
        )}
      >
        <div className="absolute top-0.5 right-0.5 flex gap-0.5">
          <button
            type="button"
            className="px-1 py-0.5 text-[9px] sm:text-[10px] border rounded"
            onClick={() => {
              localStorage.setItem("language", "English");
              settings.setSettings({
                ...settings.settingsState,
                language: "English",
              });
            }}
          >
            EN
          </button>
          <button
            type="button"
            className="px-1 py-0.5 text-[9px] sm:text-[10px] border rounded"
            onClick={() => {
              localStorage.setItem("language", "Arabic");
              settings.setSettings({
                ...settings.settingsState,
                language: "Arabic",
              });
            }}
          >
            AR
          </button>
        </div>
        <i className="fa-solid fa-download text-[16px] md:text-[20px]"></i>
        <h1 className="font-semibold text-[16px] md:text-[20px] mt-1">
          {settings.settingsState.language === "English"
            ? "Upload Video"
            : "رفع فيديو"}
        </h1>
        <p className="text-gray-400 text-[11px] md:text-[14px]">
          {settings.settingsState.language === "English"
            ? "Share your content with the world"
            : "شارك محتواك مع العالم"}
        </p>
        <div
          className={clsx(
            themes.mainColor.bg,
            "p-1.5 rounded-[5px] grid gap-2 text-[11px] md:text-[14px] shadow-[0px_0px_2px_0px_#e5e5e5]"
          )}
        >
          <div className="grid gap-1">
            <p
              className={clsx("text-start pl-1 pr-1", {
                "ml-auto": settings.settingsState.language === "Arabic",
              })}
            >
              {settings.settingsState.language === "English"
                ? "title"
                : "عنوان"}
            </p>
            <input
              onBlur={(e) =>
                setVideoInfo((prev) => {
                  return { ...prev, title: e.target.value };
                })
              }
              placeholder={
                settings.settingsState.language === "English"
                  ? "title"
                  : "عنوان"
              }
              type="text"
              min={3}
              required
              name="title"
              className={clsx(
                "p-1.5 rounded-sm shadow-[0px_0px_2px_0px_#e5e5e5]",
                { inputAr: settings.settingsState.language === "Arabic" }
              )}
            />
          </div>
          <div className="grid gap-1">
            <p
              className={clsx("text-start pl-1 pr-1", {
                "ml-auto": settings.settingsState.language === "Arabic",
              })}
            >
              {settings.settingsState.language === "English"
                ? "description (optional)"
                : "الوصف (اختياري)"}
            </p>
            <textarea
              onBlur={(e) =>
                setVideoInfo((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }
              rows={3}
              placeholder={
                settings.settingsState.language === "English"
                  ? "description"
                  : "الوصف"
              }
              name="description"
              required
              className={clsx(
                "p-1.5 rounded-sm shadow-[0px_0px_2px_0px_#e5e5e5] resize-none",
                { inputAr: settings.settingsState.language === "Arabic" }
              )}
              style={{ width: "auto", height: "auto" }}
            ></textarea>
          </div>
          <div className="grid gap-1">
            <p
              className={clsx("text-start pl-1 pr-1", {
                "ml-auto": settings.settingsState.language === "Arabic",
              })}
            >
              {settings.settingsState.language === "English"
                ? "YouTube Video URL"
                : "رابط فيديو يوتيوب"}
            </p>
            <input
              onBlur={(e) =>
                setVideoInfo((prev) => {
                  return { ...prev, videoUrl: e.target.value };
                })
              }
              placeholder="https://www.youtube.com/watch?v=..."
              type="text"
              min={3}
              required
              name="YouTube Video URL"
              className={clsx(
                "p-1.5 rounded-sm shadow-[0px_0px_2px_0px_#e5e5e5]",
                { inputAr: settings.settingsState.language === "Arabic" }
              )}
            />
          </div>
          <div className="grid gap-1">
            <p
              className={clsx("text-start pl-1 pr-1", {
                "ml-auto": settings.settingsState.language === "Arabic",
              })}
            >
              {settings.settingsState.language === "English"
                ? "Thumbnail"
                : "الصورة المصغرة"}
            </p>
            <input
              onChange={(e) => {
                setVideoInfo((prev) => {
                  return { ...prev, thumbnail: e.target.files[0] };
                });
              }}
              type="file"
              required
              name="Thumbnail"
              className={clsx(
                "p-1.5 rounded-sm shadow-[0px_0px_2px_0px_#e5e5e5]",
                { inputAr: settings.settingsState.language === "Arabic" }
              )}
            />
          </div>
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => {
                fetchData();
              }}
              ref={submitInput}
              className={clsx(
                "flex-1 p-1 rounded-sm",
                themes.secondColor.bg,
                themes.mainColor.color,
                "hover:bg-[#f1f1f1b8] duration-200"
              )}
            >
              {settings.settingsState.language === "English" ? "Upload" : "رفع"}
            </button>
            <Link to={"/"}>
              <button
                className={clsx(
                  "flex-none p-1 rounded-sm",
                  themes.secondColor.bg,
                  themes.mainColor.color,
                  "hover:bg-[#f1f1f1b8] duration-200"
                )}
              >
                {settings.settingsState.language === "English"
                  ? "back"
                  : "رجوع"}
              </button>
            </Link>
          </div>
        </div>
      </form>
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
      <p className="md:text-[12px] text-[10px] text-gray-500 text-center pt-1">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
    </div>
  );
}
