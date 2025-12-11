import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticles } from '@/lib/db/storage';
import ArticleHeader from './ArticleHeader';

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
      title: 'Article Not Found | Uplix Blog',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const articleUrl = `${baseUrl}/article/${article.slug}`;

  return {
    title: `${article.title} | Uplix Blog`,
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
      siteName: 'Uplix Blog',
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
      name: 'Uplix Blog',
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
      <div style={{ minHeight: '100vh', background: 'var(--theme-bg)', transition: 'background 0.3s ease' }}>
        <ArticleHeader />
        
        <div className="container" style={{ paddingTop: '2rem' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
              color: 'var(--theme-accent)',
              fontWeight: 500,
              transition: 'opacity 0.2s ease',
            }}
          >
            <span>←</span> Back to all articles
          </Link>

          <article className="article-content">
            <header style={{ marginBottom: '2rem' }}>
              <h1 style={{ 
                marginBottom: '1rem', 
                color: 'var(--theme-accent)',
                fontSize: '2.5rem',
                fontWeight: 700,
                lineHeight: 1.2,
              }}>
                {article.title}
              </h1>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '1rem', 
                color: 'var(--theme-text-secondary)',
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}>
                <span>By <strong style={{ color: 'var(--theme-text)' }}>{article.author}</strong></span>
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
                        background: 'linear-gradient(135deg, rgba(50, 176, 40, 0.1) 0%, rgba(28, 183, 109, 0.1) 100%)',
                        color: 'var(--theme-accent)',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        border: '1px solid rgba(50, 176, 40, 0.2)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p style={{ 
                fontSize: '1.2rem', 
                color: 'var(--theme-text-secondary)', 
                lineHeight: '1.8',
                fontStyle: 'italic',
                borderLeft: '4px solid var(--theme-accent)',
                paddingLeft: '1rem',
                background: 'var(--theme-surface)',
                padding: '1rem 1rem 1rem 1.5rem',
                borderRadius: '0 8px 8px 0',
              }}>
                {article.description}
              </p>
            </header>

            <div 
              dangerouslySetInnerHTML={{ __html: article.html_content }}
              style={{ 
                fontSize: '1.1rem',
                color: 'var(--theme-text)',
              }}
            />
          </article>
        </div>

        <footer style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid var(--theme-border)',
          color: 'var(--theme-text-secondary)',
          fontSize: '0.9rem',
          marginTop: '4rem',
        }}>
          <p>© {new Date().getFullYear()} Uplix. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
