const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER || 'marbleadmin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'Admin@1234';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // For simplicity return a small payload; in production return JWT
    return res.json({ ok: true, user: { username } });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
