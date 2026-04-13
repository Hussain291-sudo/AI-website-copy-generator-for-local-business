const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const { businessName, industry, tone } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This is the core "Prompt Engineering" part of your task
    const prompt = `
      Act as a professional conversion copywriter. 
      Generate website copy for a ${industry} named "${businessName}". 
      The tone should be ${tone}.
      
      Format the response strictly as JSON:
      {
        "headline": "Main catchy headline",
        "subheadline": "Persuasive sub-headline",
        "services": ["Service 1 description", "Service 2 description"],
        "cta": "Strong call to action text"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean JSON formatting from AI response if necessary
    const jsonString = text.replace(/```json|```/g, "");
    res.json(JSON.parse(jsonString));
    
  } catch (error) {
    res.status(500).json({ error: "Generation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));