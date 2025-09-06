import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  merchant: { type: String },
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String, maxlength: 500 }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });

export default mongoose.model("Transaction", transactionSchema);
