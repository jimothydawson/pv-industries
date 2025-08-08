#!/usr/bin/env node

/**
 * Blog Post Creator Utility
 * 
 * This script helps create new blog posts by:
 * 1. Adding a new entry to the blog-posts.json file
 * 2. Providing a template structure for easy content creation
 * 
 * Usage:
 * node src/utils/create-blog-post.js "Your Blog Post Title" "news" "Brief description"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create a slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Main function to create a new blog post
function createBlogPost(title, category = 'NEWS', description = '') {
  const blogDataPath = path.join(__dirname, '../data/blog-posts.json');
  
  try {
    // Read existing blog data
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    
    // Create new blog post object
    const slug = createSlug(title);
    const newPost = {
      id: slug,
      title: title,
      description: description || `Learn more about ${title.toLowerCase()}.`,
      category: category.toUpperCase(),
      date: getCurrentDate(),
      readTime: "5 min read",
      heroImage: "/images/placeholder-hero.jpg", // Update with actual image
      author: {
        name: "PV Industries",
        avatar: "/images/avatar-icon.svg"
      },
      content: {
        introduction: "Add your introduction paragraph here. This should provide an overview of what the article will cover.",
        sections: [
          {
            title: "First Main Section",
            content: "Add your content for the first main section here."
          },
          {
            title: "Second Main Section", 
            content: "Add your content for the second main section here.",
            subsections: [
              {
                title: "Subsection Example",
                content: "Add subsection content here if needed."
              }
            ]
          }
        ],
        conclusion: "Add your conclusion paragraph here. Summarize key points and provide a call to action if appropriate."
      },
      tags: ["tag1", "tag2", "tag3"], // Update with relevant tags
      relatedArticles: [] // Add related article IDs here
    };
    
    // Add new post to the beginning of the array (most recent first)
    blogData.posts.unshift(newPost);
    
    // Write updated data back to file
    fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 2));
    
    console.log(`✅ Blog post created successfully!`);
    console.log(`📝 Title: ${title}`);
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📂 Category: ${category.toUpperCase()}`);
    console.log(`📅 Date: ${getCurrentDate()}`);
    console.log(`\n🎯 Next steps:`);
    console.log(`1. Update the content in src/data/blog-posts.json`);
    console.log(`2. Add a hero image to public/images/ and update the heroImage path`);
    console.log(`3. Update tags and related articles`);
    console.log(`4. Your blog post will be available at: /articles/${slug}`);
    
  } catch (error) {
    console.error('❌ Error creating blog post:', error.message);
  }
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
📝 Blog Post Creator

Usage:
  node src/utils/create-blog-post.js "Your Blog Post Title" [category] [description]

Examples:
  node src/utils/create-blog-post.js "Solar Panel Innovations" "news" "Latest innovations in solar technology"
  node src/utils/create-blog-post.js "New Grant Opportunity" "grants"
  node src/utils/create-blog-post.js "Media Coverage" "in the media"

Categories:
  - news (default)
  - grants  
  - in the media
  `);
  process.exit(1);
}

const [title, category, description] = args;
createBlogPost(title, category, description);