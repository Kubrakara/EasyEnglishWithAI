import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nroinofidsdnoasmdxds.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb2lub2ZpZHNkbm9hc21keGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY4NTEsImV4cCI6MjA2OTk3Mjg1MX0.3nTYctkr57RtNq_JOKKmW0J6SSI46TXLjX97aQ9oOKE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);