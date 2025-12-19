import SignupButton from "./SignupButton";
import SearchBar from "./SearchBar";
import CreateChannelButton from "./CreateChannelButton";
import UploadVdeoButton from "./UploadVdeoButton";
import { useContext } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import { userContext } from "../../state-management/UserState";
import { channelContext } from "../../state-management/ChannelState";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function Header() {
  const settings = useContext(settingsContext);
  const themes = useContext(themesContext);
  const user = useContext(userContext);
  const channel = useContext(channelContext);

  return (
    <div className="flex-1 flex h-fit sm:gap-2.5 gap-1 items-center mb-5 relative">
      {user.userState.userName ? (
        <Link to={"/user-profile"}>
          <img
            src={user.userState.avatar || "public/Anonymous-user.jpg"}
            alt=""
            className={clsx("w-7 md:w-10 rounded-[50%] cursor-pointer")}
          />
        </Link>
      ) : null}
      {user.userState.userName ? (
        channel.channelState.id ? (
          <UploadVdeoButton />
        ) : (
          <CreateChannelButton />
        )
      ) : (
        <SignupButton />
      )}
      <button
        onClick={() => {
          settings.setSettings((prev) => {
            if (settings.settingsState.language == "English") {
              localStorage.setItem("language", "Arabic");
              return { ...prev, language: "Arabic" };
            } else {
              localStorage.setItem("language", "English");
              return { ...prev, language: "English" };
            }
          });
        }}
        className={clsx(
          "p-1 md:p-2 rounded-[50%] duration-200 text-[12px] cursor-pointer",
          themes.fcolor.bgHover
        )}
      >
        {settings.settingsState.language == "English" ? "En" : "Ar"}
      </button>
      <SearchBar />
    </div>
  );
}
