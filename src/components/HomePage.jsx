import { useContext } from "react";
import { themesContext } from "../state-management/Themes";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import clsx from "clsx";
import { Outlet } from "react-router-dom";

export default function HomePage() {
  const themes = useContext(themesContext);

  return (
    <div
      className={clsx(
        "flex h-screen p-1 md:p-2 gap-1 md:gap-2 overflow-hidden",
        themes.mainColor.bg,
        themes.secondColor.color
      )}
    >
      <div className="grid gap-1 w-full content-start">
        <Header />
        <Outlet />
      </div>
      <Sidebar />
    </div>
  );
}
