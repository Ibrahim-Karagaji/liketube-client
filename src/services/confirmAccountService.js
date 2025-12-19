export default async function confrimAccount(email, code) {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/verify",
      {
        body: JSON.stringify({
          code: code,
          email: email,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
