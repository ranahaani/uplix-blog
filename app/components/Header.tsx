'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #32B028 0%, #1CB76D 100%)',
      padding: '1.5rem 2rem',
      boxShadow: '0 4px 20px rgba(50, 176, 40, 0.2)',
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.2"/>
              <path 
                d="M20 8L32 28H8L20 8Z" 
                fill="white" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h1 style={{ 
                fontSize: '1.75rem', 
                marginBottom: '0',
                color: 'white',
                fontWeight: 700,
              }}>
                Uplix Blog
              </h1>
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p style={{ 
            fontSize: '0.95rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 300,
            display: 'none',
          }}>
            AI-Powered Insights
          </p>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

