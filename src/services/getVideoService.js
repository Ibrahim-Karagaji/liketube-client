export default async function getVideoService(videoid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/videosid/${videoid}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
