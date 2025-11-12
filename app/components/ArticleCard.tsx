'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  author: string;
  readingTime: number;
  tags: string[] | null;
  image?: string;
}

export default function ArticleCard({ slug, title, description, author, readingTime, tags, image }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(28, 183, 109, 0.15)' 
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/article/${slug}`}>
        {image && (
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '220px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1CB76D 0%, #0a9f5a 100%)'
          }}>
            <img 
              src={image} 
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </div>
        )}
        
        <div style={{ padding: '1.75rem' }}>
          <h2 style={{ 
            color: '#1CB76D', 
            marginBottom: '0.75rem', 
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
          }}>
            {title}
          </h2>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '1.5rem', 
            lineHeight: '1.7',
            fontSize: '0.95rem',
          }}>
            {description.substring(0, 120)}{description.length > 120 ? '...' : ''}
          </p>
          
          {tags && tags.length > 0 && (
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, #e8f8f0 0%, #d4f1e3 100%)',
                    color: '#0a9f5a',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    border: '1px solid rgba(28, 183, 109, 0.2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#999',
            paddingTop: '1rem',
            borderTop: '1px solid #f0f0f0',
          }}>
            <span style={{ fontWeight: 500, color: '#666' }}>{author}</span>
            <span style={{ 
              background: '#f8f9fa',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              color: '#666',
              fontSize: '0.8rem',
            }}>
              {readingTime} min read
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
