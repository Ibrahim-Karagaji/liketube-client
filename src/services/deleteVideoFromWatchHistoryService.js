export default async function deleteVideoFromWatchHistoryService(videoid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/watch-history/${videoid}`,
      {
        method: "DELETE",
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    console.log(data);

    return data;
  } catch (err) {
    return err;
  }
}
