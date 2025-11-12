# AI-Powered Blog Microservice

## Overview

This is a Next.js-based blog platform that generates articles using Google's Gemini AI model. The application provides a public-facing blog site with server-side rendering for SEO optimization, and an API endpoint for programmatic article generation. Articles are stored in Supabase and rendered with complete SEO metadata, structured data, and social sharing tags.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router
- Server-side rendering (SSR) for all public pages to maximize SEO performance
- Static generation with Incremental Static Regeneration (ISR) for article pages (60-second revalidate)
- Client-side interactivity limited to UI enhancements (hover states, transitions)
- React 19 for component architecture

**Styling Approach**:
- Global CSS with custom properties for consistent theming
- Inline styles for component-specific styling (no CSS modules or styled-components)
- Custom color scheme centered on brand green (#1CB76D)
- Outfit font family loaded via Next.js font optimization
- Responsive grid layouts using CSS Grid

**Rationale**: The App Router provides superior SEO capabilities through server components and streaming SSR. Inline styles keep components self-contained while global CSS handles typography and base styles.

### Backend Architecture

**API Design**: Next.js Route Handlers (App Router API routes)
- RESTful endpoint at `/api/generate-article` for article creation
- Server-side only operations (no client-side API calls for generation)
- JSON request/response format with typed interfaces

**Content Generation Pipeline**:
1. Receive article idea, tags, tone, and author via POST request
2. Construct structured prompt for Gemini AI model
3. Generate article content (≥1000 words) with title, description, and HTML content
4. Sanitize HTML output for security using DOMPurify
5. Generate URL-safe slug from title using slugify
6. Calculate reading time from content
7. Store in Supabase with metadata
8. Return article summary with public URL

**Security Considerations**:
- HTML sanitization using isomorphic-dompurify with strict allowlist of tags and attributes
- Environment variables for sensitive credentials (Gemini API key, Supabase credentials)
- Input validation on API endpoints

**Rationale**: Server-side content generation ensures API keys remain secure and provides consistent processing. HTML sanitization prevents XSS attacks while maintaining rich content formatting.

### Data Storage

**Database**: Supabase (PostgreSQL)
- Single `articles` table with comprehensive schema
- Fields: id, title, slug, description, content, html_content, author, tags, tone, reading_time, og_image_alt, created_at, updated_at
- Slug serves as unique identifier for URL routing
- JSONB storage for tags array

**Data Access Pattern**:
- Server-side database queries only (no client-side Supabase calls)
- Helper functions in `lib/db/supabase.ts` abstract database operations
- `getAllArticles()`: Fetches all articles ordered by creation date (descending)
- `getArticleBySlug()`: Retrieves single article for detail pages
- `insertArticle()`: Creates new article records

**Rationale**: Supabase provides hosted PostgreSQL with real-time capabilities and good Next.js integration. Server-side queries prevent credential exposure and enable data caching at the framework level.

### SEO and Metadata Strategy

**Metadata Generation**:
- Dynamic metadata generation using Next.js `generateMetadata` function
- Complete meta tags: title, description, canonical URL
- Open Graph tags for social sharing (Facebook, LinkedIn)
- Twitter Card tags for Twitter previews
- JSON-LD structured data for search engines (Article schema)

**Reading Time Calculation**:
- Computed using `reading-time` library during article creation
- Stored in database for consistent display
- Displayed on both listing and detail pages

**URL Structure**:
- Clean, SEO-friendly URLs: `/article/[slug]`
- Slugs generated from titles using slugify library
- Static params pre-generated for all articles

**Rationale**: Comprehensive metadata maximizes search engine visibility and social sharing engagement. Server-side generation ensures metadata is available for crawlers.

## External Dependencies

### AI Service
- **Google Gemini AI** (`@google/genai`): Content generation using Gemini Flash model
- API Key required via `GEMINI_API_KEY` environment variable
- Structured JSON output for consistent article formatting
- Prompt engineering for high-quality, SEO-optimized content

### Database Service
- **Supabase** (`@supabase/supabase-js`): PostgreSQL database hosting
- Credentials required: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Used for article storage and retrieval
- Real-time capabilities available but not currently utilized

### Utility Libraries
- **isomorphic-dompurify**: HTML sanitization (works server-side and client-side)
- **slugify**: URL-safe slug generation from article titles
- **reading-time**: Calculate estimated reading duration from content

### Development Dependencies
- **TypeScript**: Full type safety across application
- **ESLint**: Code quality and Next.js best practices enforcement
- **Tailwind CSS**: Included but not actively used (relies on custom CSS instead)

### Environment Variables Required
```
GEMINI_API_KEY=<Google AI API key>
SUPABASE_URL=<Supabase project URL>
SUPABASE_ANON_KEY=<Supabase anonymous key>
NEXT_PUBLIC_BASE_URL=<Production domain for canonical URLs>
```