import { useContext } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { settingsContext } from "../state-management/Settings";
import { themesContext } from "../state-management/Themes";

export default function NotFound() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);

  return (
    <div
      className={clsx(
        themes.mainColor.bg,
        themes.secondColor.color,
        "h-screen content-center p-2"
      )}
    >
      <div
        className={clsx(
          themes.fcolor.bg,
          "relative grid max-w-[500px] rounded-[15px] p-6 m-auto shadow-[0px_0px_5px_0px_#f1f1f1] text-center"
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
        <img src="/logo.png" className="w-16 h-16 m-auto" />
        <h1 className="text-[60px] font-bold mt-2">404</h1>
        <p className="text-[16px] mt-2">
          {settngs.settingsState.language === "English"
            ? "Page Not Found"
            : "الصفحة غير موجودة"}
        </p>
        <p className="text-[13px] mt-1 text-gray-400">
          {settngs.settingsState.language === "English"
            ? "The page you are looking for does not exist."
            : "الصفحة التي تبحث عنها غير متوفرة."}
        </p>
        <Link to="/">
          <button
            className={clsx(
              "mt-4 p-2 rounded-[5px] w-full",
              themes.secondColor.bg,
              themes.mainColor.color,
              "hover:bg-[#f1f1f1b8] duration-200"
            )}
          >
            {settngs.settingsState.language === "English"
              ? "Go Home"
              : "العودة للرئيسية"}
          </button>
        </Link>
      </div>
      <p className="text-xs text-gray-300 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
    </div>
  );
}
