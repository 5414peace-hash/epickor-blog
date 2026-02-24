// Version: 5.0.0 - Stable MD Import + Clipboard Images
// EpicKor Blog Admin - Custom Widgets

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

    // Remove empty lines between two adjacent markdown images.
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

    const relevantTags = ['Shopping', 'Food', 'Fashion', 'Beauty'];
    const hasRelevantTag = tags.some((tag) => relevantTags.includes(tag));

    if (!hasRelevantTag) {
      return entry;
    }

    if (body.includes('## Related Amazon Products')) {
      return entry;
    }

    try {
      const response = await fetch('/content/data/amazon-links.json');
      const amazonLinks = await response.json();

      const matchingLinks = amazonLinks
        .filter((link) => tags.includes(link.category))
        .slice(0, 3);

      if (matchingLinks.length === 0) {
        return entry;
      }

      let amazonSection = '\n\n---\n\n## Related Amazon Products\n\n';
      matchingLinks.forEach((link) => {
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
// 3. SHARED DOM HELPERS
// ============================================

function setReactLikeValue(field, value) {
  if (!field) return false;

  const proto = Object.getPrototypeOf(field);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');

  if (descriptor && descriptor.set) {
    descriptor.set.call(field, value);
  } else {
    field.value = value;
  }

  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function findFieldByName(name) {
  const selectors = [
    `input[name="${name}"]`,
    `textarea[name="${name}"]`,
    `select[name="${name}"]`,
    `input[id*="${name}"]`,
    `textarea[id*="${name}"]`,
    `select[id*="${name}"]`,
    `[data-testid*="${name}"] input`,
    `[data-testid*="${name}"] textarea`,
    `[data-testid*="${name}"] select`
  ];

  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  return null;
}

function parseSimpleFrontmatter(frontmatterText) {
  const result = {};
  const lines = frontmatterText.split('\n');
  let activeListKey = null;

  const stripQuotes = (v) => (typeof v === 'string' ? v.replace(/^['"]|['"]$/g, '').trim() : '');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const listMatch = line.match(/^-\s*(.+)$/);
    if (listMatch && activeListKey) {
      if (!Array.isArray(result[activeListKey])) result[activeListKey] = [];
      result[activeListKey].push(stripQuotes(listMatch[1]));
      continue;
    }

    activeListKey = null;

    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1];
    const rawValue = kvMatch[2];

    const inlineListMatch = rawValue.match(/^\[(.*)\]$/);
    if (inlineListMatch) {
      const listRaw = inlineListMatch[1].trim();
      result[key] = listRaw ? listRaw.split(',').map((v) => stripQuotes(v)) : [];
      continue;
    }

    if (rawValue === '') {
      result[key] = [];
      activeListKey = key;
      continue;
    }

    result[key] = stripQuotes(rawValue);
  }

  return result;
}

function generateDescriptionFromBody(body) {
  if (!body || typeof body !== 'string') return '';

  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\{\{IMAGE_\d+\}\}/g, ' ')
    .replace(/[#>*`_~[\]\(\)-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return '';
  return plain.slice(0, 220);
}

function ensureMarkdownMode() {
  const markdownLabel = Array.from(document.querySelectorAll('span,label,button'))
    .find((el) => (el.textContent || '').trim() === 'Markdown');
  if (!markdownLabel) return;

  // Prefer the nearest switch/toggle in the same control group.
  const container = markdownLabel.closest('div');
  const toggle = container
    ? container.querySelector('input[type="checkbox"],button[role="switch"],[role="switch"]')
    : document.querySelector('input[type="checkbox"],button[role="switch"],[role="switch"]');

  if (!toggle) return;

  const ariaChecked = toggle.getAttribute('aria-checked');
  const checked = Object.prototype.hasOwnProperty.call(toggle, 'checked') ? !!toggle.checked : null;

  // In this editor, checked/true means Rich Text mode is active.
  if (checked === true || ariaChecked === 'true') {
    toggle.click();
  }
}

function findBodyField() {
  const direct = [
    'textarea[name="body"]',
    'textarea[id*="body"]',
    '[data-testid*="body"] textarea',
    'textarea[aria-label*="Body"]',
    'textarea[placeholder*="Body"]'
  ];

  for (const selector of direct) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  // Fallback: find section by visible BODY label.
  const bodyLabel = Array.from(document.querySelectorAll('label,span,div'))
    .find((el) => (el.textContent || '').trim() === 'BODY');

  if (bodyLabel) {
    let scope = bodyLabel.closest('section,fieldset,form,div');
    let depth = 0;
    while (scope && depth < 4) {
      const textarea = scope.querySelector('textarea');
      if (textarea) return textarea;
      scope = scope.parentElement;
      depth += 1;
    }
  }

  return null;
}

function setBodyValue(bodyText) {
  const textarea = findBodyField();
  if (textarea) {
    return setReactLikeValue(textarea, bodyText);
  }

  // Rich text fallback (if markdown textarea has not mounted yet).
  const editor = document.querySelector('[contenteditable="true"][role="textbox"], [data-slate-editor="true"]');
  if (editor) {
    editor.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, bodyText);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  return false;
}

function applyMdPayloadToForm(payload, attempt = 0) {
  const maxAttempts = 20;
  let applied = 0;

  const titleField = findFieldByName('title');
  if (titleField && payload.title) applied += setReactLikeValue(titleField, payload.title) ? 1 : 0;

  const slugField = findFieldByName('slug');
  if (slugField && payload.slug) applied += setReactLikeValue(slugField, payload.slug) ? 1 : 0;

  const dateField = findFieldByName('date');
  if (dateField && payload.date) applied += setReactLikeValue(dateField, payload.date) ? 1 : 0;

  const descField = findFieldByName('description');
  if (descField && payload.description) applied += setReactLikeValue(descField, payload.description) ? 1 : 0;

  const visibilityField = findFieldByName('visibility');
  if (visibilityField && payload.visibility) applied += setReactLikeValue(visibilityField, payload.visibility) ? 1 : 0;

  const publishAtField = findFieldByName('publishAt');
  if (publishAtField && payload.publishAt) applied += setReactLikeValue(publishAtField, payload.publishAt) ? 1 : 0;

  // List widget can vary, so this is best-effort.
  const tagsField = findFieldByName('tags');
  if (tagsField && Array.isArray(payload.tags) && payload.tags.length > 0) {
    applied += setReactLikeValue(tagsField, payload.tags.join(', ')) ? 1 : 0;
  }

  ensureMarkdownMode();

  let bodyApplied = false;
  if (payload.body) {
    window.__EPICKOR_LAST_MD_BODY = payload.body;
    bodyApplied = setBodyValue(payload.body);
    applied += bodyApplied ? 1 : 0;
  }

  if ((!bodyApplied || applied === 0) && attempt < maxAttempts) {
    setTimeout(() => applyMdPayloadToForm(payload, attempt + 1), 250);
  }

  return applied > 0 && bodyApplied;
}

// ============================================
// 4. MD FILE UPLOAD WIDGET
// ============================================

function injectMDUploadButton() {
  if (document.getElementById('md-upload-btn')) {
    return true;
  }

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

  const uploadBtn = document.createElement('button');
  uploadBtn.id = 'md-upload-btn';
  uploadBtn.type = 'button';
  uploadBtn.textContent = 'Upload MD File';
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

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.md,.markdown';
  fileInput.style.display = 'none';

  fileInput.onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const text = (await file.text()).replace(/^\uFEFF/, '');
      const frontmatterMatch = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);

      if (!frontmatterMatch) {
        alert('No frontmatter found in MD file.');
        return;
      }

      const frontmatter = frontmatterMatch[1];
      const body = frontmatterMatch[2].trim();
      const parsed = parseSimpleFrontmatter(frontmatter);
      const filenameSlug = file.name.replace(/\.(md|markdown)$/i, '');

      const payload = {
        title: parsed.title || '',
        slug: parsed.slug || filenameSlug,
        date: parsed.date || '',
        description: parsed.description || generateDescriptionFromBody(body),
        visibility: parsed.visibility || 'private',
        publishAt: parsed.publishAt || '',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        body
      };

      window.__EPICKOR_LAST_MD_BODY = body;

      const ok = applyMdPayloadToForm(payload);
      if (!ok) {
        alert('MD parsed, but editor fields are not ready yet. Please wait 1-2 seconds and try again.');
      } else {
        alert(`MD loaded. Slug: ${payload.slug}`);
      }
    } catch (error) {
      console.error('MD parsing error:', error);
      alert(`Failed to parse MD file: ${error.message}`);
    }
  };

  uploadBtn.onclick = () => fileInput.click();

  toolbar.appendChild(fileInput);
  toolbar.appendChild(uploadBtn);

  console.log('MD upload button injected');
  return true;
}

let mdButtonAttempts = 0;
const mdButtonInterval = setInterval(() => {
  if (injectMDUploadButton()) {
    clearInterval(mdButtonInterval);
  } else if (mdButtonAttempts >= 30) {
    clearInterval(mdButtonInterval);
    console.error('MD upload button injection failed');
  }
  mdButtonAttempts++;
}, 1000);

// ============================================
// 5. SIDEBAR MENU INTEGRATION
// ============================================

function addSidebarMenuItems() {
  if (document.getElementById('custom-bulk-manager-link')) {
    return true;
  }

  const navList = document.querySelector('nav ul, aside ul, [class*="sidebar"] ul, [class*="SidebarContainer"] ul');
  if (!navList) {
    return false;
  }

  const bulkLi = document.createElement('li');
  bulkLi.id = 'custom-bulk-manager-li';

  const bulkLink = document.createElement('a');
  bulkLink.id = 'custom-bulk-manager-link';
  bulkLink.href = '/admin/bulk-update.html';
  bulkLink.target = '_blank';
  bulkLink.textContent = 'Bulk Manager';

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

  const parserLi = document.createElement('li');
  parserLi.id = 'custom-amazon-parser-li';

  const parserLink = document.createElement('a');
  parserLink.id = 'custom-amazon-parser-link';
  parserLink.href = '/admin/amazon-parser.html';
  parserLink.target = '_blank';
  parserLink.textContent = 'Amazon Parser';
  parserLink.style.cssText = bulkLink.style.cssText;

  parserLi.appendChild(parserLink);

  navList.appendChild(bulkLi);
  navList.appendChild(parserLi);

  console.log('Sidebar custom menu injected');
  return true;
}

let sidebarAttempts = 0;
const sidebarInterval = setInterval(() => {
  if (addSidebarMenuItems()) {
    clearInterval(sidebarInterval);
  } else if (sidebarAttempts >= 30) {
    clearInterval(sidebarInterval);
    console.error('Sidebar menu injection failed');
  }
  sidebarAttempts++;
}, 1000);

// ============================================
// 6. CLIPBOARD IMAGE PASTE + IN-BODY RESIZE
// ============================================

function getGithubTokenFromLocalStorage() {
  const raw = localStorage.getItem('decap-cms-user') || localStorage.getItem('netlify-cms-user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed && (parsed.backend && parsed.backend.token ? parsed.backend.token : parsed.token);
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
    throw new Error((errorData && errorData.message) || `GitHub upload failed (${response.status})`);
  }

  return publicPath;
}

function injectClipboardImageTools() {
  const bodyField = findFieldByName('body');
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
    const clipboardItems = Array.from((event.clipboardData && event.clipboardData.items) || []);
    const imageItem = clipboardItems.find((item) => item.type.startsWith('image/'));

    if (!imageItem) {
      return;
    }

    const slugField = findFieldByName('slug');
    const slug = slugField && slugField.value ? slugField.value.trim() : '';

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

  console.log('Clipboard image tools injected');
  return true;
}

let clipboardToolsAttempts = 0;
const clipboardToolsInterval = setInterval(() => {
  if (injectClipboardImageTools()) {
    clearInterval(clipboardToolsInterval);
  } else if (clipboardToolsAttempts >= 30) {
    clearInterval(clipboardToolsInterval);
    console.error('Clipboard image tool injection failed');
  }

  clipboardToolsAttempts++;
}, 1000);

// ============================================
// 7. FORCED RIGHT-PREVIEW SYNC (iframe fallback)
// ============================================

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSimpleMarkdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  const blocks = markdown.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const html = blocks.map((block) => {
    // Keep trusted raw HTML blocks as-is (used for image layout wrappers).
    if (/^<[^>]+>[\s\S]*<\/[^>]+>$/.test(block) || /^<img[\s\S]*\/?>$/i.test(block)) {
      return block;
    }

    const headingMatch = block.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = escapeHtml(headingMatch[2]);
      return `<h${level}>${text}</h${level}>`;
    }

    let parsed = escapeHtml(block);
    parsed = parsed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/\n/g, '<br />');
    return `<p>${parsed}</p>`;
  });

  return html.join('\n');
}

