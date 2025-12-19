export default async function verifyResetCode(code) {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/verify-reset-code",
      {
        body: JSON.stringify({
          code: code,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          resetPassword: `Bearer ${localStorage.getItem("resetpassword")}`,
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
