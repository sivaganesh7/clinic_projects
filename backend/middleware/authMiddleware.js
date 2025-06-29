const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request object
    req.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    console.error("❌ JWT verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
