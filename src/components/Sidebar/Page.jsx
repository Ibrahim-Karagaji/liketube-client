import { themesContext } from "../../state-management/Themes";
import { settingsContext } from "../../state-management/Settings";
import { useContext } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function Page() {
  const themes = useContext(themesContext);
  const settings = useContext(settingsContext);

  return (
    <div className={clsx(`grid gap-2 border-b-2 border-[#9393935e] mb-6`)}>
      {settings.settingsState.language == "English" ? (
        <>
          <Link to={"/"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <i class="fa-solid fa-house text-[16px]"></i>
              <p className="text-[13px]">Home page</p>
            </button>
          </Link>
          <Link to={"/subscriptions"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 w-full cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <img src="images/subscriptions.svg" className="w-[18px]" />
              <p className="text-[13px]">Subscription</p>
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link className={clsx("ml-auto")} to={"/"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 text-[13px] justify-end cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">الصفحة الرئيسية</p>
              <i class="fa-solid fa-house text-[16px]"></i>
            </button>
          </Link>
          <Link className={clsx("ml-auto")} to={"/subscriptions"}>
            <button
              className={clsx(
                "flex gap-2 items-center p-2 duration-200 rounded-[5px] hover:-translate-y-0.5 text-[13px] justify-end cursor-pointer",
                themes.fcolor.bgHover
              )}
            >
              <p className="text-[13px]">الاشتراكات</p>
              <img src="images/subscriptions.svg" className="w-[18px]" />
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
