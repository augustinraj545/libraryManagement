import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://txaehzfbcistlwifwwaa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YWVoemZiY2lzdGx3aWZ3d2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkwODczOTMsImV4cCI6MjAwNDY2MzM5M30.rEHUKz8lTUPN-XS0cGvXe8bV6IOPTcMRSHIxkPOhSvs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)