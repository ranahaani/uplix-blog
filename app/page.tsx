import { getAllArticles } from '@/lib/db/supabase';
import ArticleCard from './components/ArticleCard';

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
              <ArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                description={article.description}
                author={article.author}
                readingTime={article.reading_time}
                tags={article.tags}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
