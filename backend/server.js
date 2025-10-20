import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import userRoutes from "./routes/Users.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  ),
});

// ✅ Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected to financeTracker");
} catch (err) {
  console.error("MongoDB connection error:", err);
}

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/users", userRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
