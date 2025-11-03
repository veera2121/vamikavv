import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import Review from "./models/review.js";

const app = express();
const PORT = 3000;

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/furniture_reviews")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.post("/api/reviews", async (req, res) => {
  try {
    console.log("📩 Incoming Review:", req.body);

    if (!req.body.name || !req.body.rating || !req.body.comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const review = new Review(req.body);
    await review.save();

    res.json({ message: "✅ Review added successfully!" });
  } catch (err) {
    console.error("❌ Error saving review:", err);
    res.status(500).json({ error: "Server error while saving review" });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ error: "Failed to load reviews" });
  }
});

// Serve Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
