export default async function updateChannel(channelInfo) {
  const formdata = new FormData();

  if (channelInfo.name) formdata.append("name", channelInfo.name);
  if (channelInfo.category) formdata.append("category", channelInfo.category);
  if (channelInfo.description)
    formdata.append("description", channelInfo.description);
  if (channelInfo.avatar) formdata.append("avatar", channelInfo.avatar);

  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/channel",
      {
        body: formdata,
        method: "PATCH",
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
