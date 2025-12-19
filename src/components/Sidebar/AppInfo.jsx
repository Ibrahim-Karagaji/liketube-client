import { themesContext } from "../../state-management/Themes";
import { settingsContext } from "../../state-management/Settings";
import { useContext } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function AppInfo() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);
  return (
    <div
      className={clsx(`grid gap-1 border-b-2 border-[#9393935e] mb-5 w-full`)}
    >
      {settings.settingsState.language == "English" ? (
        <div className={clsx("flex gap-2 items-center p-2 w-full")}>
          <p className="text-[15px]">Creator</p>
          <i className="fa-solid fa-arrow-right text-[16px]"></i>
        </div>
      ) : (
        <div className={clsx("flex gap-2 items-center justify-end p-2 w-full")}>
          <i class="fa-solid fa-arrow-left text-[16px]"></i>
          <p className="text-[15px]">الصانع</p>
        </div>
      )}
      {settings.settingsState.language === "English" ? (
        <>
          <Link to={"/term-policy"}>
            <button
              className={clsx(
                "flex gap-2 items-center justify-start p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[12px]">Terms and Conditions</p>
              <i class="fa-solid fa-gear text-[16px] md:text-[20px]"></i>
            </button>
          </Link>
          <Link to={"/developer-page"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 justify-start rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[12px]">developer</p>
              <i class="fa-solid fa-user-tie text-[16px] md:text-[20px]"></i>
            </button>
          </Link>
          <Link to={"/user-feedback"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 justify-start rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[12px]">Feedback</p>
              <i class="fa-solid fa-message text-[16px] md:text-[20px]"></i>
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link to={"/term-policy"} className="justify-end flex w-full">
            <button
              className={clsx(
                "flex gap-2 items-center p-2 justify-end duration-200 rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className=" text-[12px]">الشروط والأحكام</p>
              <i class="fa-solid fa-gear text-[16px] md:text-[20px]"></i>
            </button>
          </Link>
          <Link to={"/developer-page"} className="justify-end flex w-full">
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 justify-end  rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className=" text-[12px]">المطور</p>
              <i class="fa-solid fa-user-tie text-[16px] md:text-[20px]"></i>
            </button>
          </Link>
          <Link to={"/user-feedback"} className="justify-end flex w-full">
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className=" text-[12px]">ملاحظات</p>
              <i class="fa-solid fa-message text-[16px] md:text-[20px]"></i>
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
