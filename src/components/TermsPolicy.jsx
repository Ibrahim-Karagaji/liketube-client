import { useContext } from "react";
import { settingsContext } from "../state-management/Settings";
import { themesContext } from "../state-management/Themes";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function TermsPolicy() {
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
          "grid p-4 rounded-[5px] max-w-[1000px] m-auto relative",
          themes.fcolor.bg
        )}
      >
        <div
          className={clsx("absolute top-1 right-1 flex gap-2 text-[9px]", {
            "left-1": settngs.settingsState.language === "Arabic",
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
        <i className="fa-solid fa-file-contract text-center md:text-[25px] text-[22px] mt-3"></i>
        <h1
          className={clsx("md:text-[22px] text-[19px] mt-2", {
            "text-end": settngs.settingsState.language === "Arabic",
          })}
        >
          {settngs.settingsState.language === "English"
            ? "Terms & Policy"
            : "الشروط والسياسة"}
        </h1>
        <p
          className={clsx("mt-2 md:text-[14px] text-[12px] leading-loose", {
            "text-end": settngs.settingsState.language === "Arabic",
          })}
        >
          {settngs.settingsState.language === "English"
            ? "Welcome to Liketube. These terms govern your use of our website and services."
            : "أهلاً بك في LikeTube. تُنظّم هذه الشروط استخدامك لموقعنا وخدماتنا."}
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <h2
              className={clsx("font-semibold md:text-[16px] text-[14px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "1. User Responsibilities"
                : "1. مسؤوليات المستخدم"}
            </h2>
            <p
              className={clsx("mt-1 md:text-[14px] text-[12px] leading-loose", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "Users are responsible for the content they share and must comply with applicable laws."
                : "المستخدمون مسؤولون عن المحتوى الذي يشاركونه ويجب أن يلتزموا بالقوانين المعمول بها."}
            </p>
          </div>
          <div>
            <h2
              className={clsx("font-semibold md:text-[16px] text-[14px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "2. Privacy Policy"
                : "2. سياسة الخصوصية"}
            </h2>
            <p
              className={clsx("mt-1 md:text-[14px] text-[12px] leading-loose", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "We respect your privacy and handle personal data in accordance with applicable regulations."
                : "نحن نحترم خصوصيتك ونتعامل مع البيانات الشخصية وفقًا للوائح المعمول بها."}
            </p>
          </div>
          <div>
            <h2
              className={clsx("font-semibold md:text-[16px] text-[14px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "3. Limitation of Liability"
                : "3. تحديد المسؤولية"}
            </h2>
            <p
              className={clsx("mt-1 md:text-[14px] text-[12px] leading-loose", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "Liketube is not responsible for any damages resulting from the use of the site."
                : "لا يتحمل Liketube أي مسؤولية عن أي أضرار ناتجة عن استخدام الموقع."}
            </p>
          </div>
          <div>
            <h2
              className={clsx("font-semibold md:text-[16px] text-[14px]", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "4. Changes to Terms"
                : "4. تعديل الشروط"}
            </h2>
            <p
              className={clsx("mt-1 md:text-[14px] text-[12px] leading-loose", {
                "text-end": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "We may update these terms from time to time. Users are encouraged to review them regularly."
                : "قد نقوم بتحديث هذه الشروط من وقت لآخر. يُنصح المستخدمون بمراجعتها بشكل منتظم."}
            </p>
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
            {settngs.settingsState.language === "English" ? "Back" : "رجوع"}
          </button>
        </Link>
      </div>
      <p className="text-xs text-gray-300 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
    </div>
  );
}
