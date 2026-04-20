import { createClient } from "@supabase/supabase-js";

// Usamos las variables de entorno estrictas de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Revisa tu archivo .env.local",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
