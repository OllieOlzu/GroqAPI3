import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Groq } from 'groq-js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve index.html from /public

// Initialize Groq client with env variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: 'No message provided' });

  try {
    const response = await groq.chat({ prompt: message });
    // Adjust depending on Groq SDK response structure
    res.json({ reply: response.text || response.answer || 'No response' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Error contacting Groq API' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
