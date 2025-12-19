export default async function getChannelVideos(channelid, limilt) {
  try {
    const response = await fetch(
      `https://liketube-server.vercel.app/users/videos/channel/${channelid}/${limilt}`,
      { method: "GET" }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
