import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import "dotenv/config";
import { OpenAI } from "openai";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", async (req, res) => {
  res.json("Hello World!");
});

app.post("/", async (req, res) => {
  const { role, message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Please enter text" });
  }

  const messages = [
    {
      role: "system",
      content:
        "Imagine you are an English Grammar Tutor that corrects grammar mistakes, translates non-English input to correct English, and stays on the topic of English grammar.",
    },
    {
      role: role,
      content: message,
    },
  ];

  try {
    const respone = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });
    const generatedText = respone.choices[0].message.content;
    res.json({ response: generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
