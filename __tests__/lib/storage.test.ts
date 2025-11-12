import * as fs from 'fs';
import * as path from 'path';
import { getAllArticles, getArticleBySlug, insertArticle } from '@/lib/db/storage';

const TEST_DATA_DIR = path.join(process.cwd(), 'test-data');
const TEST_ARTICLES_FILE = path.join(TEST_DATA_DIR, 'articles.json');

describe('Storage Functions', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(() => {
    if (fs.existsSync(TEST_ARTICLES_FILE)) {
      fs.unlinkSync(TEST_ARTICLES_FILE);
    }
    if (fs.existsSync(TEST_DATA_DIR)) {
      fs.rmSync(TEST_DATA_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
    fs.writeFileSync(TEST_ARTICLES_FILE, JSON.stringify([], null, 2));
  });

  afterAll(() => {
    if (fs.existsSync(TEST_DATA_DIR)) {
      fs.rmSync(TEST_DATA_DIR, { recursive: true });
    }
    delete process.env.NODE_ENV;
  });

  describe('insertArticle', () => {
    it('should insert a new article', async () => {
      const articleData = {
        title: 'Test Article',
        slug: 'test-article',
        description: 'This is a test article',
        content: 'Test content',
        html_content: '<p>Test content</p>',
        author: 'Test Author',
        tags: ['test', 'article'],
        tone: 'informative',
        reading_time: 5,
        og_image_alt: 'Test image',
      };

      const result = await insertArticle(articleData);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Test Article');
      expect(result?.slug).toBe('test-article');
      expect(result?.created_at).toBeDefined();
      expect(result?.updated_at).toBeDefined();
    });

    it('should auto-increment IDs', async () => {
      const article1 = await insertArticle({
        title: 'Article 1',
        slug: 'article-1',
        description: 'First article',
        content: 'Content 1',
        html_content: '<p>Content 1</p>',
        author: 'Author 1',
        tags: ['tag1'],
        tone: 'informative',
        reading_time: 3,
        og_image_alt: 'Image 1',
      });

      const article2 = await insertArticle({
        title: 'Article 2',
        slug: 'article-2',
        description: 'Second article',
        content: 'Content 2',
        html_content: '<p>Content 2</p>',
        author: 'Author 2',
        tags: ['tag2'],
        tone: 'casual',
        reading_time: 4,
        og_image_alt: 'Image 2',
      });

      expect(article1?.id).toBe(1);
      expect(article2?.id).toBe(2);
    });
  });

  describe('getAllArticles', () => {
    it('should return empty array when no articles exist', async () => {
      const articles = await getAllArticles();
      expect(articles).toEqual([]);
    });

    it('should return all articles sorted by creation date', async () => {
      await insertArticle({
        title: 'First Article',
        slug: 'first-article',
        description: 'First',
        content: 'Content',
        html_content: '<p>Content</p>',
        author: 'Author',
        tags: [],
        tone: 'informative',
        reading_time: 5,
        og_image_alt: 'Image',
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      await insertArticle({
        title: 'Second Article',
        slug: 'second-article',
        description: 'Second',
        content: 'Content',
        html_content: '<p>Content</p>',
        author: 'Author',
        tags: [],
        tone: 'informative',
        reading_time: 5,
        og_image_alt: 'Image',
      });

      const articles = await getAllArticles();
      expect(articles.length).toBe(2);
      expect(articles[0].title).toBe('Second Article');
      expect(articles[1].title).toBe('First Article');
    });
  });

  describe('getArticleBySlug', () => {
    it('should return null when article does not exist', async () => {
      const article = await getArticleBySlug('non-existent');
      expect(article).toBeNull();
    });

    it('should return the correct article by slug', async () => {
      await insertArticle({
        title: 'Test Article',
        slug: 'test-article',
        description: 'Test description',
        content: 'Test content',
        html_content: '<p>Test content</p>',
        author: 'Test Author',
        tags: ['test'],
        tone: 'informative',
        reading_time: 5,
        og_image_alt: 'Test image',
      });

      const article = await getArticleBySlug('test-article');
      expect(article).not.toBeNull();
      expect(article?.title).toBe('Test Article');
      expect(article?.slug).toBe('test-article');
    });
  });
});
