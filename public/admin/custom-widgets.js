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

// ============================================
// 5. CLIPBOARD IMAGE PASTE + IN-BODY RESIZE
// ============================================

function getGithubTokenFromLocalStorage() {
  const raw = localStorage.getItem('decap-cms-user') || localStorage.getItem('netlify-cms-user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.backend?.token || parsed?.token || null;
  } catch (error) {
    console.error('Failed to parse CMS auth token:', error);
    return null;
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }

  return btoa(binary);
}

function insertTextAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const original = textarea.value;

  textarea.value = original.slice(0, start) + text + original.slice(end);
  const nextCursor = start + text.length;
  textarea.selectionStart = nextCursor;
  textarea.selectionEnd = nextCursor;

  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
}

function mergeImageStyleWithWidth(style, widthPercent) {
  const sanitized = (style || '')
    .replace(/width\s*:[^;]+;?/gi, '')
    .replace(/max-width\s*:[^;]+;?/gi, '')
    .replace(/height\s*:[^;]+;?/gi, '')
    .trim();

  const base = `width: ${widthPercent}%; max-width: 900px; height: auto;`;
  return sanitized ? `${sanitized}; ${base}` : base;
}

function updateNearestImageWidth(textarea, widthPercent) {
  const text = textarea.value;
  const cursor = textarea.selectionStart;

  const tagStart = text.lastIndexOf('<img', cursor);
  const tagEnd = tagStart >= 0 ? text.indexOf('>', tagStart) : -1;

  if (tagStart < 0 || tagEnd < 0 || cursor > tagEnd + 1) {
    alert('Place the cursor inside an <img ...> tag in the body first.');
    return;
  }

  const oldTag = text.slice(tagStart, tagEnd + 1);
  let newTag = oldTag;

  if (/style="[^"]*"/i.test(oldTag)) {
    newTag = oldTag.replace(/style="([^"]*)"/i, (_, styleText) => {
      return `style="${mergeImageStyleWithWidth(styleText, widthPercent)}"`;
    });
  } else {
    newTag = oldTag.replace('<img', `<img style="${mergeImageStyleWithWidth('', widthPercent)}"`);
  }

  textarea.value = text.slice(0, tagStart) + newTag + text.slice(tagEnd + 1);
  textarea.selectionStart = tagStart;
  textarea.selectionEnd = tagStart + newTag.length;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
}

async function uploadClipboardImageToGithub(file, slug) {
  const token = getGithubTokenFromLocalStorage();
  if (!token) {
    throw new Error('GitHub token not found. Please login to CMS first.');
  }

  const owner = '5414peace-hash';
  const repo = 'epickor-blog';
  const branch = 'master';

  const detectedExt = (file.type && file.type.split('/')[1]) || 'png';
  const ext = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(detectedExt.toLowerCase())
    ? detectedExt.toLowerCase()
    : 'png';

  const filename = `${slug}_${Date.now()}.${ext}`;
  const repoPath = `public/assets/images/posts/${slug}/${filename}`;
  const publicPath = `/assets/images/posts/${slug}/${filename}`;

  const fileBuffer = await file.arrayBuffer();
  const encoded = arrayBufferToBase64(fileBuffer);

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Add pasted image for post ${slug}`,
      content: encoded,
      branch
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `GitHub upload failed (${response.status})`);
  }

  return publicPath;
}

function injectClipboardImageTools() {
  const bodyField = document.querySelector('textarea[name="body"]');
  if (!bodyField) return false;

  if (bodyField.dataset.clipboardImageEnabled === 'true') {
    return true;
  }

  bodyField.dataset.clipboardImageEnabled = 'true';

  const toolbar = document.createElement('div');
  toolbar.id = 'image-resize-toolbar';
  toolbar.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0 12px;
    flex-wrap: wrap;
  `;

  const label = document.createElement('span');
  label.textContent = 'Image size:';
  label.style.cssText = 'font-size: 12px; color: #4b5563; font-weight: 600;';
  toolbar.appendChild(label);

  [50, 70, 100].forEach((size) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${size}%`;
    btn.style.cssText = `
      padding: 4px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 12px;
    `;

    btn.addEventListener('click', () => updateNearestImageWidth(bodyField, size));
    toolbar.appendChild(btn);
  });

  const helper = document.createElement('span');
  helper.textContent = 'Paste image from web: auto-upload + insert at 70% width';
  helper.style.cssText = 'font-size: 12px; color: #6b7280;';
  toolbar.appendChild(helper);

  bodyField.parentNode.insertBefore(toolbar, bodyField);

  bodyField.addEventListener('paste', async (event) => {
    const clipboardItems = Array.from(event.clipboardData?.items || []);
    const imageItem = clipboardItems.find((item) => item.type.startsWith('image/'));

    if (!imageItem) {
      return;
    }

    const slugField = document.querySelector('input[name="slug"]');
    const slug = slugField?.value?.trim();

    if (!slug) {
      event.preventDefault();
      alert('Please set Slug first, then paste images.');
      return;
    }

    const file = imageItem.getAsFile();
    if (!file) {
      event.preventDefault();
      alert('Clipboard image data is empty.');
      return;
    }

    event.preventDefault();

    try {
      const uploadedPath = await uploadClipboardImageToGithub(file, slug);
      const imgTag = `\n\n<img src="${uploadedPath}" alt="${slug} image" style="width: 70%; max-width: 900px; height: auto;" />\n\n`;
      insertTextAtCursor(bodyField, imgTag);
      console.log('Clipboard image uploaded:', uploadedPath);
    } catch (error) {
      console.error('Clipboard image upload failed:', error);
      alert(`Image upload failed: ${error.message}`);
    }
  });

  console.log('!!! CLIPBOARD IMAGE TOOLS INJECTED !!!');
  return true;
}

let clipboardToolsAttempts = 0;
const clipboardToolsInterval = setInterval(() => {
  if (injectClipboardImageTools()) {
    clearInterval(clipboardToolsInterval);
  } else if (clipboardToolsAttempts >= 30) {
    clearInterval(clipboardToolsInterval);
    console.error('!!! CLIPBOARD IMAGE TOOL INJECTION FAILED !!!');
  }

  clipboardToolsAttempts++;
}, 1000);

const clipboardObserver = new MutationObserver(() => {
  injectClipboardImageTools();
});

if (document.body) {
  clipboardObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}
