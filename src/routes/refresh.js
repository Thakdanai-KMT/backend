// src/auth/refresh.js
import { supabase } from "../config/supabaseClient.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../utils/jwt.js";
import express from 'express';


const router = express.Router();
router.post('/', refresh);
export async function refresh(req, res) {
  const { refresh_token } = req.body || {};

  if (!refresh_token) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  try {
    // ตรวจสอบว่า refresh token ถูกสร้างโดยระบบหรือไม่
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // หา Token Hash ในฐานข้อมูล
    const { data: rows } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("revoked", false);

    if (!rows.length) return res.status(401).json({ error: "Token not found" });

    // หาอันที่ match
    let matchedToken = null;
    for (let rt of rows) {
      const ok = await argon2.verify(rt.token_hash, refresh_token);
      if (ok) {
        matchedToken = rt;
        break;
      }
    }

    if (!matchedToken) return res.status(401).json({ error: "Invalid token" });

    // หา User
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", matchedToken.user_id)
      .single();

    const newAccess = createAccessToken(user);

    return res.json({ access_token: newAccess });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
export default router;