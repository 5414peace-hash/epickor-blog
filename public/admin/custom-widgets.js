// Version: 4.0.0 - Native Sidebar Integration
// EpicKor Blog Admin - Custom Widgets
// Features: Image Grid Auto-formatting, Amazon Links Auto-injection, MD Upload, Bulk Manager, Amazon Parser

// ============================================
// 1. IMAGE GRID AUTO-FORMATTING (preSave)
// ============================================

CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    const data = entry.get('data');
    let body = data.get('body');
    
    if (!body || typeof body !== 'string') {
      return entry;
    }

    // Remove empty lines between images
    body = body.replace(/(\!\[.*?\]\(.*?\))\s*\n\s*\n\s*(\!\[.*?\]\(.*?\))/g, '$1\n$2');
    
    return entry.get('data').set('body', body);
  }
});

// ============================================
// 2. AMAZON LINKS AUTO-INJECTION (preSave)
// ============================================

CMS.registerEventListener({
  name: 'preSave',
  handler: async ({ entry }) => {
    const data = entry.get('data');
    const tags = data.get('tags');
    let body = data.get('body');
    
    if (!tags || !body || typeof body !== 'string') {
      return entry;
    }

    // Check if tags include Shopping, Food, Fashion, or Beauty
    const relevantTags = ['Shopping', 'Food', 'Fashion', 'Beauty'];
    const hasRelevantTag = tags.some(tag => relevantTags.includes(tag));
    
    if (!hasRelevantTag) {
      return entry;
    }

    // Check if Amazon links section already exists
    if (body.includes('## 🛒 Related Amazon Products')) {
      return entry;
    }

    // Fetch Amazon links from JSON
    try {
      const response = await fetch('/content/data/amazon-links.json');
      const amazonLinks = await response.json();
      
      // Filter links by category
      const matchingLinks = amazonLinks.filter(link => 
        tags.includes(link.category)
      ).slice(0, 3); // Limit to 3 links
      
      if (matchingLinks.length === 0) {
        return entry;
      }

      // Generate Amazon links section
      let amazonSection = '\n\n---\n\n## 🛒 Related Amazon Products\n\n';
      matchingLinks.forEach(link => {
        amazonSection += `### [${link.name}](${link.url})\n`;
        amazonSection += `**${link.price}** - ${link.description}\n\n`;
        if (link.image) {
          amazonSection += `![${link.name}](${link.image})\n\n`;
        }
      });
      
      body += amazonSection;
      
      return entry.get('data').set('body', body);
    } catch (error) {
      console.error('Failed to fetch Amazon links:', error);
      return entry;
    }
  }
});

// ============================================
// 3. MD FILE UPLOAD WIDGET
// ============================================

