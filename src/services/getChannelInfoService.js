export default async function getChannelinfo(channelid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/channel/${channelid}`,
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
