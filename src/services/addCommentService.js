export default async function addComment(comment, videoid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/comments/${videoid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ comment }),
      }
    );

    return await response.json();
  } catch (err) {
    return err;
  }
}
