import { useContext, useEffect } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import { serachContext } from "../../state-management/SearchState";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const settings = useContext(settingsContext);
  const themes = useContext(themesContext);
  const serachState = useContext(serachContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!serachState.searchState.serach) navigate("/");
  }, [serachState.searchState.serach]);

  return (
    <div
      className={clsx(
        "flex items-center border-2 rounded-3xl w-[72%] md:w-full",
        themes.fcolor.border
      )}
    >
      {settings.settingsState.language == "English" ? (
        <>
          <i
            className={clsx(
              "fa-solid fa-magnifying-glass text-[16px] rounded-3xl p-2 md:p-3 w-12 text-center",
              themes.thirdColor.bg
            )}
          ></i>
          <input
            value={serachState.searchState.serach}
            onChange={(e) =>
              serachState.setSearchState((prev) => {
                return { ...prev, serach: e.target.value };
              })
            }
            className="w-full h-full p-1 md:p-3 text-[13px]"
            type="text"
            placeholder={"Search"}
          />
          <p
            onClick={() => {
              serachState.setSearchState((prev) => {
                return { ...prev, status: true };
              });
              navigate("/searching");
            }}
            className={clsx(
              "text-[0px] bg-blue-700 md:p-0 p-0 rounded-full duration-150 hover:bg-blue-800 cursor-pointer",
              { "text-[12px] md:p-3 p-2": serachState.searchState.serach }
            )}
          >
            search
          </p>
        </>
      ) : (
        <>
          <p
            onClick={() => {
              serachState.setSearchState((prev) => {
                return { ...prev, status: true };
              });
              navigate("/searching");
            }}
            className={clsx(
              "text-[0px] bg-blue-700 md:p-0 p-0 rounded-full duration-150 hover:bg-blue-800 cursor-pointer",
              { "text-[12px] md:p-3 p-2": serachState.searchState.serach }
            )}
          >
            بحث
          </p>
          <input
            value={serachState.searchState.serach}
            onChange={(e) =>
              serachState.setSearchState((prev) => {
                return { ...prev, serach: e.target.value };
              })
            }
            className="w-full text-end h-full p-2 md:p-3 text-[13px] ml-auto"
            type="text"
            placeholder={"بحث"}
          />
          <i
            className={clsx(
              "fa-solid fa-magnifying-glass text-[16px] p-2 md:p-3 rounded-3xl w-12 text-center",
              themes.thirdColor.bg
            )}
          ></i>
        </>
      )}
    </div>
  );
}
