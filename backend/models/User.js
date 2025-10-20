import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  displayName: String,
  provider: String,
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  metadata: Object, // optional extra info
});

export default mongoose.model("User", userSchema);
