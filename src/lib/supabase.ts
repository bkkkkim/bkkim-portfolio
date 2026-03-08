/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config';

if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.log('Using hardcoded Supabase credentials for preview.');
}

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);
