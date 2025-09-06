// server/controllers/budgetController.js
import Budget from "../models/Budget.js";
import anomalyService from "../services/anomalyDetection.js";

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    const { amount, category, startDate, endDate } = req.body;

    // Optional anomaly check: very high budget
    let anomalyResult = { anomalous: false };
    if (amount > 1000000) {
      anomalyResult = { anomalous: true, reasons: ["High budget amount"] };
    }

    const budget = new Budget({
      user: req.user._id,
      amount,
      category,
      startDate,
      endDate,
    });

    await budget.save();

    res.status(201).json({ budget, anomaly: anomalyResult });
  } catch (err) {
    console.error("createBudget error:", err.message);
    res.status(500).json({ error: "Server error while creating budget" });
  }
};

// Get all budgets for logged-in user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ startDate: -1 });

    res.status(200).json({ budgets });
  } catch (err) {
    console.error("getBudgets error:", err.message);
    res.status(500).json({ error: "Server error while fetching budgets" });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted", budget });
  } catch (err) {
    console.error("deleteBudget error:", err.message);
    res.status(500).json({ error: "Server error while deleting budget" });
  }
};
