
import { createClient } from '@supabase/supabase-js'

// TEMPORARY FALLBACK: Forced hardcoded credentials to bypass Vercel cache
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ...
const supabaseUrl = 'https://ormalukbpkjzvhegfotq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybWFsdWticGtqenZoZWdmb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTk4NDYsImV4cCI6MjA4MzA5NTg0Nn0.bqC3G28bbOUmR7WC5K_WN9kv1_yK4N5BsAOke1-8saQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
