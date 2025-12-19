import { useState, useContext, useEffect, useRef } from "react";
import { settingsContext } from "../../state-management/Settings";
import { themesContext } from "../../state-management/Themes";
import { userContext } from "../../state-management/UserState";
import clsx from "clsx";
import ShowMessage from "../ShowMessage";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../Loading";
import verifyResetCode from "../../services/verifyResetCodeService";
import resetPassword from "../../services/resetPasswordService";

export default function ResetPassword() {
  const settngs = useContext(settingsContext);
  const themes = useContext(themesContext);
  const user = useContext(userContext);

  const submitInput = useRef(null);

  useEffect(() => {
    if (user.userState.userName) navigate("/");
  }, []);

  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ message: "", status: null });

  async function fetchData1() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f14f";
    try {
      const reslut = await verifyResetCode(code);

      if (!reslut.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: reslut.message?.message ?? reslut.message,
            status: reslut.ok,
          };
        });
        setLoading(false);

        return;
      }
      submitInput.current.disabled = false;
      submitInput.current.style.backgroundColor = "#f1f1f1";
      setMessage((prev) => {
        return { ...prev, message: reslut.message, status: reslut.ok };
      });

      setTimeout(() => {
        setShowPasswordFields(true);
      }, 1000);

      setLoading(false);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
      setLoading(false);
    }
  }

  const checkCode = () => {
    if (!code || code.length < 4) {
      setMessage({
        message:
          settngs.settingsState.language === "English"
            ? "Invalid reset code"
            : "رمز إعادة التعيين غير صحيح",
        status: false,
      });
      return;
    }

    fetchData1();
  };

  async function fetchData2() {
    setLoading(true);
    submitInput.current.disabled = true;
    submitInput.current.style.backgroundColor = "#f1f1f1";
    try {
      const result = await resetPassword(passwords.newPassword);

      if (!result.ok) {
        setMessage((prev) => {
          return {
            ...prev,
            message: result.message?.message ?? result.message,
            status: result.ok,
          };
        });
        submitInput.current.disabled = true;
        submitInput.current.style.backgroundColor = "#f1f1f1";
        setLoading(false);
        return;
      }

      setMessage((prev) => {
        return { ...prev, message: result.message, status: result.ok };
      });

      setTimeout(() => {
        navigate("/");
      }, 900);

      localStorage.removeItem("reset-password");

      setLoading(false);
    } catch (err) {
      setMessage((prev) => {
        return { ...prev, message: err.message, status: false };
      });
      setLoading(false);
    }
  }

  const submitNewPassword = () => {
    if (passwords.newPassword.length < 8) {
      setMessage({
        message:
          settngs.settingsState.language === "English"
            ? "Password must be 8 characters or more"
            : "يجب أن تكون كلمة المرور 8 أحرف أو أكثر",
        status: false,
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        message:
          settngs.settingsState.language === "English"
            ? "Passwords do not match"
            : "كلمتا المرور غير متطابقتين",
        status: false,
      });
      return;
    }

    fetchData2();
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
        <img src="public/logo.png" className="w-15 h-15 m-auto" />
        <h1 className="text-[19px] font-medium text-center">
          {settngs.settingsState.language === "English"
            ? "Reset Password"
            : "إعادة تعيين كلمة المرور"}
        </h1>
        <p className="text-[12px] text-center pt-2 pb-2">
          {settngs.settingsState.language === "English"
            ? "Enter the reset code sent to your email"
            : "أدخل رمز إعادة التعيين الذي أرسل إلى بريدك الإلكتروني"}
        </p>
        {!showPasswordFields && (
          <label className="grid">
            <p
              className={clsx("p-1 text-[14px]", {
                "text-right": settngs.settingsState.language === "Arabic",
              })}
            >
              {settngs.settingsState.language === "English"
                ? "Reset Code"
                : "رمز التعيين"}
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
                { inputAr: settngs.settingsState.language === "Arabic" }
              )}
            />
          </label>
        )}
        {showPasswordFields && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid"
          >
            <label className="grid mt-3">
              <p
                className={clsx("p-1 text-[14px]", {
                  "text-right": settngs.settingsState.language === "Arabic",
                })}
              >
                {settngs.settingsState.language === "English"
                  ? "New Password"
                  : "كلمة المرور الجديدة"}
              </p>
              <input
                type="password"
                onBlur={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-2"
              />
            </label>
            <label className="grid">
              <p
                className={clsx("p-1 text-[14px]", {
                  "text-right": settngs.settingsState.language === "Arabic",
                })}
              >
                {settngs.settingsState.language === "English"
                  ? "Confirm Password"
                  : "تأكيد كلمة المرور"}
              </p>
              <input
                type="password"
                onBlur={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="p-2 shadow-[0px_0px_5px_0px_#f1f1f1] rounded-[5px] text-[13px] mt-1 mb-2"
              />
            </label>
          </motion.div>
        )}
        <div className="flex gap-1 mt-2">
          {!showPasswordFields ? (
            <button
              ref={submitInput}
              onClick={checkCode}
              className={clsx(
                "flex-1 p-2 rounded-[5px]",
                themes.secondColor.bg,
                themes.mainColor.color,
                "hover:bg-[#f1f1f1b8] duration-200"
              )}
            >
              {settngs.settingsState.language === "English"
                ? "Verify Code"
                : "تأكيد الرمز"}
            </button>
          ) : (
            <button
              ref={submitInput}
              onClick={submitNewPassword}
              className={clsx(
                "flex-1 p-2 rounded-[5px]",
                themes.secondColor.bg,
                themes.mainColor.color,
                "hover:bg-[#f1f1f1b8] duration-200"
              )}
            >
              {settngs.settingsState.language === "English"
                ? "Update Password"
                : "تحديث كلمة المرور"}
            </button>
          )}
          <Link to={"/forgot-password"}>
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
