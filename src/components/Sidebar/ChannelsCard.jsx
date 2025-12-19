import { themesContext } from "../../state-management/Themes";
import { settingsContext } from "../../state-management/Settings";
import { subscribedChannelsContext } from "../../state-management/SubscribedChannelsState";
import { useContext, useEffect } from "react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

export default function Channels() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const subscribedChannels = useContext(subscribedChannelsContext);

  const navigate = useNavigate();

  useEffect(() => {}, [subscribedChannels.subscribedChannelsState.loading]);

  return (
    <div className={clsx(`grid gap-2 border-b-2 border-[#9393935e] mb-2`)}>
      <Link
        to={"/subscriptions"}
        className={clsx(
          "flex gap-2 items-center p-1 rounded-[5px] duration-200 ",
          { "ml-auto": settings.settingsState.language == "Arabic" }
        )}
      >
        {settings.settingsState.language == "English" ? (
          <div
            className={clsx(
              "flex gap-2 items-center p-1 rounded-[5px] duration-200",
              themes.fcolor.bgHover
            )}
          >
            <p className="text-[15px]">Subscriptions</p>
            <i className="fa-solid fa-arrow-right text-[16px]"></i>
          </div>
        ) : (
          <div
            className={clsx(
              "flex gap-2 items-center p-1 rounded-[5px] justify-end duration-200 pr-2",
              themes.fcolor.bgHover
            )}
          >
            <i class="fa-solid fa-arrow-left text-[16px]"></i>
            <p className="text-[15px]">الاشتراكات</p>
          </div>
        )}
      </Link>
      {subscribedChannels.subscribedChannelsState.channels.length === 0 ? (
        <p className="text-center text-[13px] text-gray-500">
          {settings.settingsState.language == "English"
            ? "No subscribed channels"
            : "لا يوجد قنوات مشترك فيها"}
        </p>
      ) : (
        subscribedChannels.subscribedChannelsState.channels.map(
          (value, index) => (
            <button
              onClick={() =>
                navigate("/channel-info", { state: { id: value.id } })
              }
              key={index}
              className={clsx(
                "flex items-center gap-2 p-2 rounded-[5px] hover:-translate-y-0.5 duration-200 cursor-pointer",
                themes.fcolor.bgHover,
                { "justify-end": settings.settingsState.language === "Arabic" }
              )}
            >
              {subscribedChannels.subscribedChannelsState.loading ? (
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner animate-spin text-[16px] md:text-[20px] text-gray-400"></i>
                  <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <p className="text-[13px]">{value.name}</p>
                  <img
                    src={value.avatar_url}
                    className="w-5 h-5 rounded-full"
                  />
                </>
              )}
            </button>
          )
        )
      )}
    </div>
  );
}
