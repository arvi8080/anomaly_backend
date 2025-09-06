import express from "express";
import auth from "../middleware/auth.js";   //  no curly braces

const router = express.Router();

// GET /api/user/profile
router.get("/profile", auth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;
