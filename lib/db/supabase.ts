import { createClient } from '@supabase/supabase-js';
import { Article } from './types';

const supabaseUrl = process.env.SUPABASE_URL || 'https://cniqusdkybvrcxvdujrf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuaXF1c2RreWJ2cmN4dmR1anJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Njg1ODcsImV4cCI6MjA3ODU0NDU4N30.CKNiuNKES9BkdA6-6KU9kCMN7gwurP4Nsgn-C6sfPjw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data || [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}

export async function insertArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) {
    console.error('Error inserting article:', error);
    return null;
  }

  return data;
}
