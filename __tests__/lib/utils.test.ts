import { sanitizeHTML } from '@/lib/utils/sanitize';
import { generateSlug } from '@/lib/utils/slug';

describe('Utility Functions', () => {
  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const input = '<h2>Title</h2><p>Paragraph</p><strong>Bold</strong>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<h2>');
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('should remove dangerous script tags', () => {
      const input = '<script>alert("XSS")</script><p>Safe content</p>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<p>Safe content</p>');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(\'XSS\')">Click me</div>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onclick');
      expect(result).toContain('Click me');
    });

    it('should handle empty input', () => {
      const result = sanitizeHTML('');
      expect(result).toBe('');
    });
  });

  describe('generateSlug', () => {
    it('should convert text to lowercase slug', () => {
      const result = generateSlug('Hello World');
      expect(result).toBe('hello-world');
    });

    it('should remove special characters', () => {
      const result = generateSlug('Hello! World?');
      expect(result).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      const result = generateSlug('Hello    World');
      expect(result).toBe('hello-world');
    });

    it('should handle unicode characters', () => {
      const result = generateSlug('Café & Restaurant');
      expect(result).toBe('cafe-and-restaurant');
    });

    it('should handle numbers', () => {
      const result = generateSlug('Article 123');
      expect(result).toBe('article-123');
    });
  });
});
