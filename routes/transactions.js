import express from "express";
import auth from "../middleware/auth.js";



import { createTransaction, getTransactions, deleteTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.use(auth);

router.get("/", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
