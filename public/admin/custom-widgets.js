/**
 * EpicKor Blog Admin - Custom Widgets & Enhancements
 * Version: 3.0.0 - Brute Force Edition
 * 
 * Features:
 * 1. MD File Upload Widget (brute force injection)
 * 2. Image Grid Auto-formatting
 * 3. Amazon Links Auto-injection
 * 4. Bulk Manager & Amazon Parser Links
 */

console.log('!!! CUSTOM WIDGETS LOADING !!!');

// ============================================
// 1. MD FILE UPLOAD BUTTON - BRUTE FORCE INJECTION
// ============================================

function injectMDUploadButton() {
  // If button already exists, skip
  if (document.getElementById('md-upload-btn')) {
    return true;
  }

  // Strategy 1: Find Save button and insert before it
  const saveButtons = document.querySelectorAll('button');
  for (const btn of saveButtons) {
    if (btn.textContent.includes('Save') || btn.textContent.includes('저장')) {
      const uploadBtn = createMDUploadButton();
      btn.parentElement.insertBefore(uploadBtn, btn);
      console.log('!!! MD BUTTON DEPLOYED (Strategy 1: Before Save) !!!');
      return true;
    }
  }

  // Strategy 2: Find any header/toolbar and append
  const headers = document.querySelectorAll('header, [role="banner"], [class*="header"], [class*="Header"], [class*="toolbar"], [class*="Toolbar"]');
  for (const header of headers) {
    if (header.querySelector('button')) {
      const uploadBtn = createMDUploadButton();
      header.appendChild(uploadBtn);
      console.log('!!! MD BUTTON DEPLOYED (Strategy 2: In Header) !!!');
      return true;
    }
  }

  // Strategy 3: Find control pane
  const controlPanes = document.querySelectorAll('[class*="control"], [class*="Control"], [class*="pane"], [class*="Pane"]');
  for (const pane of controlPanes) {
    if (pane.querySelector('button')) {
      const uploadBtn = createMDUploadButton();
      pane.appendChild(uploadBtn);
      console.log('!!! MD BUTTON DEPLOYED (Strategy 3: In Control Pane) !!!');
      return true;
    }
  }

  return false;
}

function createMDUploadButton() {
  const uploadBtn = document.createElement('button');
  uploadBtn.id = 'md-upload-btn';
  uploadBtn.type = 'button';
  uploadBtn.textContent = '📄 Upload MD File';
  uploadBtn.style.cssText = `
    margin: 0 10px;
    padding: 10px 20px;
    background-color: #2C2416;
    color: #FAF6F0;
    border: 2px solid #D4A574;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
    z-index: 9999;
  `;
  
  uploadBtn.onmouseover = () => {
    uploadBtn.style.backgroundColor = '#D4A574';
    uploadBtn.style.color = '#2C2416';
  };
  
  uploadBtn.onmouseout = () => {
    uploadBtn.style.backgroundColor = '#2C2416';
    uploadBtn.style.color = '#FAF6F0';
  };
  
  uploadBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown';
    input.onchange = handleMDUpload;
    input.click();
  };
  
  return uploadBtn;
}

// Aggressive retry mechanism
let injectionAttempts = 0;
const maxInjectionAttempts = 30;

const injectionInterval = setInterval(() => {
  if (injectMDUploadButton()) {
    clearInterval(injectionInterval);
    console.log('!!! MD BUTTON INJECTION SUCCESSFUL !!!');
  } else if (injectionAttempts >= maxInjectionAttempts) {
    clearInterval(injectionInterval);
    console.error('!!! MD BUTTON INJECTION FAILED AFTER', maxInjectionAttempts, 'ATTEMPTS !!!');
  }
  injectionAttempts++;
}, 500); // Try every 500ms

// MutationObserver for dynamic content
const observer = new MutationObserver(() => {
  injectMDUploadButton();
});

// Start observing immediately
if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  window.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// ============================================
// 2. MD FILE UPLOAD HANDLER
// ============================================

function handleMDUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  console.log('!!! MD FILE SELECTED:', file.name, '!!!');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    parseMDAndFillForm(content, file.name);
  };
  reader.readAsText(file);
}

