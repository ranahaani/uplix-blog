import * as fs from 'fs';
import * as path from 'path';
import { Article } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ARTICLES_FILE)) {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2));
  }
}

function readArticles(): Article[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

function writeArticles(articles: Article[]) {
  ensureDataDir();
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = readArticles();
  return articles.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = readArticles();
  return articles.find(article => article.slug === slug) || null;
}

export async function insertArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
  try {
    const articles = readArticles();
    const newId = articles.length > 0 
      ? Math.max(...articles.map(a => a.id)) + 1 
      : 1;
    
    const now = new Date().toISOString();
    const newArticle: Article = {
      ...article,
      id: newId,
      created_at: now,
      updated_at: now,
    };
    
    articles.push(newArticle);
    writeArticles(articles);
    
    return newArticle;
  } catch (error) {
    console.error('Error inserting article:', error);
    return null;
  }
}
