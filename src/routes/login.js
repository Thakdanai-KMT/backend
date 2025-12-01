import express from 'express';
import { supabase } from '../config/supabaseClient.js';
import { verifyPassword } from '../utils/password.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import argon2 from 'argon2';

const router = express.Router();

export async function login(req, res) {
  const { loginId, password } = req.body || {};

  if (!loginId || !password) {
    return res.status(400).json({ error: "Missing loginId or password" });
  }

  try {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${loginId},username.eq.${loginId},phone.eq.${loginId}`)
      .single();

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const ok = await verifyPassword(user.password_hash, password);
    if (!ok) return res.status(400).json({ error: "Invalid password" });

    // Update last login time
    await supabase.from('users')
      .update({ last_login_at: new Date() })
      .eq('id', user.id);

    // Token
    const access = createAccessToken(user);
    const refresh = createRefreshToken();

    const refresh_hash = await argon2.hash(refresh);

    await supabase.from("refresh_tokens").insert([
      {
        user_id: user.id,
        token_hash: refresh_hash,
        user_agent: req.headers['user-agent'] || '',
        ip_address: req.ip || '',
        expires_at: new Date(Date.now() + 7 * 24 * 3600000) // 7d
      }
    ]);

    return res.json({
      message: "Logged in",
      access_token: access,
      refresh_token: refresh
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

router.post('/', login);
export default router;
