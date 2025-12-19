export default async function getUserChannel() {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/channel",
      {
        method: "GET",
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
