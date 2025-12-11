import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import readingTime from 'reading-time';
import { insertArticle, getAllArticles } from '@/lib/db/storage';
import { sanitizeHTML } from '@/lib/utils/sanitize';
import { generateSlug } from '@/lib/utils/slug';
import { generateBlogImage } from '@/lib/utils/imageGenerator';
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const TOPICS_FILE = path.join(process.cwd(), 'topics.txt');
const DEFAULT_TOPIC = 'nano bnana image editor';

interface GeneratedArticle {
  title: string;
  description: string;
  content: string;
  og_image_alt: string;
  tags: string[];
}

function getNextTopic(): string {
  try {
    if (!fs.existsSync(TOPICS_FILE)) {
      return DEFAULT_TOPIC;
    }
    
    const content = fs.readFileSync(TOPICS_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      return DEFAULT_TOPIC;
    }
    
    // Get the first topic
    const topic = lines[0].trim();
    
    // Remove the used topic and save
    const remainingTopics = lines.slice(1);
    fs.writeFileSync(TOPICS_FILE, remainingTopics.join('\n'));
    
    return topic || DEFAULT_TOPIC;
  } catch (error) {
    console.error('Error reading topics file:', error);
    return DEFAULT_TOPIC;
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret for security (optional but recommended)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow without secret for testing, but log warning
    console.warn('Cron endpoint called without valid secret');
  }
  
  try {
    // Get the next topic from the file
    const topic = getNextTopic();
    
    console.log(`[CRON] Generating article for topic: ${topic}`);
    
    // Generate the article content
    const systemPrompt = `You are an expert content writer creating high-quality, SEO-optimized blog articles for Uplix, an AI-powered image editing platform for e-commerce. 
Your articles should be well-structured, engaging, and at least 1000 words long.
Always include:
- A compelling title that includes relevant keywords
- A meta description (150-160 characters)
- An introduction
- Multiple sections with H2 and H3 headings
- Detailed content with examples
- A conclusion
- Relevant tags for the article
- Suggested alt text for an Open Graph image

Format your response as JSON with this structure:
{
  "title": "Article Title Here",
  "description": "Meta description here (150-160 chars)",
  "content": "Full HTML content with proper heading tags and paragraphs",
  "og_image_alt": "Descriptive alt text for featured image",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Write a professional, informative blog article about: ${topic}

Requirements:
- Minimum 1000 words
- Use HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, etc.
- Include an engaging introduction
- Break content into logical sections with descriptive headings
- Add practical examples or use cases
- Write a strong conclusion
- Make it SEO-friendly with natural keyword usage
- Tone: professional yet approachable
- If relevant, mention how Uplix or AI image editing tools can help with this topic`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            og_image_alt: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['title', 'description', 'content', 'og_image_alt', 'tags'],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text || '';
    
    if (!rawJson) {
      throw new Error('Empty response from Gemini');
    }

    const generated: GeneratedArticle = JSON.parse(rawJson);

    console.log(`[CRON] Article generated: ${generated.title}`);
    console.log(`[CRON] Generating cover image...`);

    // Generate cover image
    const articleImage = await generateBlogImage(
      generated.title,
      'modern, professional, tech, vibrant',
      '16:9'
    );

    const sanitizedContent = sanitizeHTML(generated.content);
    const slug = generateSlug(generated.title);
    const stats = readingTime(sanitizedContent);

    const articleData = {
      title: generated.title,
      slug: slug,
      description: generated.description,
      content: sanitizedContent,
      html_content: sanitizedContent,
      author: 'Uplix Team',
      tags: generated.tags,
      tone: 'professional',
      reading_time: Math.ceil(stats.minutes),
      og_image_alt: generated.og_image_alt,
      image: articleImage || undefined,
    };

    console.log(`[CRON] Saving article to storage...`);
    
    const savedArticle = await insertArticle(articleData);

    if (!savedArticle) {
      throw new Error('Failed to save article');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const articleUrl = `${baseUrl}/article/${savedArticle.slug}`;

    console.log(`[CRON] Article published successfully: ${articleUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Article generated and published successfully',
      topic: topic,
      article: {
        id: savedArticle.id,
        title: savedArticle.title,
        slug: savedArticle.slug,
        url: articleUrl,
        hasImage: !!articleImage,
      },
    });

  } catch (error) {
    console.error('[CRON] Error generating article:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}

