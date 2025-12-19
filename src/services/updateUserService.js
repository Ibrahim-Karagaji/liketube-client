export default async function updateUser(userinfo) {
  const formData = new FormData();

  if (userinfo.userName) formData.append("user_name", userinfo.userName);
  if (userinfo.avatar) formData.append("avatar", userinfo.avatar);

  try {
    const response = await fetch("https://liketube-server.vercel.app/users", {
      method: "PATCH",
      body: formData,
      headers: { token: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
