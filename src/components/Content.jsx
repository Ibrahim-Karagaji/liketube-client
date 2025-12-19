import { useContext } from "react";
import { settingsContext } from "../state-management/Settings";
import { themesContext } from "../state-management/Themes";
import { categoriesContext } from "../state-management/Categories";
import CategoryBar from "./CategoryBar";
import clsx from "clsx";
import VideosCard from "./VideosCard";
import { Link } from "react-router-dom";

export default function Content() {
  const settings = useContext(settingsContext);
  const themes = useContext(themesContext);
  const categories = useContext(categoriesContext);

  return (
    <div className="grid gap-2 h-screen grid-rows-[auto_auto_auto_1fr] overflow-hidden">
      {settings.settingsState.language === "English" ? (
        <div
          className={clsx(
            "group flex items-center gap-2 w-fit p-2 rounded-[5px] duration-200 mb-1",
            themes.thirdColor.bg,
            themes.fcolor.bgHover
          )}
        >
          <h1 className="md:text-[18px] font-semibold">categories</h1>
          <div className="rotate-90 group-hover:translate-x-0.5 transition-all">
            <i className="fa-solid fa-arrow-right text-[16px] pt-[3px] -rotate-90"></i>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            "group flex items-center gap-2 w-fit p-2 rounded-[5px] duration-200 ml-auto mb-1",
            themes.thirdColor.bg,
            themes.fcolor.bgHover
          )}
        >
          <div className="-rotate-90 group-hover:-translate-x-0.5 transition-all">
            <i className="fa-solid fa-arrow-left text-[16px] rotate-90"></i>
          </div>
          <h1 className="md:text-[18px] font-semibold">فئات</h1>
        </div>
      )}
      <CategoryBar />
      <div
        className={clsx(
          "group flex items-center gap-2 w-fit p-2 rounded-[5px] duration-200 mt-3 mb-1",
          themes.thirdColor.bg,
          themes.fcolor.bgHover
        )}
      >
        <h1 className="md:text-[18px] font-semibold">
          {categories.categoriesState.selected}
        </h1>
        <div className="rotate-90 group-hover:translate-x-0.5 transition-all">
          <i className="fa-solid fa-arrow-right text-[16px] pt-[3px] -rotate-90"></i>
        </div>
      </div>
      <div className="overflow-y-auto pr-1 pb-22 content-start items-start">
        <VideosCard />
      </div>
    </div>
  );
}
