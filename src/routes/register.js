// src/auth/register.js
import { supabase } from '../config/supabaseClient.js';
import { hashPassword } from '../utils/password.js';
import express from 'express';


const router = express.Router();
router.post('/', register);
export async function register(req, res) {
  const { email, username, phone, password } = req.body || {};

  if (!email || !username || !password) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("users")
      .insert([
        { email, username, phone, password_hash }
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: "User registered", user: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
export default router;