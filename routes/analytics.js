import express from "express";
import auth from "../middleware/auth.js";
import { getUserAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/analytics
router.get("/", auth, getUserAnalytics);

export default router;
