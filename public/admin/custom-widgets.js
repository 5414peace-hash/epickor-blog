/**
 * EpicKor Blog Admin - Custom Widgets & Enhancements
 * 
 * Features:
 * 1. MD File Upload Widget (auto-parse frontmatter and body)
 * 2. Image Grid Auto-formatting (remove blank lines)
 * 3. Amazon Links Auto-injection
 * 4. Bulk Update Engine
 */

// ============================================
// 1. MD File Upload Widget
// ============================================
CMS.registerEventListener({
  name: 'postPublish',
  handler: ({ entry }) => {
    console.log('Post published:', entry.get('data').toJS());
  }
});

// Add MD Upload button to editor toolbar
window.addEventListener('load', function() {
  // Wait for CMS to fully initialize
  setTimeout(() => {
    const editorToolbar = document.querySelector('.nc-entryEditor-controlPane');
    if (editorToolbar && !document.getElementById('md-upload-btn')) {
      const uploadBtn = document.createElement('button');
      uploadBtn.id = 'md-upload-btn';
      uploadBtn.className = 'nc-button nc-button-primary';
      uploadBtn.textContent = '📄 Upload MD File';
      uploadBtn.style.marginLeft = '10px';
      uploadBtn.style.padding = '8px 16px';
      uploadBtn.style.backgroundColor = '#2C2416';
      uploadBtn.style.color = '#FAF6F0';
      uploadBtn.style.border = 'none';
      uploadBtn.style.borderRadius = '4px';
      uploadBtn.style.cursor = 'pointer';
      uploadBtn.style.fontSize = '14px';
      
      uploadBtn.onclick = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown';
        input.onchange = handleMDUpload;
        input.click();
      };
      
      editorToolbar.appendChild(uploadBtn);
      console.log('MD Upload button added to toolbar');
    }
  }, 2000);
});

function handleMDUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    parseMDAndFillForm(content, file.name);
  };
  reader.readAsText(file);
}

function parseMDAndFillForm(content, filename) {
  try {
    // Extract frontmatter and body
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      alert('Invalid markdown format. Please ensure the file has YAML frontmatter.');
      return;
    }
    
    const frontmatter = match[1];
    const body = match[2].trim();
    
    // Parse frontmatter
    const title = frontmatter.match(/title:\s*['"]?(.*?)['"]?\n/)?.[1] || '';
    const date = frontmatter.match(/date:\s*['"]?(.*?)['"]?\n/)?.[1] || '';
    const description = frontmatter.match(/description:\s*['"]?(.*?)['"]?\n/)?.[1] || '';
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [];
    
    // Extract slug from filename (e.g., "162.md" -> "162")
    const slug = filename.replace(/\.md$/, '').replace(/\.markdown$/, '');
    
    // Fill form fields
    fillFormField('title', title);
    fillFormField('slug', slug);
    fillFormField('date', date);
    fillFormField('description', description);
    fillFormField('body', body);
    
    // Fill tags (list field)
    if (tags.length > 0) {
      fillTagsField(tags);
    }
    
    alert(`MD file parsed successfully!\n\nTitle: ${title}\nSlug: ${slug}\nTags: ${tags.join(', ')}`);
    
  } catch (error) {
    console.error('Failed to parse MD file:', error);
    alert('Failed to parse MD file. Please check the file format.');
  }
}

function fillFormField(fieldName, value) {
  // Try different selectors for Decap CMS form fields
  const selectors = [
    `input[name="${fieldName}"]`,
    `textarea[name="${fieldName}"]`,
    `[data-field-name="${fieldName}"] input`,
    `[data-field-name="${fieldName}"] textarea`,
    `.nc-controlPane-widget[data-field-name="${fieldName}"] input`,
    `.nc-controlPane-widget[data-field-name="${fieldName}"] textarea`
  ];
  
  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field) {
      field.value = value;
      // Trigger change event
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`Filled field: ${fieldName} = ${value}`);
      return;
    }
  }
  
  console.warn(`Field not found: ${fieldName}`);
}

function fillTagsField(tags) {
  // Tags are typically in a list widget
  // This is a simplified approach - may need adjustment based on actual CMS structure
  const tagsInput = document.querySelector('[data-field-name="tags"] input');
  if (tagsInput) {
    tags.forEach(tag => {
      tagsInput.value = tag;
      tagsInput.dispatchEvent(new Event('input', { bubbles: true }));
      tagsInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
  }
}

// ============================================
// 2. Image Grid Auto-formatting
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
// 3. Amazon Links Auto-injection
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
// 4. Custom Image Widget (Ctrl+V support)
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
// 5. Bulk Update Engine
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

// Add Bulk Manager to main menu
CMS.registerAdditionalLink({
  id: 'bulk-manager',
  title: '📦 Bulk Manager',
  data: '/admin/bulk-update.html',
  options: {
    icon: 'upload'
  }
});

// Add Amazon Parser to main menu
CMS.registerAdditionalLink({
  id: 'amazon-parser',
  title: '🔗 Amazon Parser',
  data: '/admin/amazon-parser.html',
  options: {
    icon: 'link'
  }
});

console.log('EpicKor Blog Admin - Custom widgets loaded (with MD Upload)');
