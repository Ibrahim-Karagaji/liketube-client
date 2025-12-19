export default async function getSocialMediaInfo(channelid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/social-media/${channelid}`,
      {
        method: "GET",
        headers: { token: `Beare ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
