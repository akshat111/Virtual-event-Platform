const { v4: uuid } = require("uuid");
const events = require("../models/eventModel");
const users = require("../models/userModel");
const { sendEmail } = require("../utils/emailService");

exports.createEvent = (req, res) => {
  const { title, description, date, time } = req.body;
  if (!title || !date || !time)
    return res.status(400).json({ error: "title, date and time are required" });

  const event = {
    id: uuid(),
    title,
    description: description || "",
    date,
    time,
    createdBy: req.user.id,
    participants: [],
  };
  events.push(event);
  return res.status(201).json({ message: "Event created", event });
};

exports.getEvents = (req, res) => res.json(events);

exports.getEventById = (req, res) => {
  const e = events.find(e => e.id === req.params.id);
  if (!e) return res.status(404).json({ error: "Event not found" });
  return res.json(e);
};

exports.updateEvent = (req, res) => {
  const e = events.find(e => e.id === req.params.id);
  if (!e) return res.status(404).json({ error: "Event not found" });

  if (e.createdBy !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ error: "Not allowed to update this event" });

  const { title, description, date, time } = req.body;
  if (title !== undefined) e.title = title;
  if (description !== undefined) e.description = description;
  if (date !== undefined) e.date = date;
  if (time !== undefined) e.time = time;

  return res.json({ message: "Event updated", event: e });
};

exports.deleteEvent = (req, res) => {
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Event not found" });

  const ev = events[idx];
  if (ev.createdBy !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ error: "Not allowed to delete this event" });

  events.splice(idx, 1);
  return res.json({ message: "Event deleted successfully" });
};

exports.registerForEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const ev = events.find(e => e.id === eventId);
  if (!ev) return res.status(404).json({ message: "Event not found" });

  if (ev.createdBy === userId)
    return res.status(400).json({ message: "Organizer cannot register for own event" });

  if (ev.participants.includes(userId))
    return res.status(400).json({ message: "User already registered for this event" });

  ev.participants.push(userId);

  const user = users.find(u => u.id === userId);
  if (user) {
    await sendEmail(user.email, "Event Registration Successful", `Hi ${user.name}, you're registered for: ${ev.title}`);
  }

  return res.status(200).json({ message: "Successfully registered for event", event: ev });
};
