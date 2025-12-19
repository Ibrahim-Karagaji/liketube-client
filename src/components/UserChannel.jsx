import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import { channelContext } from "../state-management/ChannelState";
import { categoriesContext } from "../state-management/Categories";
import { userContext } from "../state-management/UserState";
import { socialMediaInfoContext } from "../state-management/SocialMediaInfoState";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import Loading from "./Loading";
import ShowMessage from "./ShowMessage";
import clsx from "clsx";
import updateChannelService from "../services/updateChannelService";
import addSocialMediaInfoService from "../services/addSocialMediaInfoService";
import updateSocialMediaInfoService from "../services/updateSocialMediaInfoService";
import deleteChannelService from "../services/deleteChannelService";

export default function UserChannel() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const channel = useContext(channelContext);
  const categories = useContext(categoriesContext);
  const user = useContext(userContext);
  const socialMediaInfoState = useContext(socialMediaInfoContext);

  const dialogRef = useRef(null);
  const socialMediadialog = useRef(null);
  const socialMediaDisplayDialog = useRef(null);
  const deleteChannelDialog = useRef(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: "", status: null });

  const [updateChannelState, setUpdateChannelState] = useState({
    name: "",
    category: "",
    description: "",
    avatar: "",
  });

  const [socialMediaInfo, setSocialMediaInfo] = useState({
    facebook: "",
    twitter: "",
    snapchat: "",
    instagram: "",
    telegram: "",
  });

  useEffect(() => {
    if (!user?.userState?.userName || !channel?.channelState?.id) {
      setMessage({
        message:
          settings.settingsState.language === "English"
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

  async function fetchData() {
    setLoading(true);

    if (
      !updateChannelState.avatar &&
      !updateChannelState.category &&
      !updateChannelState.description &&
      !updateChannelState.name
    ) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settings.settingsState.language == "English"
              ? "Nothing to update"
              : "لا يوجد شيء لتحديثه",
          status: false,
        };
      });
      setLoading(false);
      return;
    }
    try {
      const result = await updateChannelService(updateChannelState);

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

      channel.setChannelState((prev) => {
        return {
          ...prev,
          name: result.channel.name,
          avatar: result.channel.avatar_url,
          category: result.channel.category,
          description: result.channel.description,
        };
      });

      setLoading(false);
      dialogRef.current.close();

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    }
  }

  async function addSocialMediaInfo() {
    setLoading(true);

    if (
      !socialMediaInfo.facebook &&
      !socialMediaInfo.instagram &&
      !socialMediaInfo.snapchat &&
      !socialMediaInfo.telegram &&
      !socialMediaInfo.twitter
    ) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settings.settingsState.language == "English"
              ? "Nothing to create"
              : "لا يوجد شيء لانشاه",
          status: false,
        };
      });
      setLoading(false);
      return;
    }
    try {
      const result = await addSocialMediaInfoService(
        channel.channelState.id,
        socialMediaInfo
      );

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

      setLoading(false);
      socialMediadialog.current.close();

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    }
  }

  async function updateSocialMediaInfo() {
    setLoading(true);

    if (
      !socialMediaInfo.facebook &&
      !socialMediaInfo.instagram &&
      !socialMediaInfo.snapchat &&
      !socialMediaInfo.telegram &&
      !socialMediaInfo.twitter
    ) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settings.settingsState.language == "English"
              ? "Nothing to update"
              : "لا يوجد شيء لتحديثه",
          status: false,
        };
      });
      setLoading(false);
      return;
    }
    try {
      const result = await updateSocialMediaInfoService(
        channel.channelState.id,
        socialMediaInfo
      );

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
      socialMediaInfoState.setSocialMediaInfo(result.socialMedia);

      setLoading(false);
      socialMediadialog.current.close();

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    }
  }

  async function deleteChannel() {
    setLoading(true);

    try {
      const result = await deleteChannelService(channel.channelState.id);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
        return;
      }

      setMessage((prev) => {
        return {
          ...prev,
          message: result.message,
          status: result.ok,
        };
      });

      setTimeout(() => {
        window.location.pathname = "/";
      }, 300);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
      deleteChannelDialog.current.close();
    }
  }

  return (
    <div
      className={clsx(
        themes.mainColor.bg,
        themes.secondColor.color,
        "h-screen content-center p-2 overflow-auto"
      )}
    >
      {loading && <Loading />}
      <div
        className={clsx(
          "grid p-1 md:p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] relative max-w-[900px] m-auto"
        )}
      >
        <div
          className={clsx(
            "absolute flex gap-2 text-[9px]",
            {
              "sm:right-16 sm:top-3 right-3 top-12":
                settings.settingsState.language == "English",
            },
            {
              "sm:left-18 sm:top-3 left-3 top-12":
                settings.settingsState.language == "Arabic",
            }
          )}
        >
          <button
            type="button"
            className="px-2 py-1 border rounded"
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
            className="px-2 py-1 border rounded"
            onClick={() => {
              localStorage.getItem("language", "Arabic");
              settings.setSettings({
                ...settings.settingsState,
                language: "Arabic",
              });
            }}
          >
            AR
          </button>
        </div>
        <div
          className={clsx(
            "absolute top-3 flex gap-2 text-[9px]",
            { "right-3": settings.settingsState.language == "English" },
            { "left-3": settings.settingsState.language == "Arabic" }
          )}
        >
          <button
            onClick={() => {
              dialogRef.current.show();
            }}
            type="button"
            className="px-2 py-1 border rounded flex items-center gap-1"
          >
            {settings.settingsState.language == "English" ? (
              <>
                <i class="fa-solid fa-pen-to-square"></i>
                <p>Edit</p>
              </>
            ) : (
              <>
                <p>تعديل</p>
                <i class="fa-solid fa-pen-to-square"></i>
              </>
            )}
          </button>
        </div>
        <div
          className={clsx(
            "absolute top-3 flex gap-2 text-[9px]",
            {
              "md:right-34 right-16":
                settings.settingsState.language == "English",
            },
            {
              "md:left-36 left-18": settings.settingsState.language == "Arabic",
            }
          )}
        >
          <button
            onClick={() => {
              deleteChannelDialog.current.show();
            }}
            type="button"
            className="px-2 py-1 border rounded flex items-center gap-1"
          >
            {settings.settingsState.language == "English" ? (
              <>
                <i class="fa-solid fa-trash-can"></i> <p>Delete</p>
              </>
            ) : (
              <>
                <p>حذف</p>
                <i class="fa-solid fa-trash-can"></i>
              </>
            )}
          </button>
        </div>
        <div
          className={clsx(
            themes.fcolor.bg,
            "p-1 rounded-[5px] grid md:flex items-center gap-1 sm:gap-2",
            { "flex-row-reverse": settings.settingsState.language == "Arabic" }
          )}
        >
          <img
            className="md:w-35 w-30 md:h-35 h-30 rounded-[50%] m-auto flex-none"
            src={
              updateChannelState.avatar
                ? URL.createObjectURL(updateChannelState.avatar)
                : channel.channelState.avatar
                ? channel.channelState.avatar
                : "Anonymous-user.jpg"
            }
            alt=""
          />
          <div className="grid justify-center justify-items-center gap-1 sm:gap-2 flex-1">
            <h1 className="text-[22px] md:text-[25px] font-semibold">
              {channel.channelState.name}
            </h1>
            <div
              className={clsx(
                "flex items-center gap-2 text-[12px]",
                { "md:mr-auto": settings.settingsState.language == "English" },
                { "md:ml-auto": settings.settingsState.language == "Arabic" }
              )}
            >
              <div
                className={clsx(
                  "flex items-center gap-1 p-1 rounded-[15px]",
                  themes.mainColor.bg
                )}
              >
                {settings.settingsState.language == "English" ? (
                  <>
                    <i class="fa-solid fa-tag "></i>
                    <p>{channel.channelState.category}</p>
                  </>
                ) : (
                  <>
                    <p>{channel.channelState.category}</p>
                    <i class="fa-solid fa-tag "></i>
                  </>
                )}
              </div>
              <div
                className={clsx(
                  "flex items-center gap-1 p-1 rounded-[15px]",
                  themes.mainColor.bg
                )}
              >
                {settings.settingsState.language === "English" ? (
                  <>
                    <i className="fa-solid fa-users"></i>
                    <p>Subscribers: {channel.channelState.subscriptions}</p>
                  </>
                ) : (
                  <div
                    dir="rtl"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa-solid fa-users"></i>
                    <p>مشترك: {channel.channelState.subscriptions}</p>
                  </div>
                )}
              </div>
            </div>
            <p
              className={clsx("text-[13px] line-clamp-2 overflow-hidden", {
                "text-justify [text-align-last:end]":
                  settings.settingsState.language == "Arabic",
              })}
            >
              {channel.channelState.description}
            </p>
            <div
              className={clsx(
                "flex items-center m-auto gap-1 p-1 rounded-[15px] text-[12px]",
                { "md:mr-auto": settings.settingsState.language == "English" },
                { "md:ml-auto": settings.settingsState.language == "Arabic" },
                themes.mainColor.bg
              )}
            >
              {settings.settingsState.language === "English" ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="fa-solid fa-calendar"></i>
                  <span>
                    created: {channel.channelState.created_at.split("T")[0]}
                  </span>
                </div>
              ) : (
                <div
                  dir="rtl"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="fa-solid fa-calendar"></i>
                  <span>
                    تم إنشاؤه: {channel.channelState.created_at.split("T")[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1
          className={clsx(
            "text-[16px] sm:text-[19px] font-semibold mt-3 border-t border-[#9393935e]",
            {
              "text-justify [text-align-last:end]":
                settings.settingsState.language == "Arabic",
            }
          )}
        >
          {settings.settingsState.language == "English"
            ? "Channel Statistics"
            : "إحصائيات القناة"}
        </h1>
        <div
          className={clsx(
            themes.fcolor.bg,
            "p-1 rounded-[5px] grid gap-1 mt-2",
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            { "flex-row-reverse": settings.settingsState.language === "Arabic" }
          )}
        >
          <Link to={"/user-videos"}>
            <div
              className={clsx(
                "sm:p-4 p-2 grid items-center rounded-[5px] gap-1 duration-200 hover:shadow-[0px_0px_5px_0px_#f1f1f1] hover:-translate-y-0.5",
                themes.mainColor.bg
              )}
            >
              <span
                className={clsx("text-[12px]", {
                  "text-justify [text-align-last:end] ":
                    settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English"
                  ? "Total Comemmnts"
                  : "إجمالي التعليقات"}
              </span>
              <div
                className={clsx("flex items-center text-[20px] gap-2", {
                  "justify-end": settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English" ? (
                  <>
                    <i class="fa-solid fa-comment text-[#9333EA]"></i>
                    <span>{channel.channelState.comments_total}</span>
                  </>
                ) : (
                  <>
                    <span>{channel.channelState.comments_total}</span>
                    <i class="fa-solid fa-comment text-[#9333EA]"></i>
                  </>
                )}
              </div>
            </div>
          </Link>
          <Link to={"/user-videos"}>
            <div
              className={clsx(
                "sm:p-4 p-2  grid items-center rounded-[5px] gap-1 duration-200 hover:shadow-[0px_0px_5px_0px_#f1f1f1] hover:-translate-y-0.5",
                themes.mainColor.bg
              )}
            >
              <span
                className={clsx("text-[12px]", {
                  "text-justify [text-align-last:end] ":
                    settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English"
                  ? "Total Likes"
                  : "إجمالي الاعجابات"}
              </span>
              <div
                className={clsx("flex items-center text-[20px] gap-2", {
                  "justify-end": settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English" ? (
                  <>
                    <i class="fa-solid fa-thumbs-up text-[#16A34A]"></i>
                    <span>{channel.channelState.likes_total}</span>
                  </>
                ) : (
                  <>
                    <span>{channel.channelState.likes_total}</span>
                    <i class="fa-solid fa-thumbs-up text-[#16A34A]"></i>
                  </>
                )}
              </div>
            </div>
          </Link>
          <Link to={"/user-videos"}>
            <div
              className={clsx(
                "sm:p-4 p-2 grid items-center rounded-[5px] gap-1 duration-200 hover:shadow-[0px_0px_5px_0px_#f1f1f1] hover:-translate-y-0.5",
                themes.mainColor.bg
              )}
            >
              <span
                className={clsx("text-[12px]", {
                  "text-justify [text-align-last:end] ":
                    settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English"
                  ? "Total Views"
                  : "إجمالي المشاهدات"}
              </span>
              <div
                className={clsx("flex items-center text-[20px] gap-2", {
                  "justify-end": settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English" ? (
                  <>
                    <i class="fa-solid fa-eye text-[#2563EB]"></i>
                    <span>{channel.channelState.views_total}</span>
                  </>
                ) : (
                  <>
                    <span>{channel.channelState.views_total}</span>
                    <i class="fa-solid fa-eye text-[#2563EB]"></i>
                  </>
                )}
              </div>
            </div>
          </Link>
          <Link to={"/user-videos"}>
            <div
              className={clsx(
                "sm:p-4 p-2  grid items-center rounded-[5px] gap-1 duration-200 hover:shadow-[0px_0px_5px_0px_#f1f1f1] hover:-translate-y-0.5",
                themes.mainColor.bg
              )}
            >
              <span
                className={clsx("text-[12px]", {
                  "text-justify [text-align-last:end] ":
                    settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English"
                  ? "Total Videos"
                  : "إجمالي الفيديوهات"}
              </span>
              <div
                className={clsx("flex items-center text-[20px] gap-2", {
                  "justify-end": settings.settingsState.language == "Arabic",
                })}
              >
                {settings.settingsState.language == "English" ? (
                  <>
                    <i class="fa-solid fa-video text-[#DC2626]"></i>
                    <span>{channel.channelState.videos_total}</span>
                  </>
                ) : (
                  <>
                    <span>{channel.channelState.videos_total}</span>
                    <i class="fa-solid fa-video text-[#DC2626]"></i>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => socialMediadialog.current.show()}
            className={clsx(
              "p-1 w-full mt-1 rounded-[5px] duration-200 hover:bg-[#8080805e] text-[11px] sm:text-[14px]",
              themes.fcolor.bg
            )}
          >
            {settings.settingsState.language == "English"
              ? "Add social media info"
              : "إضافة معلومات وسائل التواصل الاجتماعي"}
          </button>
          <button
            onClick={() => socialMediaDisplayDialog.current.show()}
            className={clsx(
              "p-1 w-full mt-1 rounded-[5px] duration-200 hover:bg-[#8080805e] text-[11px] sm:text-[14px]",
              themes.fcolor.bg
            )}
          >
            {settings.settingsState.language == "English"
              ? "Show social media info"
              : "عرض معلومات وسائل التواصل الاجتماعي"}
          </button>
        </div>
        <Link to={"/"} className="w-full">
          <button
            className={clsx(
              "p-1 w-full mt-1 rounded-[5px] duration-200 hover:bg-[#8080805e] text-[11px] sm:text-[14px]",
              themes.fcolor.bg
            )}
          >
            {settings.settingsState.language == "English" ? "BACK" : "رجوع"}
          </button>
        </Link>
      </div>
      <p className="text-xs text-gray-500 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
      <dialog ref={dialogRef} className="w-[99%] h-[99%] bg-[#212121ca] top-1">
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={clsx(
              "p-2 rounded-[5px] border-4 shadow-[0px_0px_4px_0px_#0f0f0f] max-w-[600px] w-full h-fit relative",
              themes.secondColor.bg,
              themes.secondColor.border
            )}
          >
            <i
              className={clsx(
                "fa-solid fa-x absolute top-2 right-2 cursor-pointer text-sm",
                themes.mainColor.color,
                {
                  "left-2 right-auto":
                    settings.settingsState.language === "Arabic",
                }
              )}
              onClick={() => dialogRef.current.close()}
            ></i>
            <h2
              className={clsx(
                "text-lg font-bold mt-4 mb-1",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Edit Channel Information"
                : "تعديل معلومات القناة"}
            </h2>
            <p
              className={clsx(
                "text-sm mb-2 leading-snug",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Update your channel information below"
                : "قم بتحديث معلومات قناتك أدناه"}
            </p>
            <label
              className={clsx(
                "font-semibold text-xs mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Channel Name"
                : "اسم القناة"}
            </label>
            <input
              onBlur={(e) => {
                setUpdateChannelState((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
              type="text"
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            />
            <label
              className={clsx(
                "font-semibold text-xs mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Category"
                : "الفئة"}
            </label>
            <select
              onChange={(e) =>
                setUpdateChannelState((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              {categories.categoriesState.list.map((item, index) => (
                <option value={item.category} key={index}>
                  {item.category}
                </option>
              ))}
            </select>
            <label
              className={clsx(
                "font-semibold text-xs mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Description"
                : "الوصف"}
            </label>
            <textarea
              onBlur={(e) => {
                setUpdateChannelState((prev) => {
                  return { ...prev, description: e.target.value };
                });
              }}
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none h-20 resize-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            ></textarea>
            <label
              className={clsx(
                "font-semibold text-xs mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Channel Avatar"
                : "صورة القناة"}
            </label>
            <div
              className={clsx("flex items-center gap-2 mb-3 text-[13px]", {
                "flex-row-reverse text-end":
                  settings.settingsState.language === "Arabic",
              })}
            >
              <img
                src={
                  updateChannelState.avatar
                    ? URL.createObjectURL(updateChannelState.avatar)
                    : "/public/Anonymous-user.jpg"
                }
                className="w-12 h-12 rounded-full"
                alt="avatar"
              />
              <input
                onChange={(e) => {
                  setUpdateChannelState((prev) => {
                    return { ...prev, avatar: e.target.files[0] };
                  });
                }}
                type="file"
                className={themes.mainColor.color}
              />
            </div>
            <div
              className={clsx("flex justify-end gap-2 mt-2", {
                "justify-start": settings.settingsState.language === "Arabic",
              })}
            >
              <button
                className={clsx(
                  "px-3 py-1 border rounded text-sm",
                  themes.secondColor.border,
                  themes.mainColor.color
                )}
                onClick={() => dialogRef.current.close()}
              >
                {settings.settingsState.language === "English"
                  ? "Cancel"
                  : "إلغاء"}
              </button>
              <button
                onClick={() => fetchData()}
                className={clsx(
                  "px-3 py-1 rounded text-sm",
                  themes.mainColor.bg,
                  themes.secondColor.color
                )}
              >
                {settings.settingsState.language === "English" ? "Save" : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog
        ref={socialMediadialog}
        className="w-[99%] h-[99%] bg-[#212121ca] top-1 overflow-auto"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={clsx(
              "p-2 rounded-[5px] border-4 shadow-[0px_0px_4px_0px_#0f0f0f] max-w-[600px] w-full h-fit relative",
              themes.secondColor.bg,
              themes.secondColor.border
            )}
          >
            <i
              className={clsx(
                "fa-solid fa-x absolute top-2 right-2 cursor-pointer text-sm",
                themes.mainColor.color,
                {
                  "left-2 right-auto":
                    settings.settingsState.language === "Arabic",
                }
              )}
              onClick={() => socialMediadialog.current.close()}
            ></i>
            <h2
              className={clsx(
                "text-lg font-bold mt-4 mb-1",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Social Media Information"
                : "معلومات وسائل التواصل الاجتماعي"}
            </h2>
            <p
              className={clsx(
                "text-[12px] mb-2 leading-snug",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Add or update your social media information below."
                : "قم بإضافة أو تحديث معلومات وسائل التواصل الاجتماعي الخاصة بك أدناه."}
            </p>
            <p
              className={clsx(
                "text-[11px] mb-4 leading-snug opacity-80",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Make sure your links are correct before saving."
                : "تأكد من صحة الروابط قبل الحفظ."}
            </p>
            <label
              className={clsx(
                "font-semibold text-[13px] mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Facebook(optional)"
                : "فيسبوك(اختياري)"}
            </label>
            <input
              onBlur={(e) => {
                setSocialMediaInfo((prev) => {
                  return { ...prev, facebook: e.target.value };
                });
              }}
              type="text"
              placeholder="https://facebook.com/your_page"
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            />
            <label
              className={clsx(
                "font-semibold text-[13px] mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Instagram(optional)"
                : "انستغرام(اختياري)"}
            </label>
            <input
              onBlur={(e) => {
                setSocialMediaInfo((prev) => {
                  return { ...prev, instagram: e.target.value };
                });
              }}
              placeholder="https://instagram.com/your_username"
              type="text"
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            />
            <label
              className={clsx(
                "font-semibold text-[13px] mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Snapchat(optional)"
                : "سناب شات(اختياري)"}
            </label>
            <input
              onBlur={(e) => {
                setSocialMediaInfo((prev) => {
                  return { ...prev, snapchat: e.target.value };
                });
              }}
              placeholder="https://www.snapchat.com/add/your_username"
              type="text"
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            />
            <label
              className={clsx(
                "font-semibold text-[13px] mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Telegram(optional)"
                : "تيلغرام(اختياري)"}
            </label>
            <input
              onBlur={(e) => {
                setSocialMediaInfo((prev) => {
                  return { ...prev, telegram: e.target.value };
                });
              }}
              placeholder="https://t.me/your_username"
              type="text"
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            />
            <label
              className={clsx(
                "font-semibold text-[13px] mb-1 block",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Twitter(optional)"
                : "تويتر(اختياري)"}
            </label>
            <input
              onBlur={(e) => {
                setSocialMediaInfo((prev) => {
                  return { ...prev, twitter: e.target.value };
                });
              }}
              placeholder="https://twitter.com/your_username"
              type="text"
              className={clsx(
                "w-full border px-2 py-1 rounded text-sm mb-2 outline-none",
                themes.secondColor.border,
                themes.mainColor.color,
                themes.fcolor.bg,
                {
                  "inputAr ": settings.settingsState.language == "Arabic",
                }
              )}
            />
            <div
              className={clsx("flex justify-end gap-2 mt-2", {
                "justify-start": settings.settingsState.language === "Arabic",
              })}
            >
              <button
                className={clsx(
                  "px-3 py-1 border rounded text-sm",
                  themes.secondColor.border,
                  themes.mainColor.color
                )}
                onClick={() => socialMediadialog.current.close()}
              >
                {settings.settingsState.language === "English"
                  ? "Cancel"
                  : "إلغاء"}
              </button>
              <button
                onClick={() => {
                  if (!socialMediaInfoState?.socialMediaInfo?.id)
                    addSocialMediaInfo();
                  else updateSocialMediaInfo();
                }}
                className={clsx(
                  "px-3 py-1 rounded text-sm",
                  themes.mainColor.bg,
                  themes.secondColor.color
                )}
              >
                {settings.settingsState.language === "English" ? "Save" : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog
        ref={socialMediaDisplayDialog}
        className="w-full h-full bg-[#212121ca] top-0 overflow-auto p-2"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={clsx(
              "p-3 rounded-md border shadow-sm max-w-md w-full h-fit relative",
              themes.secondColor.bg,
              themes.secondColor.border
            )}
          >
            <i
              className={clsx(
                "fa-solid fa-x absolute top-2 right-2 cursor-pointer text-sm",
                themes.mainColor.color,
                {
                  "left-2 right-auto":
                    settings.settingsState.language === "Arabic",
                }
              )}
              onClick={() => socialMediaDisplayDialog.current.close()}
            ></i>
            <h2
              className={clsx(
                "text-base font-bold mt-2 mb-3",
                themes.mainColor.color,
                { "text-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {settings.settingsState.language === "English"
                ? "Social Media Information"
                : "معلومات وسائل التواصل الاجتماعي"}
            </h2>
            {Object.entries(socialMediaInfoState.socialMediaInfo || {})
              .filter(([key]) => key !== "id")
              .map(([platform, link]) => (
                <div key={platform} className="mb-2">
                  <span
                    className={clsx(
                      "font-semibold text-sm block mb-1",
                      themes.mainColor.color,
                      {
                        "text-end":
                          settings.settingsState.language === "Arabic",
                      }
                    )}
                  >
                    {settings.settingsState.language === "English"
                      ? platform.charAt(0).toUpperCase() + platform.slice(1)
                      : platform === "facebook"
                      ? "فيسبوك"
                      : platform === "instagram"
                      ? "انستغرام"
                      : platform === "snapchat"
                      ? "سناب شات"
                      : platform === "telegram"
                      ? "تيلغرام"
                      : "تويتر"}
                  </span>
                  <a
                    href={link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      "text-blue-500 hover:underline text-sm block truncate",
                      {
                        "text-end":
                          settings.settingsState.language === "Arabic",
                      }
                    )}
                  >
                    {link || "-"}
                  </a>
                </div>
              ))}
            <div
              className={clsx("flex justify-end mt-3 gap-2", {
                "justify-start": settings.settingsState.language === "Arabic",
              })}
            >
              <button
                className={clsx(
                  "px-3 py-1 border rounded text-sm",
                  themes.secondColor.border,
                  themes.mainColor.color
                )}
                onClick={() => socialMediaDisplayDialog.current.close()}
              >
                {settings.settingsState.language === "English"
                  ? "Close"
                  : "إغلاق"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog
        ref={deleteChannelDialog}
        className="w-full h-full bg-[#212121ca] top-0 overflow-auto p-2"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={clsx(
              "p-4 rounded-md border shadow-sm max-w-md w-full h-fit relative text-center space-y-4",
              themes.secondColor.bg,
              themes.secondColor.border
            )}
          >
            <p className={clsx("text-sm", themes.mainColor.color)}>
              {settings.settingsState.language === "English"
                ? "Are you sure you want to delete this channel? This action cannot be undone."
                : "هل أنت متأكد أنك تريد حذف هذه القناة؟ لا يمكن التراجع عن هذا الإجراء."}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                className={clsx(
                  "px-4 py-1.5 rounded text-sm transition-colors duration-200",
                  themes.secondColor.border,
                  themes.mainColor.color,
                  "bg-gray-600 hover:bg-gray-700"
                )}
                onClick={() => deleteChannelDialog.current.close()}
              >
                {settings.settingsState.language === "English"
                  ? "Cancel"
                  : "إلغاء"}
              </button>
              <button
                className={clsx(
                  "px-4 py-1.5 rounded text-sm transition-colors duration-200",
                  themes.secondColor.border,
                  "bg-red-600 hover:bg-red-700 text-white"
                )}
                onClick={() => deleteChannel()}
              >
                {settings.settingsState.language === "English"
                  ? "Delete"
                  : "حذف"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
