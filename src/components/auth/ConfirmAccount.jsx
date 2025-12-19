import { useState, useContext, useEffect, useRef } from "react";
import { settingsContext } from "../../state-management/Settings";
import { userContext } from "../../state-management/UserState";
import { themesContext } from "../../state-management/Themes";
import clsx from "clsx";
import ShowMessage from "../ShowMessage";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import confirmAccount from "../../services/confirmAccountService";

export default function ConfirmAccount() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);
  const user = useContext(userContext);

  const navigate = useNavigate();

  const submitInput = useRef(null);

  useEffect(() => {
    if (user.userState.userName) navigate("/");
  }, []);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState({ message: "", status: null });

  const userEmail = localStorage.getItem("user-email");

  useEffect(() => {
    if (!userEmail) {
      navigate("/sign-up");
    }
  }, []);

  const validate = () => {
    if (!code || code.length < 5) {
      setMessage({
        message:
          settngs.settingsState.language === "English"
            ? "Invalid confirmation code"
            : "رمز التحقق غير صحيح",
        status: false,
      });
      return;
    }

    fetchData();
  };

  async function fetchData() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f14f";
    try {
      const result = await confirmAccount(userEmail, code);

      if (!result.ok) {
        if (result.message.includes("expired")) {
          setTimeout(() => {
            navigate("/sign-up");
          }, 500);
        }
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });
        setLoading(false);
        submitInput.current.disabled = false;
        submitInput.current.style.backgroundColor = "#f1f1f1";
        return;
      }

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });

      user.setUserState((prev) => {
        return {
          ...prev,
          userName: result.user.user_name,
          email: result.user.email,
          avatar: result.user.avatar_url,
          createdAt: result.user.created_at,
        };
      });

      localStorage.setItem("token", result.token);

      settngs.setSettings((prev) => {
        return {
          ...prev,
          save_watch_history: result.user.save_watch_history,
          notifications: result.user.notifications,
        };
      });

      setTimeout(() => {
        localStorage.removeItem("user-email");
        window.location.pathname = "/";
      }, 500);

      setLoading(false);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
      setLoading(false);
    }
  }

  return (
    <div
      className={clsx(
        themes.mainColor.bg,
        themes.secondColor.color,
        "h-screen content-center p-2"
      )}
    >
      {loading && <Loading />}
      <form
        onClick={(e) => e.preventDefault()}
        className={clsx(
          themes.fcolor.bg,
          "relative grid max-w-[500px] rounded-[15px] p-3 m-auto shadow-[0px_0px_5px_0px_#f1f1f1]"
        )}
      >
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="px-2 py-1 text-xs border rounded"
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
            className="px-2 py-1 text-xs border rounded"
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
        <img src="images/logo.png" className="w-15 h-15 m-auto" />
        <h1 className="text-[19px] font-medium text-center">
          {settngs.settingsState.language === "English"
            ? "Confirm your account"
            : "تأكيد حسابك"}
        </h1>
        <p className="text-[12px] text-center pt-2 pb-2">
          {settngs.settingsState.language === "English"
            ? `We sent a confirmation code to your email`
            : "لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني"}
        </p>
        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language === "English"
              ? "Confirmation Code"
              : "رمز التحقق"}
          </p>
          <input
            onBlur={(e) => setCode(e.target.value)}
            name="code"
            type="text"
            placeholder={
              settngs.settingsState.language === "English"
                ? "Enter code"
                : "أدخل الرمز"
            }
            className={clsx(
              "p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-2",
              {
                inputAr: settngs.settingsState.language === "Arabic",
              }
            )}
          />
        </label>
        <div className="flex gap-1 mt-2">
          <button
            onClick={validate}
            ref={submitInput}
            className={clsx(
              "flex-1 p-1 md:p-2 rounded-[5px]",
              themes.secondColor.bg,
              themes.mainColor.color,
              "hover:bg-[#f1f1f1b8] duration-200"
            )}
          >
            {settngs.settingsState.language === "English" ? "Verify" : "تأكيد"}
          </button>
          <Link to={"/"}>
            <button
              className={clsx(
                "flex-none  p-1 md:p-2 rounded-[5px]",
                themes.secondColor.bg,
                themes.mainColor.color,
                "hover:bg-[#f1f1f1b8] duration-200"
              )}
            >
              {settngs.settingsState.language === "English" ? "Back" : "رجوع"}
            </button>
          </Link>
        </div>
      </form>
      <p className="text-xs text-gray-300 text-center pt-2">
        &copy; {new Date().getFullYear()} Liketube. All rights reserved.
      </p>
      {message.status !== null ? (
        <ShowMessage value={{ message, setMessage }} />
      ) : null}
    </div>
  );
}
