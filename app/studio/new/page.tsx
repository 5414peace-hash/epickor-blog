'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildMarkdownContent,
  parseMarkdownFileContent,
  type ParsedMdPayload,
} from '@/lib/studio-markdown';

interface AmazonProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  url: string;
  category: string;
  image: string;
}

const GITHUB_OWNER = '5414peace-hash';
const GITHUB_REPO = 'epickor-blog';
const GITHUB_BRANCH = 'master';

const INITIAL_FORM: ParsedMdPayload = {
  title: '',
  slug: '',
  date: new Date().toISOString().slice(0, 10),
  visibility: 'public',
  publishAt: '',
  description: '',
  ogImage: '',
  tags: [],
  author: 'EpicKor',
  body: '',
};

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isImagePlaceholderToken(src: string): boolean {
  const trimmed = String(src || '').trim();
  if (!trimmed) return true;

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch (_e) {
    // Keep original.
  }

  return /\{\{[^}]+\}\}/.test(decoded);
}

function renderInlineMarkdown(text: string): string {
  let parsed = escapeHtml(text);

  parsed = parsed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_full, altRaw, srcRaw) => {
    const alt = String(altRaw || '');
    const src = String(srcRaw || '').trim();
    if (!src || isImagePlaceholderToken(src)) {
      return `<code>${escapeHtml(src || '{{image-placeholder}}')}</code>`;
    }
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />`;
  });

  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_full, labelRaw, hrefRaw) => {
    const label = escapeHtml(String(labelRaw || 'link'));
    const href = escapeHtml(String(hrefRaw || '#').trim() || '#');
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  parsed = parsed.replace(/`([^`]+)`/g, '<code>$1</code>');
  return parsed;
}

function renderSimpleMarkdownToHtml(markdown: string): string {
  if (!markdown.trim()) return '<p>(body is empty)</p>';

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];
  let paragraphLines: string[] = [];
  let unorderedItems: string[] = [];
  let orderedItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    htmlParts.push(`<p>${paragraphLines.map((line) => renderInlineMarkdown(line)).join('<br />')}</p>`);
    paragraphLines = [];
  };

  const flushUnordered = () => {
    if (!unorderedItems.length) return;
    htmlParts.push(`<ul>${unorderedItems.map((line) => `<li>${renderInlineMarkdown(line)}</li>`).join('')}</ul>`);
    unorderedItems = [];
  };

  const flushOrdered = () => {
    if (!orderedItems.length) return;
    htmlParts.push(`<ol>${orderedItems.map((line) => `<li>${renderInlineMarkdown(line)}</li>`).join('')}</ol>`);
    orderedItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine || '';
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushUnordered();
      flushOrdered();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushUnordered();
      flushOrdered();
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      flushUnordered();
      flushOrdered();
      htmlParts.push('<hr />');
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushOrdered();
      unorderedItems.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushUnordered();
      orderedItems.push(orderedMatch[1]);
      continue;
    }

    flushUnordered();
    flushOrdered();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushUnordered();
  flushOrdered();

  return htmlParts.join('\n');
}

function extractGithubTokenFromStorage(): string {
  const tryKeys = ['decap-cms-user', 'netlify-cms-user'];
  for (const key of tryKeys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as {
        token?: string;
        access_token?: string;
        backend?: { token?: string; access_token?: string };
      };
      const token =
        parsed.backend?.token ||
        parsed.backend?.access_token ||
        parsed.token ||
        parsed.access_token ||
        '';
      if (token) return token;
    } catch (_e) {
      // ignore parse errors
    }
  }
  return '';
}

function parseTags(tagsRaw: string): string[] {
  return tagsRaw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function sanitizeBodyBeforePublish(body: string): string {
  if (!body) return '';

  const removedTokenImages = body.replace(
    /!\[[^\]]*\]\((%7B%7B[^)]+%7D%7D|\{\{[^)]+\}\})\)/gi,
    ''
  );
  const removedTokenLines = removedTokenImages.replace(
    /^\s*\{\{\s*IMAGE[_-]?\d+\s*\}\}\s*$/gim,
    ''
  );

  return removedTokenLines.replace(/\n{3,}/g, '\n\n').trim();
}

function buildAmazonSnippet(product: AmazonProduct): string {
  const safeName = product.name || 'Amazon Product';
  const safeUrl = product.url || '#';
  const priceLine = product.price ? `- Price: ${product.price}\n` : '';
  return ['', '### Recommended Product', `- [${safeName}](${safeUrl})`, priceLine.trimEnd(), '']
    .filter((line) => line !== '')
    .join('\n');
}

