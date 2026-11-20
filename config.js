// Isi dengan Project URL dan publishable/anon key dari Supabase Dashboard.
// Jangan pernah menaruh sb_secret atau service_role key di aplikasi.
export const SUPABASE_URL = 'https://qxllrnpjeazeultxowei.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_LAeQAQY8PB6j1bJiDoi3eg_BZ9vkanJ';

export function isConfigured() {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL) &&
    !SUPABASE_URL.includes('ISI-DENGAN') &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_ANON_KEY.includes('ISI-DENGAN') &&
    !SUPABASE_ANON_KEY.startsWith('sb_secret_');
}
