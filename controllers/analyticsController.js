import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import financialAnalytics from "../services/financialAnalytics.js";

export const getUserAnalytics = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    const budgets = await Budget.find({ user: req.user._id });

    const summary = financialAnalytics.calculateSummary(transactions, budgets);

    res.json(summary);
  } catch (err) {
    next(err);
  }
};
