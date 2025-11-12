import Link from 'next/link';
import { getAllArticles } from '@/lib/db/supabase';

export const revalidate = 60;

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI-Powered Blog</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Discover articles written with cutting-edge AI technology
        </p>
      </header>

      <main>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              No articles yet. Generate your first article using the API!
            </p>
            <p style={{ marginTop: '1rem', color: '#999' }}>
              POST to /api/generate-article with your article idea
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {articles.map((article) => (
              <article
                key={article.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(28, 183, 109, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Link href={`/article/${article.slug}`}>
                  <h2 style={{ color: '#1CB76D', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                    {article.title}
                  </h2>
                  <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {article.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: '#999'
                  }}>
                    <span>{article.author}</span>
                    <span>{article.reading_time} min read</span>
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#f0f9f4',
                            color: '#1CB76D',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
