import { themesContext } from "../state-management/Themes";
import { settingsContext } from "../state-management/Settings";
import { userContext } from "../state-management/UserState";
import { subscribedChannelsContext } from "../state-management/SubscribedChannelsState";
import unsubscribeToChannelService from "../services/unsubscribeToChannelService";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import Loading from "./Loading";

export default function SubscribedChannels() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const user = useContext(userContext);
  const subscribedChannels = useContext(subscribedChannelsContext);

  const [message, setMessage] = useState({ message: "", status: null });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  async function handleuUnsubscribeToChannel(videoid) {
    setLoading(true);
    try {
      const result = await unsubscribeToChannelService(videoid);

      if (result.ok) {
        setTimeout(() => {
          window.location.pathname = window.location.pathname;
        }, 300);

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
    <div className={clsx("rounded-[5px] h-139 md:h-136 overflow-auto")}>
      {message.status !== null && (
        <ShowMessage value={{ message, setMessage }} />
      )}
      {loading && <Loading />}
      <div
        className={clsx(
          "grid p-2 pt-5 rounded-[5px] h-full content-start",
          themes.fcolor.bg
        )}
      >
        <i class="fa-solid fa-tv text-center md:text-[25px] text-[20px]"></i>
        <h1 className="text-center mt-3 font-semibold">
          {settings.settingsState.language == "English"
            ? "subscribed channels"
            : "القنوات المشتركة"}
        </h1>
        <p className="text-center text-[13px] text-gray-300">
          {settings.settingsState.language == "English"
            ? "list of the channels that you subscribed"
            : "قائمة القنوات التي اشتركت فيها"}
        </p>
        {subscribedChannels.subscribedChannelsState.channels.length !== 0 ? (
          <div className="grid [@media(min-width:820px)]:grid-cols-2 grid-cols-1 gap-2 mt-3">
            {subscribedChannels.subscribedChannelsState.channels.map(
              (item, index) => {
                return (
                  <div className="grid" key={index}>
                    <div
                      onClick={() => {
                        navigate("/channel-info", { state: { id: item.id } });
                      }}
                      className={clsx(
                        "flex p-2 rounded-[5px] gap-2 hover:shadow-[0px_0px_5px_0px_#f1f1f1] duration-150 hover:-translate-y-0.5",
                        themes.mainColor.bg
                      )}
                    >
                      <img
                        className={clsx(
                          "rounded-full sm:w-15 sm:h-15 w-13 h-13"
                        )}
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
                    <button
                      onClick={() => {
                        handleuUnsubscribeToChannel(item.id);
                      }}
                      className={clsx(
                        "rounded-full text-[14px] mt-1 duration-150 hover:bg-[#9393933a]",
                        themes.fcolor.bg,
                        themes.mainColor.mainColor
                      )}
                    >
                      {settings.settingsState.language == "English"
                        ? "Unsubscribe"
                        : "إلغاء الاشتراك"}
                    </button>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="content-center  mt-20 grid h-full">
            <div className="grid justify-center text-center gap-2.5 ">
              <i className="fa-solid fa-ban text-[30px] md:text-[80px]"></i>
              <p className="text-[12px] md:text-[20px]">
                {settings.settingsState.language == "English"
                  ? "No channel subscribed yet"
                  : "لم يتم الاشتراك في أي قناة حتى الآن"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
