const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET || 'airtribe123';

exports.authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing bearer token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    if (!users.find(u => u.id === payload.id))
      return res.status(401).json({ error: "User no longer exists" });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
