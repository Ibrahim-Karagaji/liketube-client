export default async function updateSettings(settingsOptions) {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/settings",
      {
        method: "PATCH",
        body: JSON.stringify(settingsOptions),
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
