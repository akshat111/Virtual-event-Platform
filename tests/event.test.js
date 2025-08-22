const request = require('supertest');
const app = require('../server');
let orgToken, attToken, eventId;

beforeAll(async () => {
  const org = await request(app).post('/api/auth/register').send({
    name: 'Org',
    email: 'org@example.com',
    password: 'password123',
    role: 'organizer'
  });
  orgToken = org.body.token;

  const att = await request(app).post('/api/auth/register').send({
    name: 'Att',
    email: 'att@example.com',
    password: 'password123'
  });
  attToken = att.body.token;
});

describe('Event API', () => {
  test('Create event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${orgToken}`)
      .send({
        title: 'Event',
        date: '2025-09-01',
        time: '10:00 AM'
      });
    expect(res.statusCode).toBe(201);
    eventId = res.body.event.id;
  });

  test('Public get all events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
  });

  test('Attendee register event', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/registered/);
  });
});
