import clsx from "clsx";
import { useEffect, useRef } from "react";

export default function ShowMessage({ value }) {
  const messageElement = useRef(null);

  useEffect(() => {
    if (!messageElement.current) return;

    messageElement.current.style.left = "10px";

    setTimeout(() => {
      if (messageElement.current) messageElement.current.style.left = "-900px";
    }, 3500);

    if (value.message.status !== null) {
      const timer = setTimeout(() => {
        value.setMessage((prev) => ({ ...prev, status: null }));
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [value.message.status]);

  if (value.message.status === null) return null;

  return (
    <div
      ref={messageElement}
      className={clsx(
        "absolute bottom-10 text-[12px] -left-900 duration-200 p-3 rounded-[5px] text-[#eee] z-20",
        { "bg-green-600": value.message.status === true },
        { "bg-red-600": value.message.status === false }
      )}
    >
      {value.message.message}
    </div>
  );
}
