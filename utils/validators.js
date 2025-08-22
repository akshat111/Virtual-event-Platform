exports.isEmail = (email) => /\S+@\S+\.\S+/.test(email);
exports.isStrongPassword = pwd => typeof pwd === 'string' && pwd.length >= 6;
exports.normalizeRole = role =>
  role === 'organizer' ? 'organizer' : 'attendee';
