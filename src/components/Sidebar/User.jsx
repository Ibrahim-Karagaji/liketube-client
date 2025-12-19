import { themesContext } from "../../state-management/Themes";
import { settingsContext } from "../../state-management/Settings";
import { useContext } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

export default function User() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);

  return (
    <div
      className={clsx(
        `grid gap-2 justify-start border-b-2 border-[#9393935e] mb-5 w-full`
      )}
    >
      {settings.settingsState.language == "English" ? (
        <div className={clsx("flex gap-2 items-center p-1 w-full")}>
          <p className="text-[17px]">You</p>
          <i className="fa-solid fa-arrow-right text-[16px]"></i>
        </div>
      ) : (
        <div className={clsx("flex gap-2 items-center p-1 justify-end  pr-2")}>
          <i class="fa-solid fa-arrow-left text-[16px]"></i>
          <p className="text-[17px]">انت</p>
        </div>
      )}
      {settings.settingsState.language == "English" ? (
        <>
          <Link to={"/play-list"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 ",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-list text-[16px]"></i>
              <p className="text-[13px]">Play list</p>
            </button>
          </Link>
          <Link to={"/history"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-clock-rotate-left text-[16px]"></i>
              <p className="text-[13px]">History</p>
            </button>
          </Link>
          <Link to={"/user-videos"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-video text-[16px]"></i>
              <p className="text-[13px]">Your videos</p>
            </button>
          </Link>
          <Link to={"/liked-videos"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 whitespace-nowrap",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-thumbs-up text-[16px]"></i>
              <p className="text-[13px]">Videos I liked</p>
            </button>
          </Link>
          <Link to={"user-channel"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 ",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-earth-americas text-[16px]"></i>
              <p className="text-[13px]">My channel</p>
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link to={"/play-list"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 text-[13px] ml-auto justify-end",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">قائمة التشغيل</p>
              <i class="fa-solid fa-list text-[16px]"></i>
            </button>
          </Link>
          <Link to={"/history"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 ml-auto",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">السجل</p>
              <i class="fa-solid fa-clock-rotate-left text-[16px]"></i>
            </button>
          </Link>
          <Link className="ml-auto" to={"/user-videos"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 text-[13px] justify-end",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">فيديوهاتك</p>
              <i class="fa-solid fa-video text-[16px]"></i>
            </button>
          </Link>
          <Link to={"/liked-videos"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 text-[12px] justify-end",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">الفيديوهات التي اعجبت بها</p>
              <i class="fa-solid fa-thumbs-up text-[16px]"></i>
            </button>
          </Link>
          <Link className="ml-auto" to={"/user-channel"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 justify-end  rounded-[5px] hover:-translate-y-0.5 ",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">قناتي </p>
              <i class="fa-solid fa-earth-americas text-[16px]"></i>
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
