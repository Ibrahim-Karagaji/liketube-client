export default async function subscribedChannels() {
  try {
    const response = await fetch("liketube-server.vercel.app/users/subscrips", {
      method: "GET",
      headers: { token: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
