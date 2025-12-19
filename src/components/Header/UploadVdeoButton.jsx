import { useContext } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function uploadVdeoButton() {
  const settings = useContext(settingsContext);
  const themes = useContext(themesContext);
  return (
    <Link to={"/upload-video"}>
      <button
        className={clsx(
          "p-3 rounded-3xl hidden md:flex gap-1 items-center duration-200 whitespace-nowrap cursor-pointer",
          themes.fcolor.bgHover,
          themes.thirdColor.bg
        )}
      >
        {settings.settingsState.language == "English" ? (
          <>
            <i class="fa-solid fa-upload text-[16px]"></i>
            <p className="md:text-[13px]">Upload video</p>
          </>
        ) : (
          <>
            <i class="fa-solid fa-upload text-[16px]"></i>
            <p className="md:text-[13px]">تحميل الفيديو</p>
          </>
        )}
      </button>
    </Link>
  );
}
