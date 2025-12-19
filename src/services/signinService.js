export default async function signin(email, password) {
  try {
    const response = await fetch("liketube-server.vercel.app/users/login", {
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
