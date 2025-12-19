export default async function deleteChannel(channelid) {
  try {
    const response = await fetch("liketube-server.vercel.app/users/channel", {
      method: "DELETE",
      headers: { token: `Beare ${localStorage.getItem("token")}` },
    });

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