function chooseRandomProduct(products: AmazonProduct[]): AmazonProduct | null {
  if (!products.length) return null;
  const index = Math.floor(Math.random() * products.length);
  return products[index] || null;
}

function compactText(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, 220);
}

async function parseJsonResponse<T>(response: Response, context: string): Promise<T> {
  const text = await response.text();
  try {
    return (text ? JSON.parse(text) : {}) as T;
  } catch (_e) {
    throw new Error(`${context} returned non-JSON (${response.status}): ${compactText(text) || 'empty response'}`);
  }
}

function resolveImageExtension(file: File): string {
  const nameExt = (file.name.split('.').pop() || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(nameExt)) return nameExt;

  const mimeExt = (file.type.split('/').pop() || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(mimeExt)) return mimeExt;

  return 'png';
}

function encodeUtf8Base64(value: string): string {
  return btoa(unescape(encodeURIComponent(value)));
}

function encodeBufferBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function getGithubFileSha(path: string, token: string): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
  const response = await fetch(url, { headers: githubHeaders(token) });
  if (response.status === 404) return undefined;

  const json = await parseJsonResponse<{ sha?: string; message?: string }>(
    response,
    'GitHub file lookup'
  );
  if (!response.ok) {
    throw new Error(json.message || `GitHub file lookup failed (${response.status}).`);
  }
  return json.sha;
}

