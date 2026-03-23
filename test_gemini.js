const https = require("https");
require("dotenv").config({ path: ".env.local" });

function testRaw(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, data }));
    }).on("error", (err) => resolve({ error: err.message }));
  });
}

async function runTest() {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  console.log("Testing Key:", key.substring(0, 5) + "...");
  
  const v1betaUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const v1Url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;

  console.log("Checking v1beta models...");
  const res1 = await testRaw(v1betaUrl);
  console.log("Status (v1beta):", res1.status);
  if (res1.data) {
    const list = JSON.parse(res1.data);
    console.log("Full Model List:", list.models.map(m => m.name).join(", "));
  } else {
    console.log("Data (v1beta): N/A");
  }

  console.log("--- TEST END ---");
}

runTest();
