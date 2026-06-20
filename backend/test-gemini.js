require('dotenv').config();

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Find a model that supports generateContent
    const models = data.models.filter(m => 
      m.supportedGenerationMethods && 
      m.supportedGenerationMethods.includes('generateContent') &&
      m.name.includes('gemini')
    );
    
    console.log("Available generateContent models:");
    models.forEach(m => console.log(m.name));
  } catch (err) {
    console.log("Error:", err);
  }
}

run();
