export default async function getUserVideos(channelid, videoid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/videos/${channelid}/${videoid}`,
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
