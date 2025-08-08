import blogDataImport from '../data/blog-posts.json';
const blogData = blogDataImport;

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  heroImage: string;
  author: {
    name: string;
    avatar: string;
  };
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      subsections?: Array<{
        title: string;
        content: string;
      }>;
    }>;
    conclusion: string;
  };
  tags: string[];
  relatedArticles: string[];
}

export interface ArticleCard {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  return blogData.posts;
}

// Get a single blog post by ID
export function getBlogPostById(id: string): BlogPost | undefined {
  return blogData.posts.find(post => post.id === id);
}

// Get blog posts by category
export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogData.posts.filter(post => post.category === category);
}

// Get related articles for a blog post
export function getRelatedArticles(postId: string): ArticleCard[] {
  const post = getBlogPostById(postId);
  if (!post || !post.relatedArticles) return [];

  return post.relatedArticles
    .map(relatedId => {
      const relatedPost = getBlogPostById(relatedId);
      if (!relatedPost) return null;
      
      return {
        id: Math.random(), // Simple ID for component key
        title: relatedPost.title,
        excerpt: relatedPost.description,
        image: relatedPost.heroImage,
        category: relatedPost.category,
        date: relatedPost.date,
        readTime: relatedPost.readTime,
        slug: relatedPost.id
      };
    })
    .filter(Boolean) as ArticleCard[];
}

// Convert blog post content to HTML
export function convertContentToHTML(content: BlogPost['content']): string {
  let html = `<p>${content.introduction}</p>`;

  content.sections.forEach((section, index) => {
    html += `<h2>${index + 1}. ${section.title}</h2>`;
    html += `<p>${section.content}</p>`;

    if (section.subsections) {
      section.subsections.forEach(subsection => {
        html += `<h3>${subsection.title}</h3>`;
        html += `<p>${subsection.content}</p>`;
      });
    }
  });

  html += `<p>${content.conclusion}</p>`;

  return html;
}

// Get recent blog posts (for homepage, etc.)
export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
  return blogData.posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Search blog posts
export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  
  return blogData.posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.content.introduction.toLowerCase().includes(lowercaseQuery)
  );
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = blogData.posts.map(post => post.category);
  return [...new Set(categories)];
}

// Get all unique tags
export function getAllTags(): string[] {
  const allTags = blogData.posts.flatMap(post => post.tags);
  return [...new Set(allTags)];
}