function parseMDAndFillForm(content, filename) {
  try {
    console.log('!!! PARSING MD FILE !!!');
    
    // Extract frontmatter and body
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      alert('❌ Invalid markdown format. Please ensure the file has YAML frontmatter.');
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
    
    console.log('!!! PARSED DATA !!!', {title, slug, date, description, tags});
    
    // Fill form fields
    fillFormField('title', title);
    fillFormField('slug', slug);
    fillFormField('date', date);
    fillFormField('description', description);
    fillFormField('body', body);
    
    // Fill tags
    if (tags.length > 0) {
      fillTagsField(tags);
    }
    
    alert(`✅ MD file parsed successfully!\n\nTitle: ${title}\nSlug: ${slug}\nTags: ${tags.join(', ')}`);
    console.log('!!! MD FILE PARSING COMPLETE !!!');
    
  } catch (error) {
    console.error('!!! MD PARSING ERROR !!!', error);
    alert('❌ Error parsing MD file: ' + error.message);
  }
}

function fillFormField(fieldName, value) {
  if (!value) return;
  
  // Try multiple strategies to find and fill the field
  const strategies = [
    () => document.querySelector(`input[id*="${fieldName}"]`),
    () => document.querySelector(`textarea[id*="${fieldName}"]`),
    () => document.querySelector(`input[name="${fieldName}"]`),
    () => document.querySelector(`textarea[name="${fieldName}"]`),
    () => {
      const labels = document.querySelectorAll('label');
      for (const label of labels) {
        if (label.textContent.toLowerCase().includes(fieldName.toLowerCase())) {
          const input = label.nextElementSibling || label.querySelector('input, textarea');
          return input;
        }
      }
      return null;
    }
  ];
  
  for (const strategy of strategies) {
    const field = strategy();
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`!!! FILLED FIELD: ${fieldName} !!!`);
      return;
    }
  }
  
  console.warn(`!!! FIELD NOT FOUND: ${fieldName} !!!`);
}

function fillTagsField(tags) {
  // Decap CMS list widget handling
  setTimeout(() => {
    const addButtons = document.querySelectorAll('button');
    for (const btn of addButtons) {
      if (btn.textContent.includes('Add') && btn.closest('[class*="list"]')) {
        tags.forEach((tag, index) => {
          setTimeout(() => {
            btn.click();
            setTimeout(() => {
              const inputs = document.querySelectorAll('input[type="text"]');
              const lastInput = inputs[inputs.length - 1];
              if (lastInput) {
                lastInput.value = tag;
                lastInput.dispatchEvent(new Event('input', { bubbles: true }));
                lastInput.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }, 100);
          }, index * 200);
        });
        break;
      }
    }
  }, 500);
}

// ============================================
// 3. IMAGE GRID AUTO-FORMATTING
// ============================================

CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    const data = entry.get('data').toJS();
    let body = data.body || '';
    
    // Remove blank lines between images
    body = body.replace(/(\!\[.*?\]\(.*?\))\s*\n\s*\n\s*(\!\[.*?\]\(.*?\))/g, '$1\n$2');
    
    // Auto-inject Amazon links based on tags
    const tags = data.tags || [];
    const relevantTags = ['Shopping', 'Food', 'Fashion', 'Beauty'];
    const hasRelevantTag = tags.some(tag => relevantTags.includes(tag));
    
    if (hasRelevantTag && !body.includes('## 🛒 Shop Related Products')) {
      body += '\n\n## 🛒 Shop Related Products\n\n[Amazon affiliate links will be auto-injected here]';
    }
    
    return entry.get('data').set('body', body);
  }
});

// ============================================
// 4. BULK MANAGER & AMAZON PARSER LINKS
// ============================================

CMS.registerAdditionalLink({
  id: 'bulk-manager',
  title: '📦 Bulk Manager',
  data: '/admin/bulk-update.html',
  options: {
    icon: 'page'
  }
});

CMS.registerAdditionalLink({
  id: 'amazon-parser',
  title: '🔗 Amazon Parser',
  data: '/admin/amazon-parser.html',
  options: {
    icon: 'link'
  }
});

console.log('!!! CUSTOM WIDGETS FULLY LOADED !!!');
console.log('!!! Version: 3.0.0 - Brute Force Edition !!!');
