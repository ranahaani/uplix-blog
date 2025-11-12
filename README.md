# AI-Powered Blog Microservice

A modern Next.js blog platform with AI-generated content using Google's Gemini model. Features server-side rendering for optimal SEO, comprehensive metadata, and automated article generation.

## Features

### Public Blog Site
- **Server-rendered pages** using Next.js App Router for superior SEO
- **Responsive design** with Outfit font and custom green (#1CB76D) color scheme
- **Article listing** page with previews, tags, and reading time
- **Individual article pages** with:
  - Full HTML content (sanitized for security)
  - Complete SEO metadata (title, description, canonical URL)
  - JSON-LD structured data for search engines
  - Open Graph tags for social sharing
  - Twitter Card tags
  - Reading time estimation
  - Publication date and author information

### Article Generation API
- **POST `/api/generate-article`** endpoint
- Generates high-quality articles (≥1000 words) using Gemini Flash
- Automatic slug generation from title
- HTML sanitization for security
- Reading time calculation
- Structured output with consistent formatting

#### API Request Format
```json
{
  "idea": "Your article topic or idea",
  "tags": ["optional", "tags"],
  "tone": "informative",
  "author": "Author Name"
}
```

#### API Response Format
```json
{
  "id": 1,
  "title": "Generated Article Title",
  "slug": "generated-article-title",
  "url": "https://yourdomain.com/article/generated-article-title",
  "description": "SEO-optimized description",
  "author": "Author Name",
  "tags": ["tag1", "tag2"],
  "reading_time": 8,
  "created_at": "2025-11-12T14:56:13.000Z"
}
```

## Setup Instructions

### 1. Supabase Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. In the Supabase SQL Editor, execute the schema from `database-schema.sql`
3. Get your Supabase credentials:
   - Project URL (format: `https://xxxxx.supabase.co`)
   - Anon/Public API Key

### 2. Environment Variables

Add the following secrets to your Replit project:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `GEMINI_API_KEY` - Your Google AI API key (get from [Google AI Studio](https://aistudio.google.com))
- `NEXT_PUBLIC_BASE_URL` - Your deployment URL (optional, for production)

### 3. Running the Project

```bash
npm run dev
```

The site will be available at `http://localhost:5000`

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini 2.5 Flash
- **Styling:** Custom CSS with Outfit font
- **Security:** isomorphic-dompurify for HTML sanitization
- **SEO:** Built-in metadata API, JSON-LD structured data

## API Usage Examples

### Generate an Article

```bash
curl -X POST http://localhost:5000/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "The future of artificial intelligence in healthcare",
    "tags": ["AI", "Healthcare", "Technology"],
    "tone": "informative",
    "author": "Dr. Smith"
  }'
```

### View All Articles
Navigate to `http://localhost:5000/` in your browser.

### View a Specific Article
Navigate to `http://localhost:5000/article/{slug}` in your browser.

## Database Schema

The `articles` table includes:
- `id` - Auto-incrementing primary key
- `title` - Article title
- `slug` - URL-friendly slug (unique)
- `description` - SEO meta description
- `content` - Plain text content
- `html_content` - Sanitized HTML for display
- `author` - Article author
- `tags` - Array of tags
- `tone` - Article tone/style
- `reading_time` - Estimated minutes to read
- `og_image_alt` - Open Graph image alt text
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## SEO Features

Each article page includes:
- **HTML metadata:** title, description, canonical URL
- **JSON-LD structured data:** Article schema with author, dates, publisher
- **Open Graph tags:** title, description, type, URL, published time, authors
- **Twitter Cards:** summary with large image support
- **Server-side rendering:** All content rendered on server for crawlers

## Project Structure

```
/app
  /api/generate-article - Article generation endpoint
  /article/[slug] - Dynamic article pages
  layout.tsx - Root layout with Outfit font
  page.tsx - Homepage with article listing
  globals.css - Global styles
/lib
  /db
    supabase.ts - Database utilities
    types.ts - TypeScript interfaces
  /utils
    sanitize.ts - HTML sanitization
    slug.ts - Slug generation
```

## License

MIT
