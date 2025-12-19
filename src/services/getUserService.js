export default async function getUser() {
  try {
    const response = await fetch("https://liketube-server.vercel.app/users", {
      method: "GET",
      headers: {
        token: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
