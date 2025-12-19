import { useState, useContext, useEffect, useRef } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import clsx from "clsx";
import ShowMessage from "../ShowMessage";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import register from "../../services/registerService";
import { userContext } from "../../state-management/UserState";

export default function Signup() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);
  const user = useContext(userContext);

  const submitInput = useRef(null);

  const navigate = useNavigate();

  const [userinfo, setUserinfo] = useState({
    user_name: "",
    email: "",
    avatar: null,
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    message: "",
    status: null,
  });

  useEffect(() => {
    if (user.userState.userName) navigate("/");
  }, []);

  async function fetchData() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f14f";

    try {
      const result = await register(userinfo);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message,
            status: result.ok,
          };
        });
        setLoading(false);
        submitInput.current.disabled = false;
        submitInput.current.style.backgroundColor = "#f1f1f1";

        return;
      }

      localStorage.setItem("user-email", userinfo.email);

      setMessage((prev) => {
        return {
          ...prev,
          message: result.message,
          status: result.ok,
        };
      });

      setTimeout(() => {
        navigate("/confirm-account");
      }, 1000);

      setLoading(false);
    } catch (err) {
      setMessage((prev) => {
        return {
          ...prev,
          message: err.message,
          status: false,
        };
      });
      setLoading(false);
    }
  }

  function validate() {
    if (!userinfo.user_name || userinfo.user_name.trim().length == 0) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language == "English"
              ? "name should not be empty and more than 3 letters"
              : "يجب أن لا يكون الاسم فارغًا ويزيد عن 3 أحرف",
          status: false,
        };
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userinfo.email)) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language == "English"
              ? "You entered invalid email"
              : "لقد أدخلت بريدًا إلكترونيًا غير صالح",
          status: false,
        };
      });
      return;
    }

    if (!userinfo.password || typeof userinfo.password !== "string") {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language == "English"
              ? "password should be 8 letters or more"
              : "يجب أن تكون كلمة المرور مكونة من 8 أحرف أو أكثر",
          status: false,
        };
      });
      return;
    }

    if (userinfo.password !== userinfo.confirmPassword) {
      setMessage((prev) => {
        return {
          ...prev,
          message:
            settngs.settingsState.language === "English"
              ? "Passwords do not match. Please try again."
              : "كلمتا المرور غير متطابقتين. يرجى المحاولة مرة أخرى.",
          status: false,
        };
      });
      return;
    }

    fetchData();
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
        onSubmit={(e) => {
          e.preventDefault();
        }}
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
        <img src="public/logo.png" className={clsx("w-15 h-15 m-auto")} />
        <h1 className="text-[19px] font-medium text-center">
          {settngs.settingsState.language == "English"
            ? "create account"
            : "إنشاء حساب"}
        </h1>
        <p className="text-[12px] text-center pt-2 pb-2">
          {settngs.settingsState.language == "English"
            ? "Complete Your info to sign up to our application"
            : "أكمل معلوماتك للتسجيل في تطبيقنا"}
        </p>
        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language == "English"
              ? "user name"
              : "اسم المستخدم"}
          </p>
          <input
            onBlur={(e) => {
              setUserinfo((prev) => {
                return { ...prev, user_name: e.target.value };
              });
            }}
            name="user name"
            type="text"
            min={3}
            placeholder={
              settngs.settingsState.language == "English"
                ? "user name"
                : "اسم المستخدم"
            }
            className={clsx(
              "p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-1",
              {
                "inputAr ": settngs.settingsState.language == "Arabic",
              }
            )}
          />
        </label>
        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language == "English"
              ? "email"
              : "البريد الالكتروني"}
          </p>
          <input
            onBlur={(e) => {
              setUserinfo((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
            name="email"
            type="email"
            placeholder={
              settngs.settingsState.language == "English"
                ? "email"
                : "البريد الالكتروني"
            }
            className={clsx(
              "p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-1",
              {
                "inputAr ": settngs.settingsState.language == "Arabic",
              }
            )}
          />
        </label>
        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language == "English"
              ? "avatar"
              : "الصورة الرمزية"}
          </p>
          <input
            onChange={(e) =>
              setUserinfo((prev) => {
                return { ...prev, avatar: e.target.files[0] };
              })
            }
            name="avatar"
            type="file"
            min={8}
            placeholder={
              settngs.settingsState.language == "English"
                ? "avatar"
                : "الصورة الرمزية"
            }
            className={clsx(
              "p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-1",
              {
                "inputAr ": settngs.settingsState.language == "Arabic",
              }
            )}
          />
        </label>
        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language == "English" ? "password" : "الرمز"}
          </p>
          <input
            onBlur={(e) => {
              setUserinfo((prev) => {
                return { ...prev, password: e.target.value };
              });
            }}
            name="password"
            type="password"
            min={8}
            placeholder={
              settngs.settingsState.language == "English" ? "password" : "الرمز"
            }
            className={clsx(
              "p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-1",
              {
                "inputAr ": settngs.settingsState.language == "Arabic",
              }
            )}
          />
        </label>
        <label className="grid">
          <p
            className={clsx("p-1 text-[14px]", {
              "text-right": settngs.settingsState.language === "Arabic",
            })}
          >
            {settngs.settingsState.language == "English"
              ? "confirm password"
              : "تاكيد الرمز"}
          </p>
          <input
            onBlur={(e) => {
              setUserinfo((prev) => {
                return { ...prev, confirmPassword: e.target.value };
              });
            }}
            name="confirm password"
            type="password"
            min={8}
            placeholder={
              settngs.settingsState.language == "English"
                ? "confirm password"
                : "تاكيد الرمز"
            }
            className={clsx(
              "p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-1",
              {
                "inputAr ": settngs.settingsState.language == "Arabic",
              }
            )}
          />
        </label>
        <Link to={"/sign-in"}>
          <p className="text-[14px] pt-1 pb-1 text-center">
            {settngs.settingsState.language === "English"
              ? "I have account already?"
              : "لدي حساب بالفعل؟"}
          </p>
        </Link>
        <div className="flex gap-1 mt-1">
          <button
            onClick={() => {
              validate();
            }}
            ref={submitInput}
            className={clsx(
              "flex-1 p-1 rounded-[5px]",
              themes.secondColor.bg,
              themes.mainColor.color,
              "hover:bg-[#f1f1f1b8] duration-200"
            )}
          >
            {settngs.settingsState.language === "English" ? "submit" : "ارسال"}
          </button>
          <Link to={"/"}>
            <button
              className={clsx(
                "flex-none p-1 rounded-[5px]",
                themes.secondColor.bg,
                themes.mainColor.color,
                "hover:bg-[#f1f1f1b8] duration-200"
              )}
            >
              {settngs.settingsState.language === "English" ? "back" : "رجوع"}
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
