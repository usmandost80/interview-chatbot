import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const RESPONSES_FILE = path.join(process.cwd(), "responses.json");

const validationPhrases = [
  "Thank you for sharing that.",
  "I appreciate you opening up.",
  "That sounds really meaningful.",
  "I understand, thank you.",
  "That makes sense.",
  "Thanks for telling me.",
  "I’m here with you.",
  "I hear you loud and clear.",
  "That must have been important for you.",
];

// Helper: Save response to JSON file
function saveResponse(data) {
  let existingData = [];
  if (fs.existsSync(RESPONSES_FILE)) {
    const raw = fs.readFileSync(RESPONSES_FILE, "utf8");
    existingData = raw ? JSON.parse(raw) : [];
  }
  existingData.push(data);
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify(existingData, null, 2));
}

app.post("/submit-answer", (req, res) => {
  const { question, answer, participantId, timestamp } = req.body;

  if (!question || !answer || !participantId) {
    return res.status(400).json({ error: "Missing data in request body" });
  }

  const entry = {
    participantId,
    question,
    answer,
    timestamp: timestamp || new Date().toISOString(),
  };

  try {
    saveResponse(entry);
    // Send back a random validation phrase
    const randomValidation = validationPhrases[Math.floor(Math.random() * validationPhrases.length)];
    res.json({ validation: randomValidation });
  } catch (err) {
    console.error("Error saving response:", err);
    res.status(500).json({ error: "Failed to save response" });
  }
});

// Serve frontend static files (optional if hosting separately)
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
