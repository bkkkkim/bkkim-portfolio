// Supabase Configuration
// 이 곳에서 API Key와 URL을 수정할 수 있습니다.

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://ylmrpzwbabedarhaxygj.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_doGZ1MMqEe2i2VCt49p3Bw_t1VXAOO5'
};

export const API_BASE_URL = '/api';
