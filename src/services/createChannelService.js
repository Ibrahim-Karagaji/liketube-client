export default async function resetPassword(channelInfo) {
  const formData = new FormData();

  formData.append("name", channelInfo.name);
  formData.append("avatar", channelInfo.avatar);
  formData.append("category", channelInfo.category);
  formData.append("description", channelInfo.description);

  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/channel",
      {
        body: formData,
        method: "POST",
        headers: {
          token: `beare ${localStorage.getItem("token")}`,
        },
      }
    );

    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}
