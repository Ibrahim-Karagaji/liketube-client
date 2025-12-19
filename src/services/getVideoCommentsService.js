export default async function getvideoComments(videoid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/comments/${videoid}`,
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
