import { useState, useContext, useEffect, useRef } from "react";
import { settingsContext } from "../state-management/Settings";
import { themesContext } from "../state-management/Themes";
import { userContext } from "../state-management/UserState";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import sendFeedbackService from "../services/sendFeedbackService";
import Loading from "./Loading";
import ShowMessage from "./ShowMessage";

export default function Feedbac() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);
  const user = useContext(userContext);

  const titleInput = useRef(null);
  const feedbackInput = useRef(null);

  const [message, setMessage] = useState({ message: "", status: null });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [feedbackState, setFeedbackState] = useState({
    feedback: "",
    type: "",
    title: "",
  });

  useEffect(() => {
    if (!user.userState.userName) {
      navigate("/");
    }
  }, []);

  async function sendFeedback() {
    setLoading(true);

    try {
      const result = await sendFeedbackService(feedbackState);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
      }

      setMessage((prev) => {
        return {
          ...prev,
          message: result.message,
          status: result.ok,
        };
      });

      setFeedbackState({
        feedback: "",
        type: "",
        title: "",
      });

      titleInput.current.value = "";
      feedbackInput.current.value = "";
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={clsx(
        "h-screen content-center p-1.5",
        themes.mainColor.bg,
        themes.secondColor.color
      )}
    >
      {loading && <Loading />}
      <div
        className={clsx(
          "grid p-2 md:p-3 rounded-sm max-w-[650px] m-auto relative",
          themes.fcolor.bg
        )}
      >
        <div className="absolute top-1.5 right-1.5 flex gap-1.5">
          <button
            className="px-1.5 py-0.5 text-[11px] border rounded"
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
            className="px-1.5 py-0.5 text-[11px] border rounded"
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
        <img
          src="public/logo.png"
          alt="logo"
          className="md:w-36 w-28 md:h-36 h-28 m-auto"
        />
        <h1 className="text-center text-[15px] md:text-[17px] font-semibold">
          {settngs.settingsState.language == "English"
            ? "I'm value your feedback"
            : "أنا أقدر ملاحظاتك"}
        </h1>
        <p className="md:text-[14px] text-[12px] text-center my-2.5 line-clamp-2 overflow-hidden">
          {settngs.settingsState.language == "English"
            ? "I'm glad to receive your feedback. Your insights help me improve my service and provide you with a better experience"
            : "يسعدني تلقي تعليقاتك. تساعدني رؤيتك في تحسين خدمتي وتزويدك بتجربة أفضل"}
        </p>
        <form
          className={clsx(
            "md:p-2 p-1.5 rounded-[3px] grid gap-3",
            themes.mainColor.bg
          )}
          onClick={(e) => e.preventDefault()}
        >
          <label className="grid gap-1 text-[11px] md:text-[13px]">
            <p
              className={clsx("px-0.5", {
                "text-end": settngs.settingsState.language == "Arabic",
              })}
            >
              {settngs.settingsState.language == "English" ? "Title" : "عنوان"}
            </p>
            <input
              ref={titleInput}
              onBlur={(e) =>
                setFeedbackState((prev) => {
                  return { ...prev, title: e.target.value };
                })
              }
              className={clsx(
                "shadow-[0px_0px_3px_0px_#f1f1f1] p-1 md:p-1.5 rounded-[3px]",
                { inputAr: settngs.settingsState.language == "Arabic" }
              )}
              type="text"
              name="title"
              placeholder={
                settngs.settingsState.language == "English" ? "Title" : "عنوان"
              }
            />
          </label>
          <label className="grid gap-1 text-[11px] md:text-[13px]">
            <p
              className={clsx("px-0.5", {
                "text-end": settngs.settingsState.language == "Arabic",
              })}
            >
              {settngs.settingsState.language == "English"
                ? "Feedback type"
                : "نوع الملاحظة"}
            </p>
            <select
              onClick={(e) => {
                if (settngs.settingsState.language == "English") {
                  setFeedbackState((prev) => {
                    return { ...prev, type: e.target.value };
                  });
                } else {
                  setFeedbackState((prev) => {
                    return {
                      ...prev,
                      type:
                        e.target.value == "خطأ"
                          ? "bug"
                          : e.target.value == "اقتراح"
                          ? "suggestion"
                          : e.target.value == "ميزة"
                          ? "feature"
                          : "complaint",
                    };
                  });
                }
              }}
              className={clsx(
                "shadow-[0px_0px_3px_0px_#f1f1f1] rounded-[3px] p-1 md:p-1.5",
                themes.mainColor.bg
              )}
              name="feeback type"
            >
              {settngs.settingsState.language == "English"
                ? ["bug", "suggestion", "feature", "complaint"].map(
                    (item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    )
                  )
                : ["خطأ", "اقتراح", "ميزة", "شكوى"].map((item, index) => (
                    <option value={item} key={index} className="inputAr">
                      {item}
                    </option>
                  ))}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] md:text-[13px]">
            <p
              className={clsx("px-0.5", {
                "text-end": settngs.settingsState.language == "Arabic",
              })}
            >
              {settngs.settingsState.language == "English"
                ? "Feedback"
                : "الملاحظة"}
            </p>
            <textarea
              ref={feedbackInput}
              onBlur={(e) =>
                setFeedbackState((prev) => {
                  return { ...prev, feedback: e.target.value };
                })
              }
              className={clsx(
                "resize-none shadow-[0px_0px_3px_0px_#f1f1f1] rounded-[3px] p-1",
                { inputAr: settngs.settingsState.language == "Arabic" }
              )}
              placeholder={
                settngs.settingsState.language === "English"
                  ? "Please share your thoughts, suggestions, or feature ideas..."
                  : "من فضلك شاركنا أفكارك أو اقتراحاتك أو أفكار الميزات..."
              }
              name="feedback"
              rows="3"
            ></textarea>
          </label>
          <label className="flex items-center gap-1 text-[11px] md:text-[13px]">
            <button
              onClick={() => sendFeedback()}
              className={clsx(
                "flex-1 p-1 rounded-sm",
                themes.secondColor.bg,
                themes.mainColor.color
              )}
            >
              {settngs.settingsState.language == "English" ? "Submit" : "ارسال"}
            </button>
            <Link to={"/"}>
              <button
                className={clsx(
                  "flex-none px-1.5 py-1 rounded-sm",
                  themes.secondColor.bg,
                  themes.mainColor.color
                )}
              >
                {settngs.settingsState.language == "English" ? "Back" : "رجوع"}
              </button>
            </Link>
          </label>
        </form>
      </div>
      <p className="text-xs text-gray-300 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
      {message.status !== null ? (
        <ShowMessage value={{ message, setMessage }} />
      ) : null}
    </div>
  );
}
