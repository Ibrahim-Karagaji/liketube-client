import { useContext, useState } from "react";
import { themesContext } from "../../state-management/Themes";
import { settingsContext } from "../../state-management/Settings";
import { Link } from "react-router-dom";
import Page from "./Page";
import User from "./User";
import Channels from "./ChannelsCard";
import AppInfo from "./AppInfo";
import { userContext } from "../../state-management/UserState";
import { channelContext } from "../../state-management/ChannelState";

import clsx from "clsx";

export default function Sidebar() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  const user = useContext(userContext);
  const channel = useContext(channelContext);

  return (
    <div
      className={clsx(
        "flex-none grid ml-auto justify-end overflow-auto text-[14px] md:text-base mt-11 sidebar"
      )}
    >
      <div>
        <div
          className={clsx(
            "flex items-center gap-2 pr-2 pb-3 justify-end fixed top-0 md:right-4 right-1 logo"
          )}
        >
          <div className="flex items-center">
            <img src="public/logo.png" alt="" className={clsx("w-10 h-10")} />
            <p className="font-bold">LikeTube</p>
          </div>
        </div>
        <div className="md:grid items-start justify-end h-fit hidden">
          <Page />
          <User />
          <Channels />
          <AppInfo />
        </div>
        <div className="md:hidden gap-2 items-start justify-end h-fit grid">
          <Link to={"/"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i className="fa-solid fa-house text-[16px]"></i>
              <p
                className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-20 text-right"
                dir={
                  settings.settingsState.language === "English" ? "ltr" : "rtl"
                }
              >
                {settings.settingsState.language === "English"
                  ? "Home page"
                  : "الصفحة الرئيسية"}
              </p>
            </div>
          </Link>
          <Link to={"/subscriptions"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <img src="public/subscriptions.svg" className="w-[18px] md:w-5" />
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "Subscription"
                  : "الاشتراكات"}
              </p>
            </div>
          </Link>
          <Link to={"/history"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-clock-rotate-left text-[16px] md:text-[20px]"></i>
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "History"
                  : "السجل"}
              </p>
            </div>
          </Link>
          <Link to={"/play-list"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-list text-[16px] md:text-[20px]"></i>
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "Play list"
                  : "قائمة التشغيل"}
              </p>
            </div>
          </Link>
          <Link to={"/user-videos"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-play text-[16px] md:text-[20px]"></i>
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "Your videos"
                  : "فيديوهاتك"}
              </p>
            </div>
          </Link>
          {user.userState.userName ? (
            channel.channelState.id ? (
              <Link to={"/upload-video"}>
                <div
                  className={clsx(
                    "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                    themes.fcolor.bgHover
                  )}
                >
                  <i className="fa-solid fa-upload text-[18px] md:text-[20px]"></i>
                  <p className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-20">
                    {settings.settingsState.language === "English"
                      ? "Upload Video"
                      : "تحميل الفيديو"}
                  </p>
                </div>
              </Link>
            ) : (
              <Link to={"/create-channel"}>
                <div
                  className={clsx(
                    "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                    themes.fcolor.bgHover
                  )}
                >
                  <i className="fa-solid fa-earth-americas text-[18px] md:text-[20px]"></i>
                  <p className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-20">
                    {settings.settingsState.language === "English"
                      ? "Create channel"
                      : "انشاء قناة"}
                  </p>
                </div>
              </Link>
            )
          ) : (
            <Link to={"/sign-up"}>
              <div
                className={clsx(
                  "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                  themes.fcolor.bgHover
                )}
              >
                <i className="fa-solid fa-plus text-[16px] md:text-[20px]"></i>
                <p className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-20">
                  {settings.settingsState.language === "English"
                    ? "Create Account"
                    : "انشاء حساب"}
                </p>
              </div>
            </Link>
          )}
          <Link to={"/liked-videos"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i className="fa-solid fa-thumbs-up text-[16px] md:text-[20px]"></i>
              <p
                className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-20 text-right"
                dir={
                  settings.settingsState.language === "English" ? "ltr" : "rtl"
                }
              >
                {settings.settingsState.language === "English"
                  ? "Videos I liked"
                  : "فيديوهات التي اعجبت بها"}
              </p>
            </div>
          </Link>
          <Link to={"/user-channel"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-earth-americas text-[16px] md:text-[20px]"></i>
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "My channel"
                  : "قناتي"}
              </p>
            </div>
          </Link>
          <Link to={"/term-policy"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-gear text-[16px] md:text-[20px] whitespace-nowrap"></i>
              <p className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-20">
                {settings.settingsState.language === "English"
                  ? "Terms and Conditions"
                  : "الشروط و الاحكام"}
              </p>
            </div>
          </Link>
          <Link to={"/developer-page"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-user-tie text-[16px] md:text-[20px]"></i>
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "developer"
                  : "المطور"}
              </p>
            </div>
          </Link>
          <Link to={"/user-feedback"}>
            <div
              className={clsx(
                "grid gap-1 p-2 rounded-[5px] justify-items-center duration-200 hover:-translate-y-0.5 m-auto cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-message text-[16px] md:text-[20px]"></i>
              <p className="text-[10px]">
                {settings.settingsState.language === "English"
                  ? "Feedback"
                  : "ملاحظات"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