function injectMDUploadButton() {
  // Check if button already exists
  if (document.getElementById('md-upload-btn')) {
    return true;
  }

  // Try multiple selectors for editor toolbar
  const toolbarSelectors = [
    '[class*="ControlPane"]',
    '[class*="toolbar"]',
    '[class*="EditorControl"]',
    'div[class*="Editor"] > div:first-child',
    'form > div:first-child'
  ];

  let toolbar = null;
  for (const selector of toolbarSelectors) {
    toolbar = document.querySelector(selector);
    if (toolbar) break;
  }

  if (!toolbar) {
    return false;
  }

  // Create MD upload button
  const uploadBtn = document.createElement('button');
  uploadBtn.id = 'md-upload-btn';
  uploadBtn.type = 'button';
  uploadBtn.textContent = '📄 Upload MD File';
  uploadBtn.style.cssText = `
    margin-left: 10px;
    padding: 8px 16px;
    background-color: #2C2416;
    color: #FAF6F0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  `;
  
  uploadBtn.onmouseover = () => {
    uploadBtn.style.backgroundColor = '#D4A574';
    uploadBtn.style.color = '#2C2416';
  };
  
  uploadBtn.onmouseout = () => {
    uploadBtn.style.backgroundColor = '#2C2416';
    uploadBtn.style.color = '#FAF6F0';
  };

  // Create hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.md,.markdown';
  fileInput.style.display = 'none';

  // Handle file selection
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      // Parse frontmatter
      const frontmatterMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
      
      if (!frontmatterMatch) {
        alert('No frontmatter found in MD file');
        return;
      }

      const frontmatter = frontmatterMatch[1];
      const body = frontmatterMatch[2].trim();

      // Extract fields from frontmatter
      const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
      const dateMatch = frontmatter.match(/date:\s*["']?(.+?)["']?\s*$/m);
      const tagsMatch = frontmatter.match(/tags:\s*\[(.+?)\]/);
      const descMatch = frontmatter.match(/description:\s*["']?(.+?)["']?\s*$/m);

      // Extract slug from filename (e.g., "162.md" -> "162")
      const slug = file.name.replace(/\.md$/, '');

      // Fill form fields
      const setFieldValue = (selector, value) => {
        const field = document.querySelector(selector);
        if (field) {
          field.value = value;
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };

      if (titleMatch) setFieldValue('input[name="title"]', titleMatch[1]);
      if (dateMatch) setFieldValue('input[name="date"]', dateMatch[1]);
      if (descMatch) setFieldValue('textarea[name="description"]', descMatch[1]);
      setFieldValue('input[name="slug"]', slug);

      // Set tags (if field exists)
      if (tagsMatch) {
        const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, ''));
        // Try to set tags field (implementation depends on Decap CMS widget)
        const tagsField = document.querySelector('[name="tags"]');
        if (tagsField) {
          tagsField.value = tags.join(', ');
          tagsField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      // Set body
      const bodyField = document.querySelector('textarea[name="body"]');
      if (bodyField) {
        bodyField.value = body;
        bodyField.dispatchEvent(new Event('input', { bubbles: true }));
        bodyField.dispatchEvent(new Event('change', { bubbles: true }));
      }

      alert(`✅ MD file parsed successfully!\nSlug: ${slug}\nTitle: ${titleMatch ? titleMatch[1] : 'N/A'}`);
      
    } catch (error) {
      console.error('MD parsing error:', error);
      alert('❌ Failed to parse MD file: ' + error.message);
    }
  };

  uploadBtn.onclick = () => fileInput.click();

  toolbar.appendChild(fileInput);
  toolbar.appendChild(uploadBtn);

  console.log('!!! MD UPLOAD BUTTON INJECTED !!!');
  return true;
}

// Try to inject MD upload button with retries
let mdButtonAttempts = 0;
const mdButtonInterval = setInterval(() => {
  if (injectMDUploadButton()) {
    clearInterval(mdButtonInterval);
  } else if (mdButtonAttempts >= 30) {
    clearInterval(mdButtonInterval);
    console.error('!!! MD UPLOAD BUTTON INJECTION FAILED !!!');
  }
  mdButtonAttempts++;
}, 1000);

// ============================================
// 4. SIDEBAR MENU INTEGRATION (NATIVE STYLE)
// ============================================

function addSidebarMenuItems() {
  // Check if already added
  if (document.getElementById('custom-bulk-manager-link')) {
    return true;
  }

  // Find sidebar nav list
  const navList = document.querySelector('nav ul, aside ul, [class*="sidebar"] ul, [class*="SidebarContainer"] ul');
  
  if (!navList) {
    return false;
  }

  // Create Bulk Manager menu item
  const bulkLi = document.createElement('li');
  bulkLi.id = 'custom-bulk-manager-li';
  
  const bulkLink = document.createElement('a');
  bulkLink.id = 'custom-bulk-manager-link';
  bulkLink.href = '/admin/bulk-update.html';
  bulkLink.target = '_blank';
  bulkLink.textContent = '📦 Bulk Manager';
  
  // Copy styles from existing menu items
  const existingLink = navList.querySelector('a');
  if (existingLink) {
    const computedStyle = window.getComputedStyle(existingLink);
    bulkLink.style.cssText = `
      display: ${computedStyle.display};
      padding: ${computedStyle.padding};
      color: ${computedStyle.color};
      text-decoration: ${computedStyle.textDecoration};
      font-size: ${computedStyle.fontSize};
      font-weight: ${computedStyle.fontWeight};
      transition: all 0.2s;
    `;
  }
  
  bulkLi.appendChild(bulkLink);

  // Create Amazon Parser menu item
  const parserLi = document.createElement('li');
  parserLi.id = 'custom-amazon-parser-li';
  
  const parserLink = document.createElement('a');
  parserLink.id = 'custom-amazon-parser-link';
  parserLink.href = '/admin/amazon-parser.html';
  parserLink.target = '_blank';
  parserLink.textContent = '🔗 Amazon Parser';
  parserLink.style.cssText = bulkLink.style.cssText;
  
  parserLi.appendChild(parserLink);

  // Append to nav list
  navList.appendChild(bulkLi);
  navList.appendChild(parserLi);

  console.log('!!! SIDEBAR MENU ITEMS ADDED !!!');
  return true;
}

// Try to add sidebar menu items with retries
let sidebarAttempts = 0;
const sidebarInterval = setInterval(() => {
  if (addSidebarMenuItems()) {
    clearInterval(sidebarInterval);
  } else if (sidebarAttempts >= 30) {
    clearInterval(sidebarInterval);
    console.error('!!! SIDEBAR MENU INJECTION FAILED !!!');
  }
  sidebarAttempts++;
}, 1000);

// Observe DOM changes to re-inject if needed
const observer = new MutationObserver(() => {
  addSidebarMenuItems();
  injectMDUploadButton();
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

console.log('!!! CUSTOM WIDGETS FULLY LOADED !!!');
console.log('!!! Version: 4.0.0 - Native Sidebar Integration !!!');
