import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import { useContext, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useNavigate, Link } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import { themesContext } from "../state-management/Themes";
import Loading from "./Loading";
import updateUser from "../services/updateUserService";
import updateSettings from "../services/updateSettingsService";

export default function UserProfile() {
  const themes = useContext(themesContext);
  const settngs = useContext(settingsContext);
  const user = useContext(userContext);

  const avatarInout = useRef(null);
  const changeNameInput = useRef(null);

  const [mode, setMode] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: "", status: null });

  const [userInfoState, setUserInfoState] = useState({
    userName: "",
    avatar: "",
  });

  const [settingsState, setSettingsState] = useState({
    save_watch_history: settngs.settingsState.notifications,
    notifications: settngs.settingsState.save_watch_history,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userState?.userName) {
      setMessage({
        message:
          settngs.settingsState.language === "English"
            ? "Please log in to access this page"
            : "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة",
        status: false,
      });

      const timer = setTimeout(() => {
        navigate("/");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  async function handleUpdateUserDataFetch() {
    setLoading(true);
    if (!userInfoState.avatar && !userInfoState.userName) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language == "English"
              ? "Nothing to update"
              : "لا يوجد شيء لتحديثه",
          status: false,
        };
      });
      setLoading(false);
      return;
    }

    try {
      const result = await updateUser(userInfoState);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
      }
      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });

      setMode("profile");

      user.setUserState((prev) => {
        return {
          ...prev,
          userName: result.user.user_name,
          avatar: result.user.avatar_url,
        };
      });
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateSettings() {
    setLoading(true);
    try {
      const result = await updateSettings(settingsState);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
        setLoading(false);
        return;
      }

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });

      setMode("profile");

      settngs.setSettings((prev) => {
        return {
          ...prev,
          save_watch_history: result.settings.save_watch_history,
          notifications: result.settings.notifications,
        };
      });
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
      className={clsx(
        "h-screen p-2 content-center text-center",
        themes.mainColor.bg,
        themes.secondColor.color
      )}
    >
      {loading && <Loading />}
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
      <div
        className={clsx(
          themes.thirdColor.bg,
          "p-2 rounded-[10px] relative max-w-[500px] m-auto"
        )}
      >
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="px-2 py-1 text-xs border rounded"
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
            className="px-2 py-1 text-xs border rounded"
            onClick={() => {
              localStorage.setItem("language", "Arabic");
              settngs.setSettings({
                ...settngs.settingsState,
                language: "Arabic",
              });
            }}
          >
            AR
          </button>
        </div>
        {mode == "profile" ? (
          <i
            className={clsx(
              "fa-regular fa-address-card text-[23px] p-5 rounded-[10px]",
              themes.fcolor.bg
            )}
          ></i>
        ) : mode == "settings" ? (
          <i
            className={clsx(
              "fa-solid fa-gear text-[23px] p-5 rounded-[10px]",
              themes.fcolor.bg
            )}
          ></i>
        ) : (
          <i
            className={clsx(
              "fa-solid fa-pen-to-square text-[23px] p-5 rounded-[10px]",
              themes.fcolor.bg
            )}
          ></i>
        )}
        {mode == "profile" ? (
          <h1 className="text-2xl font-semibold pt-3 pb-3">
            {settngs.settingsState.language == "English"
              ? "User Profile"
              : "ملف تعريف المستخدم"}
          </h1>
        ) : mode == "settings" ? (
          <h1 className="text-2xl font-semibold pt-3 pb-3">
            {settngs.settingsState.language == "English"
              ? "Settings"
              : "اعدادات"}
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold pt-3 pb-3">
            {settngs.settingsState.language == "English"
              ? "Edit profile"
              : "تعديل الملف الشخصي"}
          </h1>
        )}
        {mode == "profile" ? (
          <p className="text-[#939393c8] md:text-[16px] text-[13px]">
            {settngs.settingsState.language == "English"
              ? "View and manage your profile information"
              : "عرض وإدارة معلومات ملفك الشخصي"}
          </p>
        ) : mode == "settings" ? (
          <p className="text-[#939393c8] md:text-[16px] text-[13px]">
            {settngs.settingsState.language == "English"
              ? "Manage your account and app preferences"
              : "إدارة حسابك وتفضيلات التطبيق"}
          </p>
        ) : (
          <p className="text-[#939393c8] md:text-[16px] text-[13px]">
            {settngs.settingsState.language == "English"
              ? "View and update your profile information"
              : "عرض وتحديث معلومات ملفك الشخصي"}
          </p>
        )}
        <div
          className={clsx(
            "m-2 p-2 rounded-[10px] grid gap-2",
            themes.mainColor.bg
          )}
        >
          {mode == "settings" ? (
            <>
              <h1
                className={clsx(
                  "text-left pt-2 pb-2 text-[17px] md:text-[20px] border-b border-[#9393935e] mb-2",
                  { "text-right": settngs.settingsState.language == "Arabic" }
                )}
              >
                {settngs.settingsState.language == "English"
                  ? "Notifications"
                  : "إشعارات"}
              </h1>
              <div
                className={clsx("flex justify-between items-center", {
                  "flex-row-reverse":
                    settngs.settingsState.language == "English",
                })}
              >
                <button
                  onClick={() => {
                    setSettingsState((prev) => {
                      if (settingsState.notifications)
                        return { ...prev, notifications: false };
                      else return { ...prev, notifications: true };
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settingsState.notifications ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settingsState.notifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <div className="grid gap-1">
                  <h2
                    className={clsx("text-left md:text-[16px] text-[13px]", {
                      "text-right": settngs.settingsState.language == "Arabic",
                    })}
                  >
                    {settngs.settingsState.language == "English"
                      ? "Email Notifications"
                      : "إشعارات البريد الإلكتروني"}
                  </h2>
                  <p className="md:text-[14px] text-[11px] text-[#939393c8]">
                    {settngs.settingsState.language == "English"
                      ? "Receive notifications via email"
                      : "تلقي الإشعارات عبر البريد الإلكتروني"}
                  </p>
                </div>
              </div>
              <h1
                className={clsx(
                  "text-left pt-2 pb-2 text-[17px] md:text-[20px] border-b border-[#9393935e] mb-1",
                  { "text-right": settngs.settingsState.language == "Arabic" }
                )}
              >
                {settngs.settingsState.language == "English"
                  ? "save watch history"
                  : "حفظ سجل المشاهدة"}
              </h1>
              <div
                className={clsx("flex justify-between items-center", {
                  "flex-row-reverse":
                    settngs.settingsState.language == "English",
                })}
              >
                <button
                  onClick={() => {
                    setSettingsState((prev) => {
                      if (settingsState.save_watch_history)
                        return { ...prev, save_watch_history: false };
                      else return { ...prev, save_watch_history: true };
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settingsState.save_watch_history
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settingsState.save_watch_history
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <div className="grid gap-1">
                  <h2
                    className={clsx("text-left md:text-[16px] text-[13px]", {
                      "text-right": settngs.settingsState.language == "Arabic",
                    })}
                  >
                    {settngs.settingsState.language == "English"
                      ? "Save Watch History"
                      : "حفظ سجل المشاهدة"}
                  </h2>
                  <p className="md:text-[14px] text-[11px] text-[#939393c8]">
                    {settngs.settingsState.language == "English"
                      ? "Keep track of the videos you watch"
                      : "الاحتفاظ بسجل مقاطع الفيديو التي تشاهدها"}
                  </p>
                </div>
              </div>
              <h1
                className={clsx(
                  "text-left pt-2 pb-2 text-[17px] md:text-[20px] border-b border-[#9393935e] mb-1",
                  { "text-right": settngs.settingsState.language == "Arabic" }
                )}
              >
                {settngs.settingsState.language == "English"
                  ? "account settings"
                  : "اعدادت الحساب"}
              </h1>
              <div
                className={clsx("flex gap-2", {
                  "flex-row-reverse":
                    settngs.settingsState.language == "Arabic",
                })}
              >
                <button
                  onClick={() => {
                    setMessage((prev) => {
                      return {
                        ...prev,
                        message:
                          settngs.settingsState.language == "English"
                            ? "logged out successfully"
                            : "تم تسجيل الخروج بنجاح",
                        status: true,
                      };
                    });
                    localStorage.clear("token");
                    setTimeout(() => {
                      window.location.reload();
                    }, 300);
                  }}
                  className={clsx(
                    "md:text-[13px] text-[11px] rounded-[10px] bg-red-700 p-2 duration-200 hover:bg-red-800"
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "log out"
                    : "تسجيل خروج"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <img
                  src={
                    userInfoState.avatar
                      ? URL.createObjectURL(userInfoState.avatar)
                      : user.userState.avatar
                      ? user.userState.avatar
                      : "public/Anonymous-user.jpg"
                  }
                  alt=""
                  className="w-25 rounded-[50%] m-auto shadow-[0px_0px_5px_0px_#f1f1f1] mb-2"
                />
                {mode == "edit profile" ? (
                  <>
                    <i
                      onClick={() => {
                        avatarInout.current.click();
                      }}
                      className={clsx(
                        "fa-regular fa-pen-to-square absolute top-0 left-[59%] p-1 duration-200 rounded-[50%]",
                        themes.fcolor.bgHover
                      )}
                    ></i>
                    <input
                      onChange={(e) => {
                        setUserInfoState((prev) => {
                          return { ...prev, avatar: e.target.files[0] };
                        });
                      }}
                      ref={avatarInout}
                      type="file"
                      className="hidden"
                    />
                  </>
                ) : null}
              </div>
              <div className="grid ">
                <p
                  className={clsx("text-[12px] mr-auto", {
                    "ml-auto mr-px": settngs.settingsState.language == "Arabic",
                  })}
                >
                  {settngs.settingsState.language == "English"
                    ? "username"
                    : "اسم المستخدم"}
                </p>
                <input
                  className={clsx(
                    "p-2 bg-[#f1f1f126] rounded-[5px] text-[13px] mt-1 mb-2 text-left",
                    {
                      "text-right": settngs.settingsState.language === "Arabic",
                    }
                  )}
                  ref={changeNameInput}
                  type="text"
                  defaultValue={user.userState.userName}
                  readOnly={mode == "edit profile" ? false : true}
                  onChange={(e) => {
                    setUserInfoState((prev) => {
                      return { ...prev, userName: e.target.value };
                    });
                  }}
                />
              </div>
              <div className="grid ">
                <p
                  className={clsx("text-[12px] mr-auto", {
                    "ml-auto mr-px": settngs.settingsState.language == "Arabic",
                  })}
                >
                  {settngs.settingsState.language == "English"
                    ? "email"
                    : "بريد إلكتروني"}
                </p>
                <span
                  className={clsx(
                    "p-2 bg-[#f1f1f126] rounded-[5px] text-[13px] mt-1 mb-2 text-left",
                    { "text-right": settngs.settingsState.language == "Arabic" }
                  )}
                >
                  {user.userState.email}
                </span>
              </div>
              <div className="grid ">
                <p
                  className={clsx("text-[12px] mr-auto", {
                    "ml-auto mr-px": settngs.settingsState.language == "Arabic",
                  })}
                >
                  {settngs.settingsState.language == "English"
                    ? "created at"
                    : "تم إنشاؤه"}
                </p>
                <span
                  className={clsx(
                    "p-2 bg-[#f1f1f126] rounded-[5px] text-[13px] mt-1 mb-2 text-left",
                    { "text-right": settngs.settingsState.language == "Arabic" }
                  )}
                >
                  {user.userState.createdAt.split("T")[0]}
                </span>
              </div>
            </>
          )}
          <div className="flex items-center md:gap-2 gap-1">
            {mode == "profile" ? (
              <>
                <button
                  onClick={() => {
                    setMode("edit profile");
                  }}
                  className={clsx(
                    "rounded-[10px] p-2 duration-200 w-full",
                    themes.secondColor.bg,
                    themes.mainColor.color,
                    "hover:bg-[#f1f1f1b8] duration-200",
                    {
                      " md:text-[15px] text-[13px] ":
                        settngs.settingsState.language == "English",
                    },
                    {
                      " md:text-[15px] text-[11px] ":
                        settngs.settingsState.language == "Arabic",
                    }
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "edit profile"
                    : "تعديل الملف الشخصي"}
                </button>
                <button
                  onClick={() => {
                    setMode("settings");
                  }}
                  className={clsx(
                    "rounded-[10px] p-2 md:text-[15px] text-[13px] duration-200 w-full",
                    themes.secondColor.bg,
                    themes.mainColor.color,
                    "hover:bg-[#f1f1f1b8] duration-200"
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "settings"
                    : "إعدادات"}
                </button>
                <Link to={"/"}>
                  <button
                    className={clsx(
                      "rounded-[10px] p-2 md:text-[15px] text-[13px] duration-200 w-full",
                      themes.secondColor.bg,
                      themes.mainColor.color,
                      "hover:bg-[#f1f1f1b8] duration-200"
                    )}
                  >
                    {settngs.settingsState.language == "English"
                      ? "back"
                      : "رجوع"}
                  </button>
                </Link>
              </>
            ) : mode == "settings" ? (
              <>
                <button
                  onClick={() => {
                    handleUpdateSettings();
                  }}
                  className={clsx(
                    "rounded-[10px] p-2 duration-200 w-full",
                    themes.secondColor.bg,
                    themes.mainColor.color,
                    "hover:bg-[#f1f1f1b8] duration-200",
                    {
                      " md:text-[15px] text-[13px] ":
                        settngs.settingsState.language == "English",
                    },
                    {
                      " md:text-[15px] text-[11px] ":
                        settngs.settingsState.language == "Arabic",
                    }
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "Save Changes"
                    : "حفظ التغييرات"}
                </button>
                <button
                  onClick={() => {
                    setMode("profile");
                  }}
                  className={clsx(
                    "rounded-[10px] p-2 md:text-[15px] text-[13px] duration-200 w-full",
                    themes.secondColor.bg,
                    themes.mainColor.color,
                    "hover:bg-[#f1f1f1b8] duration-200"
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "Cancle"
                    : "إلغاء"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleUpdateUserDataFetch();
                  }}
                  className={clsx(
                    "rounded-[10px] p-2 duration-200 w-full",
                    themes.secondColor.bg,
                    themes.mainColor.color,
                    "hover:bg-[#f1f1f1b8] duration-200",
                    {
                      " md:text-[15px] text-[13px] ":
                        settngs.settingsState.language == "English",
                    },
                    {
                      " md:text-[15px] text-[11px] ":
                        settngs.settingsState.language == "Arabic",
                    }
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "Save Changes"
                    : "حفظ التغييرات"}
                </button>
                <button
                  onClick={() => {
                    setUserInfoState({ userName: "", avatar: "" });
                    changeNameInput.current.value = user.userState.userName;
                    setMode("profile");
                  }}
                  className={clsx(
                    "rounded-[10px] p-2 md:text-[15px] text-[13px] duration-200 w-full",
                    themes.secondColor.bg,
                    themes.mainColor.color,
                    "hover:bg-[#f1f1f1b8] duration-200"
                  )}
                >
                  {settngs.settingsState.language == "English"
                    ? "Cancle"
                    : "إلغاء"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-300 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
    </div>
  );
}
