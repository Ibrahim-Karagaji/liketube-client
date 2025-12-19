export default async function unsubscribeToChannel(channelid) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/subscrips/${channelid}`,
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
