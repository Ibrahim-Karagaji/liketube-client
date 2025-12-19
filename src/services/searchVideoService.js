export default async function searchVideo(videosCount, search) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/videos-search/${videosCount}?search=${search}`,
      { method: "GET" }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
