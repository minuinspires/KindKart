const thoughtInput = document.getElementById("thoughtInput");
const voiceBtn = document.getElementById("voiceBtn");
const canvas = document.getElementById("thoughtCanvas");
const ctx = canvas.getContext("2d");

const sentiment = ml5.sentiment('movieReviews', modelReady);

function modelReady() {
  console.log("Sentiment model loaded");
}

voiceBtn.onclick = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    thoughtInput.value = transcript;
  };
  recognition.start();
};

document.getElementById("analyzeBtn").onclick = () => {
  const text = thoughtInput.value;
  const prediction = sentiment.predict(text);
  const score = prediction.score;

  let emotion = score > 0.75 ? "Hopeful" : score < 0.4 ? "Heavy" : "Mixed";
  document.getElementById("emotionResult").innerText = `🧠 Emotion: ${emotion} (${(score * 100).toFixed(1)}%)`;

  detectBias(text);
  generatePoeticResponse(emotion);
  generateArtFromText(text);
  drawEmpathyChart();
};

function detectBias(text) {
  const biasKeywords = ["always", "never", "everyone", "no one", "should", "must"];
  const found = biasKeywords.filter(word => text.toLowerCase().includes(word));
  const biasResult = found.length > 0
    ? `⚠️ Possible cognitive bias detected: ${found.join(", ")}`
    : `✅ No strong bias detected`;
  document.getElementById("poeticResponse").innerText = biasResult;
}

function generatePoeticResponse(emotion) {
  let line = "";
  if (emotion === "Hopeful") line = "Even in shadows, your light reaches far.";
  else if (emotion === "Heavy") line = "Your pain is valid. The world listens.";
  else line = "You’re in between storms and sunshine—and that’s okay.";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = emotion === "Hopeful" ? "#4caf50" : emotion === "Heavy" ? "#f44336" : "#ff9800";
  ctx.font = "20px Quicksand";
  ctx.fillText(line, 20, 200);
}

function generateArtFromText(text) {
  fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: {
      "Api-Key": "2959c36a-0757-4f1e-af60-bae1696df91f",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  })
  .then(response => response.json())
  .then(data => {
    const img = new Image();
    img.src = data.output_url;
    img.width = 400;
    document.body.appendChild(img);
  })
  .catch(err => console.error("Art generation failed:", err));
}

function drawEmpathyChart() {
  const emotionData = {
    Hope