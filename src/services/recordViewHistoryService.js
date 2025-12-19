export default async function recordViewHistoryService(videoid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/watch-history/${videoid}`,
      {
        method: "POST",
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
