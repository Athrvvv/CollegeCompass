const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function list() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GEMINI_API_KEY}`);
    const data = await response.json();
    fs.writeFileSync('tmp/models_output.json', JSON.stringify(data, null, 2));
    console.log('Models saved to tmp/models_output.json');
  } catch (err) {
    console.error(err);
  }
}

list();
