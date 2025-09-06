import express from "express";
import auth from "../middleware/auth.js";

  //  no { auth }
import { createBudget, getBudgets, deleteBudget } from "../controllers/budgetController.js";

const router = express.Router();

// Apply auth middleware to all budget routes
router.use(auth);

router.get("/", getBudgets);
router.post("/", createBudget);
router.delete("/:id", deleteBudget);

export default router;