function findPreviewIframe() {
  const iframes = Array.from(document.querySelectorAll('iframe'));
  if (!iframes.length) return null;

  const candidates = iframes
    .map((iframe) => {
      const rect = iframe.getBoundingClientRect();
      return {
        iframe,
        area: Math.max(0, rect.width) * Math.max(0, rect.height),
      };
    })
    .sort((a, b) => b.area - a.area);

  for (const candidate of candidates) {
    try {
      if (candidate.iframe && candidate.iframe.contentDocument) {
        return candidate.iframe;
      }
    } catch (_error) {
      // Cross-origin iframe, skip.
    }
  }

  return null;
}

function renderForcedPreview() {
  const bodyField = findFieldByName('body');
  if (!bodyField) return false;

  const iframe = findPreviewIframe();
  if (!iframe) return false;

  const titleField = findFieldByName('title');
  const title = titleField && titleField.value ? titleField.value.trim() : 'Untitled';
  const body = bodyField.value || '';
  const contentHtml = renderSimpleMarkdownToHtml(body);
  const hash = `${title}::${body.length}::${body.slice(0, 80)}`;

  if (iframe.dataset.forcedPreviewHash === hash) {
    return true;
  }

  try {
    const doc = iframe.contentDocument;
    if (!doc) return false;

    doc.open();
    doc.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Noto Serif KR', serif; line-height: 1.8; color: #2C2416; background: #FAF6F0; padding: 1.5rem; margin: 0; }
    h1,h2,h3,h4,h5,h6 { font-family: 'Noto Sans KR', sans-serif; color: #2C2416; margin-top: 1.4rem; margin-bottom: 0.8rem; }
    h1 { font-size: 2.2rem; border-bottom: 3px solid #E85A4F; padding-bottom: 0.4rem; margin-top: 0; }
    p { margin-bottom: 1rem; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem auto; display: block; }
    .image-grid-2up { display: flex; gap: 0.6rem; margin: 1.2rem 0; }
    .image-grid-2up img { width: 48%; margin: 0; }
    .preview-badge { font-size: 11px; opacity: 0.65; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="preview-badge">Forced preview sync active (v20260224e)</div>
  <h1>${escapeHtml(title)}</h1>
  ${contentHtml}
</body>
</html>`);
    doc.close();

    iframe.dataset.forcedPreviewHash = hash;
    return true;
  } catch (error) {
    console.error('Forced preview render failed:', error);
    return false;
  }
}

function injectForcedPreviewSync() {
  const bodyField = findFieldByName('body');
  if (!bodyField) return false;

  if (bodyField.dataset.forcedPreviewSyncEnabled === 'true') {
    return true;
  }

  bodyField.dataset.forcedPreviewSyncEnabled = 'true';
  const titleField = findFieldByName('title');

  const scheduleRender = () => {
    setTimeout(renderForcedPreview, 60);
  };

  bodyField.addEventListener('input', scheduleRender);
  bodyField.addEventListener('change', scheduleRender);
  if (titleField) {
    titleField.addEventListener('input', scheduleRender);
    titleField.addEventListener('change', scheduleRender);
  }

  // Initial and periodic refresh to follow CMS re-renders.
  scheduleRender();
  setInterval(renderForcedPreview, 1200);

  console.log('Forced preview sync injected');
  return true;
}

let forcedPreviewAttempts = 0;
const forcedPreviewInterval = setInterval(() => {
  if (injectForcedPreviewSync()) {
    clearInterval(forcedPreviewInterval);
  } else if (forcedPreviewAttempts >= 30) {
    clearInterval(forcedPreviewInterval);
    console.error('Forced preview sync injection failed');
  }
  forcedPreviewAttempts++;
}, 1000);

// ============================================
// 8. DOM OBSERVER
// ============================================

const observer = new MutationObserver(() => {
  addSidebarMenuItems();
  injectMDUploadButton();
  injectClipboardImageTools();
  injectForcedPreviewSync();
  renderForcedPreview();
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

console.log('Custom widgets loaded (v5.1.0)');
