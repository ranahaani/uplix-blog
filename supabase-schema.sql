-- Create the articles table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Uplix Team',
  tags TEXT[] DEFAULT '{}',
  tone TEXT DEFAULT 'professional',
  reading_time INTEGER DEFAULT 5,
  og_image_alt TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Create index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON articles
  FOR SELECT
  USING (true);

-- Create policy to allow insert (for API)
CREATE POLICY "Allow insert" ON articles
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow update (for API)
CREATE POLICY "Allow update" ON articles
  FOR UPDATE
  USING (true);

-- Create policy to allow delete (for API)
CREATE POLICY "Allow delete" ON articles
  FOR DELETE
  USING (true);

