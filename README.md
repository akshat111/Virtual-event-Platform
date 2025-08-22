📌 Virtual Event Management Backend

A minimal backend API for managing users and virtual events.

Built with Node.js, Express, and JWT authentication.

---
🚀 Features

🔑 User Registration & Login with JWT Authentication

👤 Manage User Preferences

📅 CRUD operations for Events (Create, Read, Update, Delete)

🔒 Protected routes using middleware

🧪 Basic test cases with Jest

---
🛠 Tech Stack

Node.js – Server-side JavaScript runtime

Express.js – Web framework

JWT (jsonwebtoken) – Authentication

UUID – Unique IDs for users and events

Jest – Testing framework

---

virtual-event-backend/
│── controllers/
│   ├── authController.js
│   └── eventController.js
│
│── middlewares/
│   └── auth.js
│
│── routes/
│   ├── authRoutes.js
│   └── eventRoutes.js
│
│── tests/
│   ├── auth.test.js
│   └── event.test.js
│
│── server.js
│── package.json
│── .gitignore
│── README.md

---

⚙️ Setup & Installation

Clone the repository

git clone <your-repo-url>
cd virtual-event-backend

---

Install dependencies

npm install

---

Create a .env file in the root and add:

PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h

---
Start the server

npm run dev

Server runs on 👉 http://localhost:3000

---
📌 API Endpoints
Auth Routes

POST /api/auth/register → Register new user

POST /api/auth/login → Login & get token

GET /api/auth/preferences → Get user preferences (Protected)

PUT /api/auth/preferences → Update user preferences (Protected)
---

---
Event Routes

POST /api/events → Create event (Protected)

GET /api/events → Get all events (Protected)

GET /api/events/:id → Get single event by ID (Protected)

PUT /api/events/:id → Update event (Protected)

DELETE /api/events/:id → Delete event (Protected)

---

🧪 Running Tests

Run all tests with:

npm test
