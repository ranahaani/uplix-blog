'use client';

import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';

export default function ArticleHeader() {
  return (
    <header style={{ 
      background: 'var(--theme-surface)',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--theme-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{ color: 'var(--theme-accent)', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="var(--theme-accent)" fillOpacity="0.1"/>
              <path 
                d="M20 8L32 28H8L20 8Z" 
                fill="var(--theme-accent)" 
                stroke="var(--theme-accent)" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 700,
              color: 'var(--theme-text)',
            }}>
              Uplix Blog
            </span>
          </div>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}

