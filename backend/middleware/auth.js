const jwt = require("jsonwebtoken");

const auth = (allowedRoles = []) => (req, res, next) => {
  // Extract token from Authorization header
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  } else if (token.startsWith("Token ")) {
    token = token.split(" ")[1]; 
  } else {
    token = token;
  }

  if (!token) {
    return res.status(401).json({ message: "Invalid token format, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role permissions" });
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth;