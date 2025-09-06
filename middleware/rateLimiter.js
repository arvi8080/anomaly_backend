import rateLimit from "express-rate-limit";

const window = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);

const limiter = rateLimit({
  windowMs: window,
  max: max,
  message: { error: "Too many requests, please try again later." }
});

export default limiter;
