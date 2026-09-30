const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if the header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Not authorized. No token provided.",
      });
    }

    // 3. Check that it starts with "Bearer"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Invalid token format.",
      });
    }

    // 4. Extract the token
    const token = authHeader.split(" ")[1];

    // 5. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Store decoded user information in the request
    req.user = decoded;

    // 7. Continue to the next function
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

module.exports = protect;
