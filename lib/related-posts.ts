import { BlogPostMetadata } from './blog';

/**
 * Get related posts based on tags similarity
 * @param currentPost - The current blog post
 * @param allPosts - All blog posts
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts
 */
export function getRelatedPosts(
  currentPost: BlogPostMetadata,
  allPosts: BlogPostMetadata[],
  limit: number = 3
): BlogPostMetadata[] {
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  // Calculate similarity score for each post
  const postsWithScores = otherPosts.map(post => {
    let score = 0;
    
    // Calculate tag overlap
    const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
    score += commonTags.length * 10; // Each common tag adds 10 points
    
    // Bonus for exact tag match
    if (commonTags.length === currentPost.tags.length && commonTags.length === post.tags.length) {
      score += 20;
    }
    
    return {
      post,
      score
    };
  });
  
  // Sort by score (descending) and return top N
  return postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}
