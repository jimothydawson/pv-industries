# Blog Post Template System

This document explains how to use the blog post template system for creating new blog posts on the PV Industries website.

## Overview

The blog post system uses a JSON-based data structure that allows you to create blog posts by simply adding data to a JSON file. The system automatically generates the HTML layout and handles routing.

## File Structure

```
src/
├── data/
│   └── blog-posts.json          # All blog post data
├── layouts/
│   └── BlogPostLayout.astro     # Main blog post layout template
├── pages/
│   └── articles/
│       ├── [slug].astro         # Dynamic route for blog posts
│       └── blog-post-template.astro  # Static template example
├── utils/
│   ├── blog.ts                  # Blog utility functions
│   └── create-blog-post.js      # Helper script for creating posts
```

## Creating a New Blog Post

### Method 1: Using the Helper Script (Recommended)

1. Run the blog post creator script:
```bash
node src/utils/create-blog-post.js "Your Blog Post Title" "news" "Brief description"
```

2. This will automatically:
   - Create a new entry in `src/data/blog-posts.json`
   - Generate a URL slug from your title
   - Set up the basic structure

3. Edit the generated entry in `blog-posts.json` to add your content

### Method 2: Manual JSON Entry

1. Open `src/data/blog-posts.json`
2. Add a new blog post object to the `posts` array:

```json
{
  "id": "your-blog-post-slug",
  "title": "Your Blog Post Title",
  "description": "SEO description for your blog post",
  "category": "NEWS",
  "date": "2024-01-01",
  "readTime": "5 min read",
  "heroImage": "/images/your-hero-image.jpg",
  "author": {
    "name": "PV Industries",
    "avatar": "/images/avatar-icon.svg"
  },
  "content": {
    "introduction": "Your introduction paragraph...",
    "sections": [
      {
        "title": "Section Title",
        "content": "Section content...",
        "subsections": [
          {
            "title": "Subsection Title",
            "content": "Subsection content..."
          }
        ]
      }
    ],
    "conclusion": "Your conclusion paragraph..."
  },
  "tags": ["tag1", "tag2", "tag3"],
  "relatedArticles": ["other-post-id-1", "other-post-id-2"]
}
```

## Blog Post Structure

### Required Fields

- **id**: Unique identifier and URL slug (e.g., "solar-panel-recycling")
- **title**: The main title of your blog post
- **description**: SEO description (keep under 160 characters)
- **category**: One of "NEWS", "GRANTS", or "IN THE MEDIA"
- **date**: Publication date in YYYY-MM-DD format
- **readTime**: Estimated reading time (e.g., "5 min read")
- **heroImage**: Path to hero image (recommended size: 1600x900px)

### Content Structure

The content is structured as:
- **introduction**: Opening paragraph
- **sections**: Array of main sections, each with:
  - **title**: Section heading
  - **content**: Section content
  - **subsections** (optional): Array of subsections
- **conclusion**: Closing paragraph

### Optional Fields

- **author**: Author information (defaults to PV Industries)
- **tags**: Array of relevant tags for categorization
- **relatedArticles**: Array of related blog post IDs

## Categories

The system supports three categories:

1. **NEWS** - General news and updates
2. **GRANTS** - Grant opportunities and funding news
3. **IN THE MEDIA** - Media coverage and press mentions

## Images

1. Place images in the `public/images/` directory
2. Reference them with `/images/filename.jpg`
3. Recommended hero image size: 1600x900px
4. Optimize images for web (WebP format preferred)

## URL Structure

Blog posts are automatically available at:
```
/articles/[your-blog-post-id]
```

For example, a post with ID "solar-panel-recycling" will be available at:
```
/articles/solar-panel-recycling
```

## Related Articles

To link related articles:

1. Add the IDs of related posts to the `relatedArticles` array
2. The system will automatically display them at the bottom of the blog post
3. Maximum of 3 related articles are recommended

## SEO Considerations

- Keep titles under 60 characters
- Write compelling descriptions under 160 characters
- Use descriptive slugs (IDs) for better URLs
- Include relevant keywords naturally in your content
- Add appropriate tags for better categorization

## Content Writing Tips

1. **Structure**: Use the section-based approach for better readability
2. **Headings**: Main sections become H2 headings, subsections become H3
3. **Length**: Aim for 800-1500 words for optimal engagement
4. **Call to Action**: Include a clear call to action in your conclusion

## Testing Your Blog Post

1. After creating your blog post, start the development server:
```bash
npm run dev
```

2. Navigate to your blog post URL:
```
http://localhost:4321/articles/your-blog-post-id
```

3. Check that:
   - All content displays correctly
   - Images load properly
   - Related articles appear
   - Layout looks good on mobile and desktop

## Updating Existing Posts

To update an existing blog post:

1. Find the post in `src/data/blog-posts.json`
2. Edit the content directly in the JSON structure
3. Save the file - changes will be reflected immediately

## Troubleshooting

### Common Issues

1. **Post not showing**: Check that the ID is unique and doesn't contain special characters
2. **Images not loading**: Ensure images are in `public/images/` and paths start with `/images/`
3. **Broken layout**: Validate your JSON syntax using a JSON validator
4. **Related articles not showing**: Ensure related article IDs exist in the blog-posts.json file

### Getting Help

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Validate your JSON syntax
3. Ensure all required fields are present
4. Check that image paths are correct

## Example Blog Post

See the "Solar Panel Recycling: A Business Opportunity for Cost Savings and Resource Recovery" post in the JSON file for a complete example of how to structure your content.

This post demonstrates:
- Proper section structure
- Use of subsections
- Appropriate tags and categories
- Related article linking
- Professional content formatting