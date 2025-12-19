export default async function sendFeedbackService(feedback) {
  try {
    const response = await fetch(
      "https://liketube-server.vercel.app/users/feedback",
      {
        method: "POST",
        body: JSON.stringify(feedback),
        headers: {
          "Content-Type": "application/json",
          token: `Beare ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    return err;
  }
}
