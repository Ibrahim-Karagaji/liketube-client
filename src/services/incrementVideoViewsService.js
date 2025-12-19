export default async function incrementVideoViews(videoid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/videos/${videoid}/view`,
      {
        method: "PATCH",
        headers: { token: `Beare ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
