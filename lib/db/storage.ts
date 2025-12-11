import { supabase } from './supabase';
import { Article } from './types';

export async function getAllArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching article by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getArticleBySlug:', error);
    return null;
  }
}

export async function insertArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
  try {
    const now = new Date().toISOString();
    
    const articleToInsert = {
      ...article,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('articles')
      .insert([articleToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error inserting article:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in insertArticle:', error);
    return null;
  }
}

export async function deleteArticle(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    return false;
  }
}
