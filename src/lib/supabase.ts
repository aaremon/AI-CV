import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase environment variables from Vite meta env
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  // Check for common placeholders and invalid string representations
  const invalidValues = [
    "undefined",
    "null",
    "your-supabase-project",
    "your-supabase-url",
    "your-anon-public-key",
    "placeholder"
  ];
  
  const isUrlInvalid = invalidValues.some(val => supabaseUrl.toLowerCase().includes(val)) ||
                       (!supabaseUrl.startsWith("http://") && !supabaseUrl.startsWith("https://"));
                       
  const isKeyInvalid = invalidValues.some(val => supabaseAnonKey.toLowerCase().includes(val));

  return !isUrlInvalid && !isKeyInvalid;
};

// Helper to safely initialize Supabase client without crashing the app on invalid configuration
const initializeSupabase = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error("Failed to initialize Supabase client due to an invalid configuration:", err);
    return null;
  }
};

export const supabase = initializeSupabase();

/**
 * ============================================================================
 * SUPABASE SQL SCHEMA SETUP & ROW-LEVEL SECURITY (RLS) POLICIES GUIDELINE
 * ============================================================================
 * 
 * If you are setting up Supabase, run the following SQL commands in your 
 * Supabase SQL Editor (Dashboard > SQL Editor) to create the PostgreSQL tables,
 * set up the Storage Bucket, and apply Row-Level Security (RLS) policies.
 * 
 * ----------------------------------------------------------------------------
 * 1. CREATE TABLES IN POSTGRESQL
 * ----------------------------------------------------------------------------
 * 
 * -- Enable UUID extension if not already present
 * CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 * 
 * -- Profiles Table linked to Supabase Auth users
 * CREATE TABLE IF NOT EXISTS public.profiles (
 *   id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
 *   email TEXT NOT NULL UNIQUE,
 *   name TEXT NOT NULL,
 *   phone TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Saved Resume Evaluation Records Table
 * CREATE TABLE IF NOT EXISTS public.records (
 *   id BIGSERIAL PRIMARY KEY,
 *   owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   owner_email TEXT,
 *   name TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   resume_score TEXT NOT NULL,
 *   timestamp TEXT NOT NULL,
 *   reco_field TEXT NOT NULL,
 *   cand_level TEXT NOT NULL,
 *   skills JSONB NOT NULL,
 *   recommended_skills JSONB NOT NULL,
 *   courses JSONB NOT NULL,
 *   pdf_name TEXT NOT NULL,
 *   pdf_url TEXT, -- Dynamic storage URL if uploaded to bucket
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Feedback Reviews Table (Anonymous or authenticated submissions)
 * CREATE TABLE IF NOT EXISTS public.feedback (
 *   id BIGSERIAL PRIMARY KEY,
 *   feed_name TEXT NOT NULL,
 *   feed_email TEXT NOT NULL,
 *   feed_score TEXT NOT NULL,
 *   comments TEXT,
 *   timestamp TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * ----------------------------------------------------------------------------
 * 2. STORAGE BUCKET CONFIGURATION (For Resume Files)
 * ----------------------------------------------------------------------------
 * Make sure to create a public storage bucket named "resumes" in your Supabase
 * Storage Dashboard or run standard storage config.
 * 
 * ----------------------------------------------------------------------------
 * 3. ENABLE ROW-LEVEL SECURITY (RLS)
 * ----------------------------------------------------------------------------
 * 
 * -- Enable RLS for profiles
 * ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 * 
 * -- Enable RLS for records
 * ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
 * 
 * -- Enable RLS for feedback
 * ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
 * 
 * ----------------------------------------------------------------------------
 * 4. RLS POLICIES
 * ----------------------------------------------------------------------------
 * 
 * -- Profiles Policies:
 * CREATE POLICY "Users can view their own profile." 
 *   ON public.profiles FOR SELECT 
 *   USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can update their own profile." 
 *   ON public.profiles FOR UPDATE 
 *   USING (auth.uid() = id);
 * 
 * -- Records Policies:
 * CREATE POLICY "Users can select their own evaluation records." 
 *   ON public.records FOR SELECT 
 *   USING (auth.uid() = owner_id);
 * 
 * CREATE POLICY "Users can insert their own evaluation records." 
 *   ON public.records FOR INSERT 
 *   WITH CHECK (auth.uid() = owner_id);
 * 
 * CREATE POLICY "Users can delete their own evaluation records." 
 *   ON public.records FOR DELETE 
 *   USING (auth.uid() = owner_id);
 * 
 * CREATE POLICY "Admin/Everyone can select public records" 
 *   ON public.records FOR SELECT 
 *   USING (true); -- Useful for public dashboards
 * 
 * -- Feedback Policies:
 * CREATE POLICY "Anyone can submit feedback reviews." 
 *   ON public.feedback FOR INSERT 
 *   WITH CHECK (true);
 * 
 * CREATE POLICY "Anyone can select feedback reviews." 
 *   ON public.feedback FOR SELECT 
 *   USING (true);
 * 
 * -- Storage Bucket Policies (For "resumes" bucket):
 * -- Allow authenticated users to upload to their folder, and anyone to view
 * 
 */