async function putGithubFile(
  path: string,
  token: string,
  contentBase64: string,
  message: string
): Promise<void> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const sha = await getGithubFileSha(path, token);

  const response = await fetch(url, {
    method: 'PUT',
    headers: githubHeaders(token),
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  const json = await parseJsonResponse<{ message?: string }>(response, 'GitHub file upload');
  if (!response.ok) {
    throw new Error(json.message || `GitHub upload failed (${response.status}).`);
  }
}

function applyPublishMode(
  payload: ParsedMdPayload,
  mode: 'now' | 'schedule' | 'private'
): ParsedMdPayload {
  const next = { ...payload };
  if (mode === 'private') {
    next.visibility = 'private';
    next.publishAt = '';
    return next;
  }
  if (mode === 'now') {
    next.visibility = 'public';
    next.publishAt = '';
    return next;
  }
  next.visibility = 'public';
  if (!next.publishAt) {
    throw new Error('Schedule mode requires publishAt.');
  }
  return next;
}

async function uploadImageViaGithubDirect(file: File, slug: string, token: string): Promise<string> {
  const ext = resolveImageExtension(file);
  const filename = `${slug}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const repoPath = `public/assets/images/posts/${slug}/${filename}`;
  const contentBase64 = encodeBufferBase64(await file.arrayBuffer());

  await putGithubFile(repoPath, token, contentBase64, `[studio] upload image ${slug}`);

  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${repoPath}`;
}

async function publishViaGithubDirect(
  payload: ParsedMdPayload,
  mode: 'now' | 'schedule' | 'private',
  token: string
): Promise<string> {
  const finalPayload = applyPublishMode(payload, mode);
  const targetPath = `content/blog/${finalPayload.slug}.md`;
  const markdown = buildMarkdownContent(finalPayload);
  const contentBase64 = encodeUtf8Base64(markdown);
  await putGithubFile(targetPath, token, contentBase64, `[studio] update post ${finalPayload.slug}`);
  return targetPath;
}

async function verifyPostReachable(path: string): Promise<string> {
  try {
    const response = await fetch(`${path}?v=${Date.now()}`, { cache: 'no-store' });
    return response.ok ? 'Live check: 200' : `Live check: ${response.status}`;
  } catch (_error) {
    return 'Live check: failed';
  }
}

export default function StudioNewPostPage() {
  const [form, setForm] = useState<ParsedMdPayload>(INITIAL_FORM);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [mode, setMode] = useState<'now' | 'schedule' | 'private'>('now');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [amazonProducts, setAmazonProducts] = useState<AmazonProduct[]>([]);
  const [amazonWarning, setAmazonWarning] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyInputRef = useRef<HTMLTextAreaElement>(null);
  const previewHtml = useMemo(() => renderSimpleMarkdownToHtml(form.body || ''), [form.body]);

  useEffect(() => {
    let canceled = false;
    async function loadAmazonLinks() {
      try {
        const token = extractGithubTokenFromStorage();
        const response = await fetch('/api/studio/amazon-links', {
          cache: 'no-store',
          headers: token ? { 'x-github-token': token } : undefined,
        });
        const json = await parseJsonResponse<{
          products?: AmazonProduct[];
          warning?: string;
          error?: string;
        }>(response, 'Amazon links API');
        if (!response.ok) {
          throw new Error(json.error || `Amazon links load failed (${response.status})`);
        }
        if (canceled) return;
        setAmazonProducts(Array.isArray(json.products) ? json.products : []);
        setAmazonWarning(json.warning ? String(json.warning) : '');
      } catch (err) {
        if (canceled) return;
        setAmazonWarning(err instanceof Error ? err.message : 'Amazon link data unavailable.');
      }
    }

    void loadAmazonLinks();
    return () => {
      canceled = true;
    };
  }, []);

  const updateForm = (patch: Partial<ParsedMdPayload>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const insertAtCursor = (insertion: string) => {
    const textarea = bodyInputRef.current;
    const currentBody = form.body || '';
    if (!textarea) {
      updateForm({ body: `${currentBody}\n${insertion}`.trimStart() });
      return;
    }

    const start = textarea.selectionStart ?? currentBody.length;
    const end = textarea.selectionEnd ?? currentBody.length;
    const next = currentBody.slice(0, start) + insertion + currentBody.slice(end);
    updateForm({ body: next });

    window.requestAnimationFrame(() => {
      textarea.focus();
      const nextPos = start + insertion.length;
      textarea.selectionStart = nextPos;
      textarea.selectionEnd = nextPos;
    });
  };

  const handleMdUpload = async (file: File) => {
    setError('');
    setStatus('');
    try {
      const text = await file.text();
      const parsed = parseMarkdownFileContent(text, file.name);
      setForm({
        ...parsed,
        body: sanitizeBodyBeforePublish(parsed.body || ''),
      });
      setTagsInput(parsed.tags.join(', '));
      setUploadedFileName(file.name);
      setStatus(`MD loaded: ${parsed.slug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse markdown.';
      setError(message);
    }
  };

  const handlePasteImage = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(event.clipboardData.items || []);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;

    event.preventDefault();
    setError('');

    const slug = form.slug.trim();
    if (!slug) {
      setError('Set slug first, then paste image.');
      return;
    }

    const token = extractGithubTokenFromStorage();
    const file = imageItem.getAsFile();
    if (!file) {
      setError('Clipboard image is empty.');
      return;
    }

    try {
      setBusy(true);
      let uploadedPath = '';
      let apiError = '';

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slug);

        const response = await fetch('/api/studio/image-upload', {
          method: 'POST',
          headers: token ? { 'x-github-token': token } : undefined,
          body: formData,
        });
        const json = await parseJsonResponse<{ path?: string; error?: string }>(
          response,
          'Image upload API'
        );
        if (!response.ok || !json.path) {
          throw new Error(json.error || `Image upload failed (${response.status})`);
        }
        uploadedPath = json.path;
      } catch (apiErr) {
        apiError = apiErr instanceof Error ? apiErr.message : 'Image upload API failed.';
      }

      if (!uploadedPath) {
        if (!token) {
          throw new Error(
            `${apiError} Fallback upload requires GitHub token. Login once in /admin first.`
          );
        }
        uploadedPath = await uploadImageViaGithubDirect(file, slug, token);
        setStatus(`Image uploaded via direct fallback: ${uploadedPath}`);
      } else {
        setStatus(`Image uploaded: ${uploadedPath}`);
      }

      insertAtCursor(`\n\n![${slug} image](${uploadedPath})\n\n`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Image paste upload failed.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const handleInsertRandomAmazonLink = () => {
    setError('');
    const picked = chooseRandomProduct(amazonProducts);
    if (!picked) {
      setError('No Amazon link available. Add links in /studio/amazon-links first.');
      return;
    }
    insertAtCursor(`\n\n${buildAmazonSnippet(picked)}\n\n`);
    setStatus(`Inserted Amazon link: ${picked.name}`);
  };

  const handlePublish = async () => {
    setError('');
    setStatus('');
    setPublishedUrl('');

    const token = extractGithubTokenFromStorage();
    const payload: ParsedMdPayload = {
      ...form,
      body: sanitizeBodyBeforePublish(form.body || ''),
      tags: parseTags(tagsInput),
    };

    try {
      setBusy(true);
      let publishedPath = '';
      let apiError = '';

      try {
        const response = await fetch('/api/studio/publish', {
          method: 'POST',
          headers: token
            ? {
                'Content-Type': 'application/json',
                'x-github-token': token,
              }
            : {
                'Content-Type': 'application/json',
              },
          body: JSON.stringify({
            mode,
            payload,
          }),
        });

        const json = await parseJsonResponse<{
          ok?: boolean;
          error?: string;
          path?: string;
          postUrl?: string;
          changed?: boolean;
          message?: string;
        }>(
          response,
          'Publish API'
        );
        if (!response.ok || !json.ok || !json.path) {
          throw new Error(json.error || `Publish failed (${response.status})`);
        }
        publishedPath = json.path;
        const postUrl = json.postUrl || `/blog/${payload.slug}`;
        setPublishedUrl(postUrl);
        const liveResult = await verifyPostReachable(postUrl);
        if (json.changed === false) {
          setStatus(`${json.message || 'No content changes detected; publish skipped.'} ${liveResult}`);
        } else {
          setStatus(`Published: ${json.path} (${liveResult})`);
        }
      } catch (apiErr) {
        apiError = apiErr instanceof Error ? apiErr.message : 'Publish API failed.';
      }

      if (!publishedPath) {
        if (!token) {
          throw new Error(
            `${apiError} Fallback publish requires GitHub token. Login once in /admin first.`
          );
        }
        publishedPath = await publishViaGithubDirect(payload, mode, token);
        const postUrl = `/blog/${payload.slug}`;
        setPublishedUrl(postUrl);
        const liveResult = await verifyPostReachable(postUrl);
        setStatus(`Published via direct fallback: ${publishedPath} (${liveResult})`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Publish failed.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Blog (MD Upload)</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload MD {'->'} edit {'->'} paste image {'->'} publish now or schedule.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/studio"
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            href="/studio/list"
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            List
          </Link>
          <Link
            href="/studio/amazon-links"
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Amazon Link
          </Link>
          <a
            href="/admin/bulk-update.html"
            target="_blank"
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Bulk Manager
          </a>
        </div>
      </div>

      {status ? (
        <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {status}
        </div>
      ) : null}
      {publishedUrl ? (
        <div className="mb-4 rounded border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Open post:{' '}
          <a className="underline" href={publishedUrl} target="_blank" rel="noreferrer">
            {publishedUrl}
          </a>
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {amazonWarning ? (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {amazonWarning}
        </div>
      ) : null}

      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-sm font-medium text-gray-700">Upload Markdown File</label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload MD File
          </button>
          <span className="text-sm text-gray-600">{uploadedFileName || 'No file selected'}</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void handleMdUpload(file);
            }
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Slug (3 digits)
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={form.slug}
                onChange={(e) => updateForm({ slug: e.target.value })}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Date
              <input
                type="date"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={form.date}
                onChange={(e) => updateForm({ date: e.target.value })}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              className="mt-1 h-20 w-full rounded border border-gray-300 px-3 py-2"
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-gray-700">
              OG Image
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={form.ogImage}
                onChange={(e) => updateForm({ ogImage: e.target.value })}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Author
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={form.author}
                onChange={(e) => updateForm({ author: e.target.value })}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Mode
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={mode}
                onChange={(e) => setMode(e.target.value as 'now' | 'schedule' | 'private')}
              >
                <option value="now">Publish now</option>
                <option value="schedule">Schedule</option>
                <option value="private">Private</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Publish At (for schedule)
              <input
                type="datetime-local"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={form.publishAt ? form.publishAt.slice(0, 16) : ''}
                onChange={(e) =>
                  updateForm({
                    publishAt: e.target.value ? new Date(e.target.value).toISOString() : '',
                  })
                }
              />
            </label>
          </div>

          <div className="block text-sm font-medium text-gray-700">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <span>Body (paste image directly here)</span>
              <button
                type="button"
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                onClick={handleInsertRandomAmazonLink}
              >
                Insert Random Amazon Link
              </button>
            </div>
            <textarea
              ref={bodyInputRef}
              className="mt-1 h-[420px] w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
              value={form.body}
              onChange={(e) => updateForm({ body: e.target.value })}
              onPaste={(e) => {
                void handlePasteImage(e);
              }}
            />
          </div>

          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={() => {
              void handlePublish();
            }}
            disabled={busy}
          >
            {busy ? 'Working...' : 'Save & Publish'}
          </button>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Live Preview</h2>
          <article className="max-w-none leading-7 text-[15px] text-gray-900 [&_h1]:mb-4 [&_h1]:text-3xl [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_hr]:my-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded">
            <h1>{form.title || 'Untitled'}</h1>
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </article>
        </section>
      </div>
    </div>
  );
}
