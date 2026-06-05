import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn("Supabase credentials are not configured yet. Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.");
}

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl! : 'https://placeholder-project.supabase.co';
const finalKey = supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(finalUrl, finalKey);

