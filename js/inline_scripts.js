
async function generateVideo() {
  const prompt = document.getElementById("prompt").value.trim();
  const resultDiv = document.getElementById("result");
  if (!prompt) return alert("Please enter a prompt!");

  resultDiv.innerHTML = "⏳ Generating video, please wait...";

  const proxies = [
    "https://api.codetabs.com/v1/proxy/?quest=",
    "https://api.allorigins.win/raw?url="
  ];

  const apiURL = `https://yabes-api.pages.dev/api/ai/video/v1?prompt=${encodeURIComponent(prompt)}`;

  for (let proxy of proxies) {
    try {
      const response = await fetch(proxy + apiURL);
      const text = await response.text();

      // Try parsing JSON if possible
      let data;
      try { data = JSON.parse(text); } catch { data = null; }

      // Case 1: JSON with video
      if (data && data.video) {
        resultDiv.innerHTML = `<video controls width="100%" src="${data.video}"></video>`;
        return;
      }

      // Case 2: Direct video link
      if (text.includes("http") && text.includes(".mp4")) {
        const videoURL = text.match(/https?:\/\/[^\s"]+\.mp4/)[0];
        resultDiv.innerHTML = `<video controls width="100%" src="${videoURL}"></video>`;
        return;
      }

    } catch (err) {
      console.log(`Proxy failed: ${proxy}`, err);
    }
  }

  resultDiv.innerHTML = `⚠️ Fetching error. Please reload and try again.`;
}
