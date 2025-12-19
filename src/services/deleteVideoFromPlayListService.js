export default async function deleteVideoFromPlayList(videoid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/play-list/${videoid}`,
      {
        method: "DELETE",
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
