import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleCard from '@/app/components/ArticleCard';

describe('ArticleCard Component', () => {
  const defaultProps = {
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'This is a test article description',
    author: 'Test Author',
    readingTime: 5,
    tags: ['test', 'article'],
  };

  it('should render article card with all props', () => {
    render(<ArticleCard {...defaultProps} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText(/This is a test article description/)).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('should render tags when provided', () => {
    render(<ArticleCard {...defaultProps} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('article')).toBeInTheDocument();
  });

  it('should not render tags when null', () => {
    render(<ArticleCard {...defaultProps} tags={null} />);
    
    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  it('should truncate description when too long', () => {
    const longDescription = 'a'.repeat(150);
    render(<ArticleCard {...defaultProps} description={longDescription} />);
    
    const description = screen.getByText(/a+\.\.\./);
    expect(description.textContent?.length).toBeLessThan(longDescription.length + 3);
  });

  it('should render with image when provided', () => {
    render(<ArticleCard {...defaultProps} image="data:image/jpeg;base64,test" />);
    
    const image = screen.getByAltText('Test Article Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'data:image/jpeg;base64,test');
  });

  it('should have correct link href', () => {
    render(<ArticleCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/article/test-article');
  });

  it('should limit tags to maximum of 3', () => {
    const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
    render(<ArticleCard {...defaultProps} tags={manyTags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.queryByText('tag4')).not.toBeInTheDocument();
    expect(screen.queryByText('tag5')).not.toBeInTheDocument();
  });
});
