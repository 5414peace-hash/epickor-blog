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

    if (!body || typeof body !== 'string' || !body.trim()) {
      body = getBufferedBody();
    }

    if (!body || typeof body !== 'string' || !body.trim()) {
      return entry;
    }

    // Remove empty lines between two adjacent markdown images.
    body = body.replace(/(\!\[.*?\]\(.*?\))\s*\n\s*\n\s*(\!\[.*?\]\(.*?\))/g, '$1\n$2');
    setBufferedBody(body);

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

    if (!body || typeof body !== 'string' || !body.trim()) {
      body = getBufferedBody();
    }

    if (!tags || !body || typeof body !== 'string' || !body.trim()) {
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

CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    const data = entry.get('data');
    const body = data.get('body');
    const fallback = getBufferedBody();

    if (fallback && typeof fallback === 'string' && fallback.trim()) {
      if (!body || typeof body !== 'string' || body.trim() !== fallback.trim()) {
        return entry.get('data').set('body', fallback);
      }
    }

    if ((!body || typeof body !== 'string' || !body.trim()) && fallback) {
      return entry.get('data').set('body', fallback);
    }

    return entry;
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

function getBufferedBody() {
  if (typeof window.__EPICKOR_BODY_BUFFER === 'string' && window.__EPICKOR_BODY_BUFFER.trim()) {
    return window.__EPICKOR_BODY_BUFFER;
  }

  if (typeof window.__EPICKOR_LAST_MD_BODY === 'string' && window.__EPICKOR_LAST_MD_BODY.trim()) {
    return window.__EPICKOR_LAST_MD_BODY;
  }

  return '';
}

function setBufferedBody(text) {
  const next = typeof text === 'string' ? text : '';
  window.__EPICKOR_BODY_BUFFER = next;
  if (next.trim()) {
    window.__EPICKOR_LAST_MD_BODY = next;
  }
}

function isVisibleElement(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function scoreBodyTextarea(el) {
  if (!el) return -1;

  const name = (el.getAttribute('name') || '').toLowerCase();
  const id = (el.getAttribute('id') || '').toLowerCase();
  const testId = (el.getAttribute('data-testid') || '').toLowerCase();
  const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
  const aria = (el.getAttribute('aria-label') || '').toLowerCase();
  const valueLen = (el.value || '').length;
  const rows = parseInt(el.getAttribute('rows') || '0', 10);

  let score = 0;
  if (name.includes('description') || id.includes('description') || testId.includes('description')) score -= 260;
  if (placeholder.includes('description') || aria.includes('description')) score -= 120;
  if (name === 'body') score += 320;
  if (name.includes('body')) score += 120;
  if (id.includes('body')) score += 120;
  if (testId.includes('body')) score += 100;
  if (placeholder.includes('body')) score += 50;
  if (aria.includes('body')) score += 50;
  if (rows >= 10) score += 40;
  score += Math.min(80, Math.floor(valueLen / 40));
  if (isVisibleElement(el)) score += 30;

  const wrapper = el.closest('section,fieldset,form,div');
  if (wrapper) {
    const labels = Array.from(wrapper.querySelectorAll('label,span,div'));
    if (labels.some((node) => /\bbody\b/i.test((node.textContent || '').trim()))) {
      score += 100;
    }
  }

  return score;
}

function findBodyLabelScope() {
  const labels = Array.from(document.querySelectorAll('label,span,div'));
  const bodyLabel = labels.find((el) => /^body\s*:?\s*$/i.test((el.textContent || '').trim()));
  if (!bodyLabel) return null;
  return bodyLabel.closest('section,fieldset,form,div');
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

  // If body textarea is not mounted but rich editor is visible, click markdown label directly.
  if (!findBodyField({ strict: true })) {
    const mdControl = markdownLabel.closest('button,[role="button"],label,div') || markdownLabel;
    if (mdControl && typeof mdControl.click === 'function') {
      mdControl.click();
    }
  }
}

function findBodyField(options = {}) {
  const strict = !!options.strict;

  const directSelectors = [
    'textarea[name="body"]',
    'textarea[id*="body"]',
    '[data-testid*="body"] textarea',
    'textarea[aria-label*="Body"]',
    'textarea[placeholder*="Body"]'
  ];

  for (const selector of directSelectors) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  const scope = findBodyLabelScope();
  if (scope) {
    const scopedTextarea = scope.querySelector('textarea');
    if (scopedTextarea) return scopedTextarea;

    // In rich mode, body can be contenteditable.
    const scopedEditor = scope.querySelector('[contenteditable="true"][role="textbox"], [data-slate-editor="true"]');
    if (scopedEditor) return scopedEditor;
  }

  if (strict) return null;

  const textareas = Array.from(document.querySelectorAll('textarea'));
  if (textareas.length === 0) return null;

  const ranked = textareas
    .map((el) => ({ el, score: scoreBodyTextarea(el), len: (el.value || '').length }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.len - a.len;
    });

  if (ranked[0] && ranked[0].score >= 40) {
    return ranked[0].el;
  }

  return null;
}

function setBodyValue(bodyText) {
  const textarea = findBodyField({ strict: true });
  if (textarea) {
    setBufferedBody(bodyText || '');
    return setReactLikeValue(textarea, bodyText);
  }

  // Rich text fallback (if markdown textarea has not mounted yet).
  const scope = findBodyLabelScope();
  const editor = scope
    ? scope.querySelector('[contenteditable="true"][role="textbox"], [data-slate-editor="true"]')
    : document.querySelector('[contenteditable="true"][role="textbox"], [data-slate-editor="true"]');
  if (editor) {
    editor.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, bodyText);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    setBufferedBody(bodyText || '');
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
    setBufferedBody(payload.body);
    bodyApplied = setBodyValue(payload.body);
    applied += bodyApplied ? 1 : 0;
  }

  if ((!bodyApplied || applied === 0) && attempt < maxAttempts) {
    setTimeout(() => applyMdPayloadToForm(payload, attempt + 1), 250);
  }

  return applied > 0 && bodyApplied;
}

function lockRichTextMode() {
  const nodes = Array.from(document.querySelectorAll('button,span,div,a,label'));
  const richNode = nodes.find((el) => (el.textContent || '').trim() === 'Rich Text');
  const markdownNode = nodes.find((el) => (el.textContent || '').trim() === 'Markdown');

  if (richNode) {
    const richControl = richNode.closest('button,[role="button"],label,div') || richNode;
    if (richControl && richControl.dataset.epickorRichLock !== 'true') {
      richControl.dataset.epickorRichLock = 'true';
      richControl.style.pointerEvents = 'none';
      richControl.style.opacity = '0.45';
      richControl.style.cursor = 'not-allowed';
      richControl.title = 'Rich Text is disabled to prevent body content loss.';
    }
  }

  if (markdownNode) {
    const markdownControl = markdownNode.closest('button,[role="button"],label,div') || markdownNode;
    if (markdownControl && markdownControl.dataset.epickorMdMarked !== 'true') {
      markdownControl.dataset.epickorMdMarked = 'true';
      markdownControl.style.fontWeight = '700';
    }
  }

  ensureMarkdownMode();
}

let previewRenderTimer = null;
function schedulePreviewRender(delayMs = 60) {
  if (previewRenderTimer) {
    clearTimeout(previewRenderTimer);
  }
  previewRenderTimer = setTimeout(() => {
    previewRenderTimer = null;
    renderForcedPreview();
  }, delayMs);
}

function ensureBodyFieldHydrated() {
  const bodyField = findBodyField({ strict: true });
  if (!bodyField) return false;

  if (typeof bodyField.value === 'string' && bodyField.value.trim()) {
    setBufferedBody(bodyField.value);
    return true;
  }

  const fallback = getBufferedBody();
  if (fallback) {
    setReactLikeValue(bodyField, fallback);
    return true;
  }

  return false;
}

function bindBodyFieldGuard() {
  const bodyField = findBodyField({ strict: true });
  if (!bodyField) return false;

  if (bodyField.dataset.epickorBodyGuardBound === 'true') {
    return true;
  }

  bodyField.dataset.epickorBodyGuardBound = 'true';
  if (bodyField.value && bodyField.value.trim()) {
    setBufferedBody(bodyField.value);
  }

  const updateBuffer = () => {
    if (typeof bodyField.value === 'string' && bodyField.value.trim()) {
      setBufferedBody(bodyField.value);
    }
  };

  bodyField.addEventListener('input', () => {
    updateBuffer();
    schedulePreviewRender(40);
  });
  bodyField.addEventListener('change', () => {
    updateBuffer();
    schedulePreviewRender(40);
  });
  bodyField.addEventListener('paste', () => {
    setTimeout(() => {
      updateBuffer();
      schedulePreviewRender(80);
    }, 40);
  });

  return true;
}

let bodyGuardLoopStarted = false;
function startBodyGuardLoop() {
  if (bodyGuardLoopStarted) return;
  bodyGuardLoopStarted = true;

  setInterval(() => {
    ensureMarkdownMode();
    bindBodyFieldGuard();
    ensureBodyFieldHydrated();
  }, 700);
}

function clearCmsDraftBackups() {
  try {
    const keys = Object.keys(window.localStorage || {});
    keys.forEach((key) => {
      const k = key.toLowerCase();
      const cmsKey = k.includes('decap-cms') || k.includes('netlify-cms');
      const authKey = k.includes('cms-user') || k.endsWith('-user') || k.includes('token');
      const volatileKey = k.includes('backup') || k.includes('draft');

      if (cmsKey && volatileKey && !authKey) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear CMS draft backup cache:', error);
  }
}

window.addEventListener('hashchange', () => {
  if (!window.location.hash.includes('/collections/blog/')) {
    setBufferedBody('');
    clearCmsDraftBackups();
  }
});

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

      setBufferedBody(body);

      const ok = applyMdPayloadToForm(payload);
      if (!ok) {
        alert('MD parsed, but editor fields are not ready yet. Please wait 1-2 seconds and try again.');
      } else {
        schedulePreviewRender(80);
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

function isTextareaField(el) {
  return !!(el && el.tagName && String(el.tagName).toLowerCase() === 'textarea');
}

function insertTextAtCursor(textarea, text) {
  if (!isTextareaField(textarea)) return false;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const original = textarea.value || '';
  const startPos = typeof start === 'number' ? start : original.length;
  const endPos = typeof end === 'number' ? end : original.length;
  const nextValue = original.slice(0, startPos) + text + original.slice(endPos);
  const nextCursor = startPos + text.length;

  setReactLikeValue(textarea, nextValue);
  textarea.selectionStart = nextCursor;
  textarea.selectionEnd = nextCursor;
  return true;
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
  if (!isTextareaField(textarea)) {
    alert('Switch BODY to Markdown mode first.');
    return;
  }

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

  const nextValue = text.slice(0, tagStart) + newTag + text.slice(tagEnd + 1);
  setReactLikeValue(textarea, nextValue);
  textarea.selectionStart = tagStart;
  textarea.selectionEnd = tagStart + newTag.length;
  setBufferedBody(nextValue);
  schedulePreviewRender(40);
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
  ensureMarkdownMode();
  const bodyField = findBodyField({ strict: true });
  if (!bodyField) return false;
  if (!isTextareaField(bodyField)) return false;

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

    btn.addEventListener('click', () => {
      const latestBodyField = findBodyField({ strict: true });
      if (!latestBodyField) return;
      updateNearestImageWidth(latestBodyField, size);
    });
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
      const latestBodyField = findBodyField({ strict: true });
      if (!latestBodyField || !isTextareaField(latestBodyField)) {
        throw new Error('BODY markdown field not found. Keep BODY in Markdown mode.');
      }

      const inserted = insertTextAtCursor(latestBodyField, imgTag);
      if (!inserted) {
        throw new Error('Failed to insert image into BODY. Try switching BODY to Markdown mode.');
      }

      setBufferedBody(latestBodyField.value || '');
      console.log('Clipboard image uploaded:', uploadedPath);
      schedulePreviewRender(40);
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

  const normalized = markdown.replace(/\r\n/g, '\n');
  const blocks = normalized.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
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
    parsed = parsed.replace(/\{\{IMAGE_(\d+)\}\}/g, '<span class="img-placeholder">[IMAGE_$1]</span>');
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
  const iframe = findPreviewIframe();
  if (!iframe) return false;

  const bodyField = findBodyField({ strict: true }) || findBodyField();
  const titleField = findFieldByName('title');
  const title = titleField && titleField.value ? titleField.value.trim() : 'Untitled';
  const bodyFromField = bodyField && typeof bodyField.value === 'string' ? bodyField.value : '';
  if (bodyFromField && bodyFromField.trim()) {
    setBufferedBody(bodyFromField);
  }
  const body = bodyFromField && bodyFromField.trim() ? bodyFromField : getBufferedBody();
  const contentHtml = renderSimpleMarkdownToHtml(body);
  const fallbackHtml = body
    ? `<div class="raw-fallback">${escapeHtml(body).replace(/\n/g, '<br />')}</div>`
    : '<p>(body is empty)</p>';
  const rendered = contentHtml || fallbackHtml;
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
    .raw-fallback { white-space: pre-wrap; font-size: 14px; }
    .img-placeholder { opacity: 0.7; font-size: 12px; padding: 2px 6px; border: 1px dashed #9CA3AF; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="preview-badge">Forced preview sync active (v20260224k)</div>
  <h1>${escapeHtml(title)}</h1>
  ${rendered}
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
  const bodyField = findBodyField({ strict: true });
  if (!bodyField) return false;

  if (bodyField.dataset.forcedPreviewSyncEnabled === 'true') {
    return true;
  }

  bodyField.dataset.forcedPreviewSyncEnabled = 'true';
  const titleField = findFieldByName('title');

  const scheduleRender = () => schedulePreviewRender(60);

  bodyField.addEventListener('input', scheduleRender);
  bodyField.addEventListener('change', scheduleRender);
  bodyField.addEventListener('paste', () => schedulePreviewRender(80));
  if (titleField) {
    titleField.addEventListener('input', scheduleRender);
    titleField.addEventListener('change', scheduleRender);
  }

  scheduleRender();

  console.log('Forced preview sync injected');
  return true;
}

let forcedPreviewTickerStarted = false;
function startForcedPreviewTicker() {
  if (forcedPreviewTickerStarted) return;
  forcedPreviewTickerStarted = true;
  setInterval(() => {
    schedulePreviewRender(10);
  }, 1200);
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
  bindBodyFieldGuard();
  lockRichTextMode();
  injectForcedPreviewSync();
  schedulePreviewRender(40);
});

clearCmsDraftBackups();
bindBodyFieldGuard();
lockRichTextMode();
startBodyGuardLoop();
startForcedPreviewTicker();
schedulePreviewRender(40);

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

console.log('Custom widgets loaded (v5.3.0)');
