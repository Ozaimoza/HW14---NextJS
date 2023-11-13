import jwt from "jsonwebtoken";

export default function authenticateTokenMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ massage: "Unauthorizen" }); // Unauthorized
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = user.userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ massage: "Forbiden" }); // Forbidden
  }
}
