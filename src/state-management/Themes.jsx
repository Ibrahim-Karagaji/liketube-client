import { createContext } from "react";

export const themesContext = createContext();

export default function Themes({ children }) {
  const themes = {
    mainColor: {
      bg: "bg-[#0f0f0f]",
      color: "text-[#0f0f0f]",
      border: "border-[#0f0f0f]",
      colorHover: "hover:text-[#0f0f0f]",
      bgHover: "hover:bg-[#0f0f0f]",
    },
    secondColor: {
      bg: "bg-[#f1f1f1]",
      color: "text-[#f1f1f1]",
      border: "border-[#f1f1f1]",
      colorHover: "hover:text-[#f1f1f1]",
      bgHover: "hover:bg-[#f1f1f1]",
    },
    thirdColor: {
      bg: "bg-[#212121]",
      color: "text-[#212121]",
      border: "border-[#212121]",
      colorHover: "hover:text-[#212121]",
      bgHover: "hover:bg-[#212121]",
    },
    fcolor: {
      bg: "bg-[#9393935e]",
      color: "text-[#9393935e]",
      border: "border-[#9393935e]",
      colorHover: "hover:text-[#9393935e]",
      bgHover: "hover:bg-[#9393935e]",
    },
  };

  return (
    <themesContext.Provider value={themes}>{children}</themesContext.Provider>
  );
}
