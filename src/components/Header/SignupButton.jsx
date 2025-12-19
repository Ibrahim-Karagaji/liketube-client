import { useContext } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function SignupButton() {
  const settings = useContext(settingsContext);
  const themes = useContext(themesContext);

  return (
    <Link to={"sign-up"}>
      <button
        className={clsx(
          "p-3 rounded-3xl items-center duration-200 whitespace-nowrap hidden md:flex cursor-pointer",
          themes.fcolor.bgHover,
          themes.thirdColor.bg
        )}
      >
        {settings.settingsState.language == "English" ? (
          <>
            <i className="fa-solid fa-plus text-[16px]"></i>
            <span className="md:text-[13px] pl-1">Create account</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-plus text-[16px]"></i>
            <span className="md:text-[13px] pl-1">انشاء حساب</span>
          </>
        )}
      </button>
    </Link>
  );
}
