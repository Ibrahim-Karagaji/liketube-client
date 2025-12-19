export default async function uploadVideo(video, channelid) {
  const formData = new FormData();

  formData.append("title", video.title);
  formData.append("description", video.description);
  formData.append("video_url", video.videoUrl);
  formData.append("thumbnail", video.thumbnail);

  try {
    const response = await fetch(
      `liketube-server.vercel.app/users/videos/${channelid}`,
      {
        method: "POST",
        body: formData,
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
