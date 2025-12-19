export default async function getVideos(videosCount, catagory) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/videos/${videosCount}/${catagory}`,
      { method: "GET" }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
