import { themesContext } from "../state-management/Themes";
import { channelContext } from "../state-management/ChannelState";
import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import { useContext, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useNavigate, Link } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import { categoriesContext } from "../state-management/Categories";
import Loading from "./Loading";
import createChannelService from "../services/createChannelService";

export default function CreateChannel() {
  const themes = useContext(themesContext);
  const settngs = useContext(settingsContext);
  const user = useContext(userContext);
  const categories = useContext(categoriesContext);
  const channelState = useContext(channelContext);

  const submitInput = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userName = user?.userState?.userName;
    const channel = channelState.channelState;
    const lang = settngs.settingsState.language;

    if (!userName || channel.id) {
      setMessage({
        message:
          lang === "English"
            ? "Please log in to access this page"
            : "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        status: false,
      });
      navigate("/sign-in");
    }
  }, [user?.userState?.userName, channelState.channelState.id]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: "", status: null });
  const [channel, setChannel] = useState({
    name: "",
    description: "",
    category: "",
    avatar: "",
  });

  async function fetchData() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f14f";
    try {
      const result = await createChannelService(channel);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
        setLoading(false);
        submitInput.current.disabled = false;
        submitInput.current.style.backgroundColor = "#f1f1f1";
        return;
      }

      setMessage((prev) => {
        return {
          ...prev,
          message: result.message?.message ?? result.message,
          status: result.ok,
        };
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1900);

      setLoading(false);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
      setLoading(false);
    }
  }

  function validate() {
    if (
      !channel.name ||
      typeof channel.name !== "string" ||
      channel.name.trim().length < 3
    ) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language === "English"
              ? "channel name should not be empty and less than 3 letters"
              : "يجب ألا يكون اسم القناة فارغًا وأن لا يقل عن 3 أحرف",
          status: false,
        };
      });
      return;
    }

    if (!channel.avatar) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language === "English"
              ? "channel avatar is required"
              : "مطلوب صورة القناة",
          status: false,
        };
      });
      return;
    }

    if (!channel.category) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language === "English"
              ? "Invalid category"
              : "فئة غير صالحة",
          status: false,
        };
      });
      return;
    }

    fetchData();
  }

  return (
    <div
      className={clsx(
        themes.mainColor.bg,
        themes.secondColor.color,
        "h-screen content-center p-2"
      )}
    >
      {loading && <Loading />}
      <form
        onSubmit={(e) => e.preventDefault()}
        className={clsx(
          themes.fcolor.bg,
          "relative grid w-full max-w-full sm:max-w-[450px] md:max-w-[500px] rounded-[10px] p-2 sm:p-3 m-auto shadow-[0px_0px_3px_0px_#f1f1f1]"
        )}
      >
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            type="button"
            className="px-1 py-0.5 text-[10px] sm:text-[12px] border rounded"
            onClick={() => {
              localStorage.setItem("language", "English");
              settngs.setSettings({
                ...settngs.settingsState,
                language: "English",
              });
            }}
          >
            EN
          </button>
          <button
            type="button"
            className="px-1 py-0.5 text-[10px] sm:text-[12px] border rounded"
            onClick={() => {
              localStorage.getItem("language", "Arabic");
              settngs.setSettings({
                ...settngs.settingsState,
                language: "Arabic",
              });
            }}
          >
            AR
          </button>
        </div>
        <i
          className={clsx(
            "fa-solid fa-video text-[20px] sm:text-[22px] text-center mb-2 mt-2"
          )}
        ></i>
        <h1 className="text-center text-[18px] sm:text-[20px]">
          {settngs.settingsState.language === "English"
            ? "Create Channel"
            : "انشاء قناة"}
        </h1>
        <p className="text-[11px] sm:text-[13px] text-center pt-1 pb-1">
          {settngs.settingsState.language === "English"
            ? "fill in the details to create your channel"
            : "املأ التفاصيل لإنشاء قناتك"}
        </p>
        <div
          className={clsx(
            themes.thirdColor.bg,
            "p-1 sm:p-2 rounded-[5px] grid gap-2"
          )}
        >
          <div className="grid gap-0.5">
            <label
              className={clsx("text-[12px] sm:text-[13px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "channel name"
                : "اسم القناة"}
            </label>
            <input
              onBlur={(e) => {
                setChannel((prev) => ({ ...prev, name: e.target.value }));
              }}
              name="channel name"
              type="text"
              placeholder={
                settngs.settingsState.language === "English"
                  ? "channel name"
                  : "اسم القناة"
              }
              className={clsx(
                "p-1 w-full shadow-[0px_0px_3px_0px_#f1f1f1] rounded-[5px] text-[11px] sm:text-[12px] mt-0.5 mb-1",
                { inputAr: settngs.settingsState.language === "Arabic" }
              )}
            />
          </div>
          <div className="grid gap-0.5 w-full">
            <label
              className={clsx("text-[12px] sm:text-[13px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "description (optional)"
                : "الوصف (اختياري)"}
            </label>
            <textarea
              rows={2}
              onBlur={(e) => {
                setChannel((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              name="channel description"
              placeholder={
                settngs.settingsState.language === "English"
                  ? "channel description"
                  : "وصف القناة"
              }
              className={clsx(
                "p-1 w-full resize-none shadow-[0px_0px_3px_0px_#f1f1f1] rounded-[5px] text-[11px] sm:text-[12px] mt-0.5 mb-1 block",
                { inputAr: settngs.settingsState.language === "Arabic" }
              )}
            ></textarea>
          </div>
          <div className="grid gap-0.5 w-full">
            <label
              className={clsx("text-[12px] sm:text-[13px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "category"
                : "فئة"}
            </label>
            <section
              className={clsx("w-full flex flex-col gap-0.5", {
                inputAr: settngs.settingsState.language == "Arabic",
              })}
            >
              <label
                htmlFor="category"
                className={clsx("text-[11px] sm:text-[12px]", {
                  inputAr: settngs.settingsState.language === "Arabic",
                })}
              >
                {settngs.settingsState.language === "English"
                  ? "choose a category"
                  : "اختر الفئة"}
              </label>
              <select
                id="category"
                name="category"
                className="p-1 w-full rounded-[5px] shadow-sm block text-[12px]"
                onChange={(e) =>
                  setChannel((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                {categories.categoriesState.list.map((item, index) => (
                  <option
                    className={clsx(themes.mainColor.bg)}
                    key={index}
                    value={item.category}
                  >
                    {item.category}
                  </option>
                ))}
              </select>
            </section>
          </div>
          <div className="grid gap-0.5 mt-2 relative">
            <label
              htmlFor="channel-avatar"
              className={clsx("text-[12px] sm:text-[13px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "channel avatar"
                : "الصورة الرمزية للقناة"}
            </label>
            <input
              id="channel-avatar"
              type="file"
              className="text-[11px] sm:text-[12px]"
              onChange={(e) =>
                setChannel((prev) => ({ ...prev, avatar: e.target.files[0] }))
              }
            />
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          <button
            onClick={() => {
              validate();
            }}
            ref={submitInput}
            className={clsx(
              "flex-1 p-1.5 sm:p-1 rounded-[5px]",
              themes.secondColor.bg,
              themes.mainColor.color,
              "hover:bg-[#f1f1f1b8] duration-200 text-[12px] sm:text-[14px]"
            )}
          >
            {settngs.settingsState.language === "English" ? "create" : "انشاء"}
          </button>
          <Link to={"/"}>
            <button
              className={clsx(
                "flex-none px-2 p-1.5 sm:p-1 rounded-[5px]",
                themes.secondColor.bg,
                themes.mainColor.color,
                "hover:bg-[#f1f1f1b8] duration-200 text-[12px] sm:text-[14px]"
              )}
            >
              {settngs.settingsState.language === "English" ? "back" : "رجوع"}
            </button>
          </Link>
        </div>
      </form>
      <p className="text-[10px] text-gray-500 text-center pt-1">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
    </div>
  );
}
