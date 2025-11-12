'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  author: string;
  readingTime: number;
  tags: string[] | null;
}

export default function ArticleCard({ slug, title, description, author, readingTime, tags }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '1.5rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 16px rgba(28, 183, 109, 0.1)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/article/${slug}`}>
        <h2 style={{ color: '#1CB76D', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          {title}
        </h2>
        <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
          {description}
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          <span>{author}</span>
          <span>{readingTime} min read</span>
        </div>
        {tags && tags.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tags.map((tag, idx) => (
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
  );
}
