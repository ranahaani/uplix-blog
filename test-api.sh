#!/bin/bash

# Test script for article generation API
# Make sure to set GEMINI_API_KEY in your environment before running

echo "Testing Article Generation API..."
echo "=================================="
echo ""

# Test 1: Generate an article about TypeScript
echo "Test 1: Generating article about TypeScript..."
curl -X POST http://localhost:5000/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "The benefits of TypeScript for modern web development",
    "tags": ["TypeScript", "JavaScript", "Web Development"],
    "tone": "informative",
    "author": "Tech Writer"
  }' | jq '.'

echo ""
echo ""

# Test 2: Generate an article with minimal fields
echo "Test 2: Generating article with minimal fields..."
curl -X POST http://localhost:5000/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "How to build a REST API with Node.js"
  }' | jq '.'

echo ""
echo ""
echo "Tests complete!"
echo "Check http://localhost:5000 to see your generated articles"
