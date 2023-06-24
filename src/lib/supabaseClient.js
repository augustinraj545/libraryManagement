import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://shxoixmxwbanixjvndaq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeG9peG14d2Jhbml4anZuZGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MTY2NDcsImV4cCI6MjAwMzE5MjY0N30.7qmIhJ3_6fyeuGNqXn67MJh6jW-4qZBaTs8cLGpuBSA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)