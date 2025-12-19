export default async function register(userinfo) {
  const formdata = new FormData();
  if (userinfo.avatar) {
    formdata.append("avatar", userinfo.avatar);
  }
  formdata.append("email", userinfo.email);
  formdata.append("password", userinfo.password);
  formdata.append("user_name", userinfo.user_name);

  try {
    const response = await fetch("liketube-server.vercel.app/users/register", {
      body: formdata,
      method: "POST",
    });

    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}
