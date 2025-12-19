export default async function addlikeToVideo(videoid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/videos/${videoid}/add-like`,
      {
        method: "PATCH",
        headers: { token: `Beare ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    console.log(data);
    return data;
  } catch (err) {
    return err;
  }
}
