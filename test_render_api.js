const https = require("https");

async function testRenderApi() {
  const url = "https://ai-advisor-api-pbs5.onrender.com/api/v1/chat";
  const payload = JSON.stringify({
    message: "Hi, I need career advice.",
    history: [],
    user_context: {
      name: "Test User",
      rank: "15400",
      category: "OBC-NCL"
    }
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  };

  console.log("Testing Render API:", url);
  const req = https.request(url, options, (res) => {
    let data = "";
    res.on("data", (chunk) => data += chunk);
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Data:", data);
    });
  });

  req.on("error", (e) => console.error("Error:", e.message));
  req.write(payload);
  req.end();
}

testRenderApi();
