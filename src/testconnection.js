import { supabase } from './config/supabaseClient.js';

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('Supabase connected! Sample data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

testConnection();
