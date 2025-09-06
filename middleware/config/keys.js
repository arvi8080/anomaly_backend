export default {
  jwtSecret: (process.env.JWT_SECRET || "fallbacksecret").trim(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
