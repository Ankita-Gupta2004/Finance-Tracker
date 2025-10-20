import express from "express";
import admin from "firebase-admin";
import User from "../models/user.js";

const router = express.Router();

// Sync user from Firebase to MongoDB
router.post("/sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    const extra = req.body?.extra || {}; // ✅ safe check

    // Prevent syncing users who haven't verified their email
    if (!decodedToken.email_verified) {
      return res.status(403).json({ error: "Email not verified. Please verify before syncing." });
    }

    // Upsert user
    const user = await User.findOneAndUpdate(
      { uid: decodedToken.uid },
      {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || "",
        provider: "password",
        metadata: { ...extra, emailVerified: decodedToken.email_verified },
        lastSeen: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log("Saved user:", user);
    res.json(user);
  } catch (err) {
    console.error("Sync route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
