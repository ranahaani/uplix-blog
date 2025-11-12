export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  html_content: string;
  author: string;
  tags: string[] | null;
  tone: string;
  reading_time: number;
  og_image_alt: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleInsert {
  title: string;
  slug: string;
  description: string;
  content: string;
  html_content: string;
  author: string;
  tags: string[];
  tone: string;
  reading_time: number;
  og_image_alt: string;
}

export interface GenerateArticleRequest {
  idea: string;
  tags?: string[];
  tone?: string;
  author?: string;
}

export interface GenerateArticleResponse {
  id: number;
  title: string;
  slug: string;
  url: string;
  description: string;
  author: string;
  tags: string[];
  reading_time: number;
  created_at: string;
}
