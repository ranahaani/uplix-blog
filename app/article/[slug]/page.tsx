import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticles } from '@/lib/db/supabase';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const articleUrl = `${baseUrl}/article/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      url: articleUrl,
      type: 'article',
      publishedTime: article.created_at,
      authors: [article.author],
      tags: article.tags ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const articleUrl = `${baseUrl}/article/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.created_at,
    dateModified: article.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'AI-Powered Blog',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <Link 
          href="/" 
          style={{ 
            display: 'inline-block', 
            marginBottom: '2rem',
            color: '#1CB76D',
            fontWeight: 500 
          }}
        >
          ← Back to all articles
        </Link>

        <article className="article-content">
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ marginBottom: '1rem' }}>{article.title}</h1>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              color: '#666',
              fontSize: '0.95rem',
              marginBottom: '1rem'
            }}>
              <span>By {article.author}</span>
              <span>•</span>
              <span>{article.reading_time} min read</span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#f0f9f4',
                      color: '#1CB76D',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666', 
              lineHeight: '1.8',
              fontStyle: 'italic',
              borderLeft: '4px solid #1CB76D',
              paddingLeft: '1rem'
            }}>
              {article.description}
            </p>
          </header>

          <div 
            dangerouslySetInnerHTML={{ __html: article.html_content }}
            style={{ fontSize: '1.1rem' }}
          />
        </article>
      </div>
    </>
  );
}
