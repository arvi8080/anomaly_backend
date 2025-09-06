import Transaction from "../models/Transaction.js";
import anomalyService from "../services/anomalyDetection.js";
import financialAnalytics from "../services/financialAnalytics.js";

// Add Transaction
export const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type,
      category,
      description,
      date,
    });

    // Check anomaly
    const anomaly = await anomalyService.flagIfAnomalous(transaction);
    if (anomaly.anomalous) {
      console.log(`Transaction flagged as anomalous: ${JSON.stringify(anomaly.reasons)}`);
    }

    res.status(201).json({ transaction, anomaly });
  } catch (err) {
    next(err);
  }
};

// Get Transactions
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};
