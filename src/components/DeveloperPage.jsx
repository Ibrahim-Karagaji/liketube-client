import { useContext } from "react";
import { settingsContext } from "../state-management/Settings";
import { themesContext } from "../state-management/Themes";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function DeveloperPage() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);

  return (
    <div
      className={clsx(
        "h-screen md:p-2 p-1 overflow-auto",
        themes.mainColor.bg,
        themes.secondColor.color
      )}
    >
      <div
        className={clsx(
          "grid p-2 rounded-[5px] max-w-[1000px] m-auto relative",
          themes.fcolor.bg
        )}
      >
        <div
          className={clsx("absolute top-1 right-1 flex gap-2 text-[9px]", {
            "left-1": settngs.settingsState.language == "Arabic",
          })}
        >
          <button
            className="px-2 py-1 border rounded"
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
            className="px-2 py-1 border rounded"
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
        <i class="fa-solid fa-user-tie text-center md:text-[25px] text-[22px] mt-3"></i>
        <h1
          className={clsx("md:text-[22px] text-[19px]", {
            "text-end": settngs.settingsState.language == "Arabic",
          })}
        >
          {settngs.settingsState.language == "English"
            ? "Hello there 👋"
            : "أهلاً بك 👋"}
        </h1>
        <p
          className={clsx(
            "mt-2 md:text-[14px] text-[12px] line-clamp-2 overflow-hidden leading-loose",
            {
              "text-end": settngs.settingsState.language == "Arabic",
            }
          )}
        >
          {settngs.settingsState.language == "English"
            ? "My name is Ibrahim. I’m a full-stack web developer focused on backend development"
            : "اسمي إبراهيم، مطور ويب شامل، أركز على تطوير الواجهة الخلفية"}
        </p>
        <div
          className={clsx(
            "flex items-center gap-1 md:text-[19px] text-[16px] mt-5",
            { "justify-end": settngs.settingsState.language == "Arabic" }
          )}
        >
          {settngs.settingsState.language == "English" ? (
            <>
              <p>About the project</p>
              <i class="fa-solid fa-code "></i>
            </>
          ) : (
            <>
              <i class="fa-solid fa-code"></i>
              <p>عن المشروع</p>
            </>
          )}
        </div>
        <p
          className={clsx("mt-2 md:text-[14px] text-[11px] leading-loose", {
            "text-end": settngs.settingsState.language == "Arabic",
          })}
        >
          {settngs.settingsState.language == "English"
            ? "This project is similar to a mini YouTube, allowing users to easily and quickly import YouTube video links and display them directly on the website. I created this project to further practice backend development and improve my data management and backend application building skills. My focus was on designing a structured database architecture, creating efficient REST APIs to handle various requests, and processing data securely and quickly. I also handled data validation, error management, and ensuring stable server response. I used this project as a practical exercise to apply what I learned in backend development and experiment with new ideas in logic design and data flow control within the application"
            : `هذا مشروع يشبه يوتيوب بشكل مصغر، يتيح للمستخدمين إدخال روابط الفيديو من يوتيوب وعرضها مباشرة على الموقع بطريقة سهلة وسريعة. لقد قمت بإنشاء هذا المشروع للتدرب أكثر على تطوير الباك إند وتحسين مهاراتي في إدارة البيانات وبناء التطبيقات من الخلفية بشكل عملي. ركزت في هذا المشروع على تصميم هيكل قاعدة البيانات بشكل منظم، وإنشاء REST APIs فعالة للتعامل مع الطلبات المختلفة، ومعالجة البيانات بشكل آمن وسريع. كما تعاملت مع عمليات التحقق من البيانات، إدارة الأخطاء، وضمان استجابة السيرفر بطريقة مستقرة. استخدمت هذا المشروع كممارسة عملية لتطبيق ما تعلمته في الباك إند وتجربة أفكار جديدة في تصميم المنطق البرمجي والتحكم في سير البيانات داخل التطبيق`}
        </p>
        <div
          className={clsx(
            "flex items-center gap-1 md:text-[19px] text-[16px] mt-5 mb-3",
            { "justify-end": settngs.settingsState.language == "Arabic" }
          )}
        >
          {settngs.settingsState.language == "English" ? (
            <>
              <p>Used tools</p>
              <i class="fa-solid fa-screwdriver"></i>
            </>
          ) : (
            <>
              <i class="fa-solid fa-screwdriver"></i> <p>الأدوات المستخدمة</p>
            </>
          )}
        </div>
        <div className={clsx("md:flex grid gap-2")}>
          <div
            className={clsx(
              "grid gap-2 rounded-[5px] p-2 w-full content-start font-medium",
              themes.thirdColor.bg
            )}
          >
            <p
              className={clsx(
                "mt-2 md:text-[14px] text-[12px] line-clamp-2 overflow-hidden leading-loose",
                {
                  "text-end": settngs.settingsState.language == "Arabic",
                }
              )}
            >
              {settngs.settingsState.language == "English"
                ? "Front end"
                : "الواجهة الأمامية"}
            </p>
            <div className={clsx("flex flex-wrap items-center gap-2")}>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#007387] w-full">
                Tailwind
              </span>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#0d8fb3] w-full">
                React
              </span>
            </div>
          </div>
          <div
            className={clsx(
              "grid gap-2 rounded-[5px] p-2 w-full font-medium",
              themes.thirdColor.bg
            )}
          >
            <p
              className={clsx(
                "mt-2 md:text-[14px] text-[12px] line-clamp-2 overflow-hidden leading-loose",
                {
                  "text-end": settngs.settingsState.language == "Arabic",
                }
              )}
            >
              {settngs.settingsState.language == "English"
                ? "Back end"
                : "الجزء الخلفي"}
            </p>
            <div className={clsx("flex flex-wrap items-center gap-2")}>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#339933] w-full">
                Nodejs
              </span>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#000000] w-full">
                Express
              </span>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#00758F] w-full">
                Mysql
              </span>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#DC382D] w-full">
                Redis
              </span>
              <span className="rounded-[5px] p-2 md:p-4 bg-[#1e667c] w-[50%]">
                Docker
              </span>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "flex items-center gap-1 md:text-[19px] text-[16px] mt-5",
            { "justify-end": settngs.settingsState.language == "Arabic" }
          )}
        >
          {settngs.settingsState.language == "English" ? (
            <>
              <p>Contact me</p>
              <i class="fa-solid fa-screwdriver"></i>
            </>
          ) : (
            <>
              <i class="fa-solid fa-screwdriver"></i> <p>تواصل معي</p>
            </>
          )}
        </div>
        <div
          className={clsx(
            "grid gap-2 mt-5 text-[14px] p-2 rounded-[5px]",
            themes.thirdColor.bg,
            "relative z-10"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://mail.google.com/mail/?view=cm&to=Ibrahimkaragaji@gmail.com"
              target="_blank"
              className="flex items-center gap-2 rounded-[5px] p-2 md:p-4 bg-[#D14836] w-full hover:bg-red-600 transition-colors z-10 hover:underline"
            >
              <i className="fa-solid fa-envelope text-white"></i>
              <span className="text-white truncate">
                ibrahimkaragaji@gmail.com
              </span>
            </a>
            <a
              href="https://github.com/Ibrahim-Karagaji"
              target="_blank"
              className="flex items-center gap-2 rounded-[5px] p-2 md:p-4 bg-[#171515] w-full hover:bg-gray-800 transition-colors z-10 hover:underline"
            >
              <i className="fa-brands fa-github text-white"></i>
              <span className="text-white truncate">Ibrahim-Karagaji</span>
            </a>
          </div>
        </div>
        <Link to={"/"}>
          <button
            className={clsx(
              "w-full p-1 md:p-2 rounded-[5px] mt-8",
              themes.secondColor.bg,
              themes.mainColor.color,
              "hover:bg-[#f1f1f1b8] duration-200"
            )}
          >
            {settngs.settingsState.language === "English" ? "back" : "رجوع"}
          </button>
        </Link>
      </div>
      <p className="text-xs text-gray-300 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
    </div>
  );
}
