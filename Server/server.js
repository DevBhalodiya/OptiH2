import dotenv from "dotenv";

// ✅ loads .env from the same directory as server.js
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
console.log("Mongo URI:", process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
})
.catch(err => console.error("❌ MongoDB error:", err));