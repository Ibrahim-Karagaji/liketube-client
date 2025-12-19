import { createContext, useState } from "react";

export const categoriesContext = createContext();

export default function Categories({ children }) {
  const [categoriesState, setCategoriesState] = useState({
    list: [
      {
        category: "Random",
        icon: <i className="fa-solid fa-shuffle text-[13px]"></i>,
      },
      {
        category: "Gaming",
        icon: <i className="fa-solid fa-gamepad text-[13px]"></i>,
      },
      {
        category: "Education",
        icon: <i className="fa-solid fa-school text-[13px]"></i>,
      },
      {
        category: "Comedy",
        icon: <i className="fa-solid fa-face-grin-tears text-[13px]"></i>,
      },
      {
        category: "Entertainment",
        icon: <i className="fa-solid fa-wand-magic-sparkles text-[13px]"></i>,
      },
      {
        category: "News & Politics",
        icon: <i className="fa-solid fa-newspaper text-[13px]"></i>,
      },
      {
        category: "Science & Technology",
        icon: <i className="fa-solid fa-atom text-[13px]"></i>,
      },
      {
        category: "Film & Animation",
        icon: <i className="fa-solid fa-film text-[13px]"></i>,
      },
      {
        category: "Autos & Vehicles",
        icon: <i className="fa-solid fa-truck-monster text-[13px]"></i>,
      },
      {
        category: "Pets & Animals",
        icon: <i className="fa-solid fa-cat text-[13px]"></i>,
      },
    ],
    selected: "Random",
  });

  const changeSelected = (value) => {
    setCategoriesState((prev) => {
      return { ...prev, selected: value };
    });
  };

  const values = {
    categoriesState: categoriesState,
    setCategoriesState,
    changeSelected: changeSelected,
  };
  return (
    <categoriesContext.Provider value={values}>
      {children}
    </categoriesContext.Provider>
  );
}
