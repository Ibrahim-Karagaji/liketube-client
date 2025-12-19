import { useState, useContext, useRef, useEffect } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import { userContext } from "../../state-management/UserState";
import clsx from "clsx";
import ShowMessage from "../ShowMessage";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import forgotPassword from "../../services/forgotPasswordService";

export default function ForgotPassword() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);
  const user = useContext(userContext);

  const submitInput = useRef(null);

  useEffect(() => {
    if (user.userState.userName) navigate("/");
  }, []);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: "", status: null });

  async function fetchData() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f14f";
    try {
      const result = await forgotPassword(email);

      if (!result.ok) {
        setMessage((prev) => {
          return { ...prev, message: result.message, status: result.ok };
        });
        setLoading(false);
        submitInput.current.disabled = false;
        submitInput.current.style.backgroundColor = "#f1f1f1";
        return;
      }

      setTimeout(() => {
        navigate("/reset-password");
      }, 900);

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });

      localStorage.setItem("resetpassword", result.resetPasswordToenk);

      setLoading(false);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
    }
  }

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({
        message:
          settngs.settingsState.language === "English"
            ? "Invalid email format"
            : "صيغة البريد الإلكتروني غير صحيحة",
        status: false,
      });
      return;
    }
    fetchData();
  };

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
            ? "Forgot Password"
            : "نسيت كلمة المرور"}
        </h1>
        <p className="text-[12px] text-center pt-2 pb-2">
          {settngs.settingsState.language === "English"
            ? "Enter your email to receive a reset code"
            : "أدخل بريدك الإلكتروني لإرسال رمز إعادة التعيين"}
        </p>

        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language === "English"
              ? "Email"
              : "البريد الإلكتروني"}
          </p>
          <input
            onBlur={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder={
              settngs.settingsState.language === "English"
                ? "email"
                : "البريد الإلكتروني"
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
              "flex-1 p-2 rounded-[5px]",
              themes.secondColor.bg,
              themes.mainColor.color,
              "hover:bg-[#f1f1f1b8] duration-200"
            )}
          >
            {settngs.settingsState.language === "English" ? "Send" : "إرسال"}
          </button>
          <Link to={"/sign-in"}>
            <button
              className={clsx(
                "flex-none p-2 rounded-[5px]",
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
