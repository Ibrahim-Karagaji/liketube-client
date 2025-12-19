export default async function forgotPassword(email) {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/forgot-password",
      {
        body: JSON.stringify({
          email: email,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    console.log(data);

    return data;
  } catch (err) {
    return err;
  }
}
