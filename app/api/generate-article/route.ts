import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import readingTime from 'reading-time';
import { insertArticle } from '@/lib/db/storage';
import { sanitizeHTML } from '@/lib/utils/sanitize';
import { generateSlug } from '@/lib/utils/slug';
import { GenerateArticleRequest, GenerateArticleResponse } from '@/lib/db/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface GeneratedArticle {
  title: string;
  description: string;
  content: string;
  og_image_alt: string;
}

async function generateArticleImage(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateImages({
      model: 'gemini-2.5-flash-image',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image?.imageBytes;
      if (base64ImageBytes) {
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateArticleRequest = await request.json();
    
    if (!body.idea || body.idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Article idea is required' },
        { status: 400 }
      );
    }

    const { idea, tags = [], tone = 'informative', author = 'AI Writer' } = body;

    console.log('Generating article with Gemini...');
    
    const systemPrompt = `You are an expert content writer creating high-quality, SEO-optimized blog articles. 
Your articles should be well-structured, engaging, and at least 1000 words long.
Always include:
- A compelling title
- A meta description (150-160 characters)
- An introduction
- Multiple sections with H2 and H3 headings
- Detailed content with examples
- A conclusion
- Suggested alt text for an Open Graph image

Format your response as JSON with this structure:
{
  "title": "Article Title Here",
  "description": "Meta description here (150-160 chars)",
  "content": "Full HTML content with proper heading tags and paragraphs",
  "og_image_alt": "Descriptive alt text for featured image"
}`;

    const userPrompt = `Write a ${tone} blog article about: ${idea}${tags.length > 0 ? `\n\nInclude these topics/tags: ${tags.join(', ')}` : ''}

Requirements:
- Minimum 1000 words
- Use HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, etc.
- Include an engaging introduction
- Break content into logical sections with descriptive headings
- Add practical examples or use cases
- Write a strong conclusion
- Make it SEO-friendly with natural keyword usage
- Tone: ${tone}`;

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
          },
          required: ['title', 'description', 'content', 'og_image_alt'],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text || '';
    
    if (!rawJson) {
      throw new Error('Empty response from Gemini');
    }

    const generated: GeneratedArticle = JSON.parse(rawJson);

    console.log('Generating article image...');
    const imagePrompt = `Create a professional, modern blog header image for an article titled "${generated.title}". Style: clean, minimalist, professional. ${generated.og_image_alt}`;
    const articleImage = await generateArticleImage(imagePrompt);

    const sanitizedContent = sanitizeHTML(generated.content);
    const slug = generateSlug(generated.title);
    const stats = readingTime(sanitizedContent);

    const articleData = {
      title: generated.title,
      slug: slug,
      description: generated.description,
      content: sanitizedContent,
      html_content: sanitizedContent,
      author: author,
      tags: tags,
      tone: tone,
      reading_time: Math.ceil(stats.minutes),
      og_image_alt: generated.og_image_alt,
      image: articleImage || undefined,
    };

    console.log('Saving article to file storage...');
    
    const savedArticle = await insertArticle(articleData);

    if (!savedArticle) {
      throw new Error('Failed to save article');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.REPLIT_DEV_DOMAIN ? 
                    `https://${process.env.REPLIT_DEV_DOMAIN}` : 
                    'http://localhost:5000');

    const articleUrl = `${baseUrl}/article/${savedArticle.slug}`;

    const responseData: GenerateArticleResponse = {
      id: savedArticle.id,
      title: savedArticle.title,
      slug: savedArticle.slug,
      url: articleUrl,
      description: savedArticle.description,
      author: savedArticle.author,
      tags: savedArticle.tags || [],
      reading_time: savedArticle.reading_time,
      created_at: savedArticle.created_at,
    };

    console.log('Article generated successfully:', savedArticle.slug);

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('Error generating article:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
