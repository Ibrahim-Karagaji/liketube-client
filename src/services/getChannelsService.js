export default async function getChannels(limit, search) {
  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/channels/${limit}?search=${search}`,
      { method: "GET" }
    );
    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
