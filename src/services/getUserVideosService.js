export default async function getUserVideos(sortOrder) {
  try {
    const query = `?type=${sortOrder.type}&order=${sortOrder.order}`;
    const response = await fetch(
      `https://liketube-server.vercel.app/users/videos${query}`,
      {
        method: "GET",
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    return { ok: false, message: err.message ?? "Error fetching videos" };
  }
}
