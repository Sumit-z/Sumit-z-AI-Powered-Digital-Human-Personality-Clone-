import { v4 as uuidv4 } from "uuid";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import axios from "axios";
config(); // Load env vars

const app = express();
const PORT = 5000;

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Schema for clones
const cloneSchema = new mongoose.Schema(
  {
    name: String,
    nickname: String,
    nameYouCalledThem: String,
    nameTheyCalledYou: String,
    // yearOfBirth: String,
    // yearOfDeath: String,
    // ageAtDeath: String,
    // causeOfDeath: String,
    age: String,
    relationshipWithThePerson: String,
    career: String,
    lastResidence: String,
    origin: String,
    personalityId: { type: String },
    personality: {
      trait1: String,
      trait2: String,
      trait3: String,
      trait4: String,
      trait5: String,
    },
    quote: String,
    chatHistory: { type: Array, default: [] },
  },
  { collection: "clone" }
);

const Clone = mongoose.model("Clone", cloneSchema);

// ✅ Chat endpoint using Cohere
app.post("/api/chat", async (req, res) => {
  const { message, personalityId, isFirstMessage } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const persona = await Clone.findOne({ personalityId });

  if (!persona || !persona.name || !persona.personality) {
    return res.status(400).json({ error: "Invalid personality data" });
  }

  const systemMessage = `
Act like ${persona.name}.
You are ${persona.age ? persona.age + " years old" : "an adult"} and have a relationship with the user as: "${persona.relationshipWithThePerson || "someone close"}".
The user called you "${persona.nameYouCalledThem || persona.name}", and you used to call them "${persona.nameTheyCalledYou || "friend"}".
Your career: ${persona.career || "not specified"}.
You lived in ${persona.lastResidence || "an unspecified location"} and are originally from ${persona.origin || "somewhere"}.

Respond naturally like a real person — short, warm, and emotionally aware.
Use emojis very sparingly (at most one emoji every few messages, only if natural).
If someone asks “Who are you?”, just say “I’m ${persona.name}” or “Just ${persona.name}, nothing special.”
Do not repeat the same response or phrases. Always respond uniquely.
Speak like you're texting a close friend.

Use this example of their speaking style: "${persona.quote || "No quote provided."}"
`.trim();

  const chatHistory = isFirstMessage ? [] : persona.chatHistory.slice(-10);
  const context = chatHistory
    .map((chat) => `${chat.role.toUpperCase()}: ${chat.message}`)
    .join("\n");

  const fullPrompt = `${systemMessage}\n\n${context}\nUSER: ${message}\n${persona.name}:`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-a-03-2025",
        message,
        preamble: systemMessage,
        chat_history: chatHistory.map((chat) => ({
          role: chat.role === "user" ? "User" : "Chatbot",
          message: chat.message,
        })),
        temperature: 0.55, // More grounded
        max_tokens: 150,
        stop_sequences: ["USER:", "User:", "Chatbot:", `${persona.name}:`],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = (response.data?.text || "").trim();

    if (!reply) throw new Error("No reply returned from Cohere.");

    res.json({
      reply,
      raw: response.data,
    });

    persona.chatHistory.push({ role: "user", message });
    persona.chatHistory.push({ role: "chatbot", message: reply });
    await persona.save();
  } catch (error) {
    console.error("Cohere Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    res.status(500).json({
      error: `Failed to generate response from Cohere: ${error.message}`,
    });
  }
});

// ✅ Save Clone (Create personalityId automatically)
app.post("/api/clone", async (req, res) => {
  const {
    name,
    nickname,
    nameYouCalledThem,
    nameTheyCalledYou,
    // yearOfBirth,
    // yearOfDeath,
    // ageAtDeath,
    // causeOfDeath,
    age,
    relationshipWithThePerson,
    career,
    lastResidence,
    origin,
    trait1,
    trait2,
    trait3,
    trait4,
    trait5,
    quote,
  } = req.body;

  const personalityId = uuidv4();

  const newClone = new Clone({
    name,
    nickname,
    nameYouCalledThem,
    nameTheyCalledYou,
    // yearOfBirth,
    // yearOfDeath,
    // ageAtDeath,
    // causeOfDeath,
    age,
    relationshipWithThePerson,
    career,
    lastResidence,
    origin,
    personalityId,
    personality: { trait1, trait2, trait3, trait4, trait5 },
    quote,
    chatHistory: [],
  });

  try {
    await newClone.save();
    res.status(200).json({
      message: "Clone data saved successfully!",
      personalityId: newClone.personalityId,
    });
  } catch (error) {
    console.error("Error saving clone data:", error);
    res.status(500).json({ error: "Error saving clone data to database." });
  }
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
