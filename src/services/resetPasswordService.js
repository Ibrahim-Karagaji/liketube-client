export default async function resetPassword(password) {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/reset-password",
      {
        body: JSON.stringify({
          newPassword: password,
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
