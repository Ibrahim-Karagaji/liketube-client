export default async function addToPlayListService(videoid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/play-list/${videoid}`,
      {
        method: "POST",
        headers: { token: `Beare ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
