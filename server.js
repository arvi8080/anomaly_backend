import express from "express";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import profileRoutes from "./routes/profile.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transactions.js";
import budgetRoutes from "./routes/budgets.js";
import analyticsRoutes from "./routes/analytics.js";

// ...



import { errorHandler } from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";



const PORT = process.env.PORT || 5002;
const app = express();

// connect DB
connectDB();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use(rateLimiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analytics", analyticsRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

// error handler (last)
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} (${process.env.NODE_ENV})`);
});
