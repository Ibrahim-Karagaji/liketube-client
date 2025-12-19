export default async function subscribeToChannel(channelid) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/subscrips/${channelid}`,
      {
        method: "POST",
        headers: { token: `Beare ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
