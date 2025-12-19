import { useContext } from "react";
import { themesContext } from "../state-management/Themes";
import { categoriesContext } from "../state-management/Categories";
import clsx from "clsx";

export default function CategoryBar() {
  const themes = useContext(themesContext);
  const categories = useContext(categoriesContext);

  return (
    <div
      className={clsx(
        "flex gap-1 p-1 md:p-2 rounded-[5px] overflow-auto justify-evenly",
        themes.thirdColor.bg
      )}
    >
      {categories.categoriesState.list.map((item, index) => {
        return (
          <div
            key={index}
            className={clsx(
              "flex items-center gap-1 p-2 duration-200 rounded-[5px] whitespace-nowrap",
              themes.fcolor.bgHover,
              {
                [themes.fcolor.bg]:
                  categories.categoriesState.selected == item.category,
              }
            )}
            onClick={() => {
              categories.setCategoriesState((prev) => {
                return { ...prev, selected: item.category };
              });
            }}
          >
            {item.icon}
            <p className="text-[11px]">{item.category}</p>
          </div>
        );
      })}
    </div>
  );
}
