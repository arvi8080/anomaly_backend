import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;
