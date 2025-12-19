export default async function getWatchHistroyVideos() {
  try {
    const response = await fetch(
      "liketube-server.vercel.app/users/watch-history",
      {
        method: "GET",
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
