export default async function addComment(videoid, commentid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/comments/${videoid}/${commentid}`,
      {
        method: "DELETE",
        headers: { token: `Beare ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
