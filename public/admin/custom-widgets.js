/**
 * EpicKor Blog Admin - Custom Widgets & Enhancements
 * 
 * Features:
 * 1. Image Grid Auto-formatting (remove blank lines)
 * 2. Amazon Links Auto-injection
 * 3. Bulk Update Engine
 */

// ============================================
// 1. Image Grid Auto-formatting
// ============================================
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    const data = entry.get('data');
    let body = data.get('body');
    
    if (!body) return entry;
    
    // Remove blank lines between consecutive image tags
    // Pattern: ![...](...)  \n\n  ![...](...)
    // Result:  ![...](...)  \n  ![...](...)
    body = body.replace(/(\!\[.*?\]\(.*?\))\s*\n\s*\n\s*(\!\[.*?\]\(.*?\))/g, '$1\n$2');
    
    // Update entry
    return entry.setIn(['data', 'body'], body);
  }
});

// ============================================
// 2. Amazon Links Auto-injection
// ============================================
CMS.registerEventListener({
  name: 'preSave',
  handler: async ({ entry }) => {
    const data = entry.get('data');
    const tags = data.get('tags');
    let body = data.get('body');
    
    if (!tags || !body) return entry;
    
    // Check if tags include 'Shopping' or 'Food'
    const needsAmazonLinks = tags.some(tag => 
      ['Shopping', 'Food', 'Fashion', 'Beauty'].includes(tag)
    );
    
    if (!needsAmazonLinks) return entry;
    
    // Check if Amazon links already exist
    if (body.includes('## 추천 상품') || body.includes('## Recommended Products')) {
      return entry;
    }
    
    // Fetch Amazon links from data file
    try {
      const response = await fetch('/content/data/amazon-links.json');
      const amazonData = await response.json();
      const products = amazonData.products || [];
      
      // Filter products by category
      const relevantProducts = products.filter(p => 
        tags.includes(p.category)
      );
      
      // Select random 3 products
      const selectedProducts = relevantProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      if (selectedProducts.length === 0) return entry;
      
      // Generate Amazon card section
      let amazonSection = '\n\n## 추천 상품\n\n';
      selectedProducts.forEach(product => {
        amazonSection += `### ${product.name}\n`;
        amazonSection += `${product.description}\n\n`;
        amazonSection += `**가격:** ${product.price}\n\n`;
        amazonSection += `[Amazon에서 구매하기](${product.url})\n\n`;
        if (product.image) {
          amazonSection += `![${product.name}](${product.image})\n\n`;
        }
        amazonSection += '---\n\n';
      });
      
      // Append to body
      body += amazonSection;
      
      return entry.setIn(['data', 'body'], body);
    } catch (error) {
      console.error('Failed to load Amazon links:', error);
      return entry;
    }
  }
});

// ============================================
// 3. Custom Image Widget (Ctrl+V support)
// ============================================
const ImageControl = window.createClass({
  handlePaste: function(e) {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const slug = this.props.entry.getIn(['data', 'slug']) || 'temp';
        const timestamp = Date.now();
        const filename = `${slug}_${timestamp}.jpg`;
        
        // Upload to media folder
        this.props.onAddAsset([{
          path: `public/assets/images/posts/${slug}/${filename}`,
          file: blob
        }]);
        
        // Insert markdown
        const imageMarkdown = `![Image](/assets/images/posts/${slug}/${filename})`;
        this.props.onChange(this.props.value + '\n' + imageMarkdown);
        
        e.preventDefault();
      }
    }
  },
  
  render: function() {
    return window.h('div', {
      onPaste: this.handlePaste,
      style: { minHeight: '100px', border: '2px dashed #ccc', padding: '20px' }
    }, 'Paste image here (Ctrl+V)');
  }
});

// Register custom widget
CMS.registerWidget('image-paste', ImageControl);

// ============================================
// 4. Bulk Update Engine
// ============================================
window.bulkUpdatePosts = async function(files) {
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  for (const file of files) {
    try {
      const content = await file.text();
      
      // Extract frontmatter and body
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) {
        results.failed.push({ file: file.name, reason: 'Invalid markdown format' });
        continue;
      }
      
      const frontmatter = match[1];
      const newBody = match[2];
      
      // Parse frontmatter
      const slugMatch = frontmatter.match(/slug:\s*['"]?(\d{3})['"]?/);
      if (!slugMatch) {
        results.failed.push({ file: file.name, reason: 'No slug found' });
        continue;
      }
      
      const slug = slugMatch[1];
      
      // Find existing file
      const existingFiles = await fetch(`/content/blog/`).then(r => r.json());
      const existingFile = existingFiles.find(f => f.includes(`${slug}-`));
      
      if (!existingFile) {
        results.skipped.push({ file: file.name, reason: 'No existing file found' });
        continue;
      }
      
      // Load existing content
      const existingContent = await fetch(`/content/blog/${existingFile}`).then(r => r.text());
      const existingMatch = existingContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      
      if (!existingMatch) {
        results.failed.push({ file: file.name, reason: 'Existing file invalid' });
        continue;
      }
      
      const existingFrontmatter = existingMatch[1];
      const existingBody = existingMatch[2];
      
      // Extract image tags from existing body
      const imageRegex = /!\[.*?\]\(\/assets\/images\/posts\/.*?\)/g;
      const existingImages = existingBody.match(imageRegex) || [];
      
      // Merge: Keep existing frontmatter (date, slug), update title/tags from new file
      const titleMatch = frontmatter.match(/title:\s*['"]?(.*?)['"]?\n/);
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      
      let mergedFrontmatter = existingFrontmatter;
      if (titleMatch) {
        mergedFrontmatter = mergedFrontmatter.replace(/title:.*\n/, `title: "${titleMatch[1]}"\n`);
      }
      if (tagsMatch) {
        mergedFrontmatter = mergedFrontmatter.replace(/tags:.*\n/, `tags: [${tagsMatch[1]}]\n`);
      }
      
      // Merge body: Insert existing images at appropriate positions
      let mergedBody = newBody;
      
      // Strategy: Insert images at paragraph breaks
      const paragraphs = newBody.split('\n\n');
      const imagesPerSection = Math.ceil(existingImages.length / paragraphs.length);
      
      let imageIndex = 0;
      const mergedParagraphs = paragraphs.map(para => {
        if (imageIndex < existingImages.length) {
          const imagesToInsert = existingImages.slice(imageIndex, imageIndex + imagesPerSection);
          imageIndex += imagesPerSection;
          return para + '\n\n' + imagesToInsert.join('\n');
        }
        return para;
      });
      
      mergedBody = mergedParagraphs.join('\n\n');
      
      // Create final content
      const finalContent = `---\n${mergedFrontmatter}\n---\n${mergedBody}`;
      
      // Save to CMS (using Decap CMS API)
      await CMS.getBackend().persistEntry({
        path: `content/blog/${existingFile}`,
        raw: finalContent,
        slug: slug
      });
      
      results.success.push({ file: file.name, slug: slug });
      
    } catch (error) {
      results.failed.push({ file: file.name, reason: error.message });
    }
  }
  
  return results;
};

// Add bulk update UI
CMS.registerAdditionalLink({
  id: 'bulk-update',
  title: 'Bulk Update Posts',
  data: {},
  options: {
    icon: 'upload'
  }
});

console.log('EpicKor Blog Admin - Custom widgets loaded');
