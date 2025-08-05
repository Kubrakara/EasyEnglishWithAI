import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("SUPABASE_URL env değişkeni bulunamadı");
if (!supabaseKey)
  throw new Error("SUPABASE_SERVICE_ROLE_KEY env değişkeni bulunamadı");

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
