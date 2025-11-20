# Marble Masterpiece Backend

This is a minimal Express + Mongoose backend providing REST APIs for products, services, orders, and messages.

Environment

- Copy `.env.example` to `.env` and set `MONGODB_URI` and optional `PORT`, `ADMIN_USER`, `ADMIN_PASS`.

Run

Install dependencies:

```bash
cd marble-masterpiece-backend
npm install
npm run dev    # or npm start
```

Endpoints (matching frontend client expectations)

- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

- GET /api/services
- POST /api/services
- PUT /api/services/:id
- DELETE /api/services/:id

- GET /api/orders
- POST /api/orders
- PATCH /api/orders/:id
- DELETE /api/orders/:id

- GET /api/messages
- POST /api/messages
- DELETE /api/messages/:id

- POST /api/auth/login

- POST /api/seed/products  (seed from frontend)
- POST /api/seed/services

Notes

This is intentionally minimal to get the frontend talking to a MongoDB-backed API. It uses basic env-based credentials for admin login. In production you should add proper authentication (JWT), validation, and error handling.
