import dotenv from "dotenv";
dotenv.config(); // ไม่ต้องใส่ path

import express from "express";
// import routes / config ต่อจากนี้
import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);