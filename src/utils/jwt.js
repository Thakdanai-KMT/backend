// src/utils/jwt.js
import jwt from 'jsonwebtoken';

export function createAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

export function createRefreshToken() {
  return jwt.sign(
    { rnd: Math.random() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // 7 วัน
  );
}
