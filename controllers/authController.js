const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const users = require('../models/userModel');
const { isEmail, isStrongPassword, normalizeRole } = require('../utils/validators');

const JWT_SECRET = process.env.JWT_SECRET || 'airtribe123';
const JWT_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN || '1h';

const toPublic = ({ id, name, email, role }) => ({ id, name, email, role });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password are required" });
    if (!isEmail(email)) return res.status(400).json({ error: "Invalid email" });
    if (!isStrongPassword(password))
      return res.status(400).json({ error: "Password must be at least 6 characters long" });

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return res.status(409).json({ error: "User already exists with this email" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(),
      name: String(name),
      email: String(email).toLowerCase(),
      passwordHash,
      role: normalizeRole(role),
    };
    users.push(user);

    const token = jwt.sign(toPublic(user), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.status(201).json({ message: 'Registered successfully', user: toPublic(user), token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    if (!(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(toPublic(user), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ message: 'Logged in', user: toPublic(user), token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(toPublic(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
};
