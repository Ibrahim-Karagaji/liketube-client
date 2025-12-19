export default async function addSocialMediaInfo(channelId, socialMedia) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/social-media/${channelId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(socialMedia),
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}
