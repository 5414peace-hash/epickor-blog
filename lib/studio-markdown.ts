export interface ParsedMdPayload {
  title: string;
  slug: string;
  date: string;
  visibility: 'public' | 'private';
  publishAt: string;
  description: string;
  ogImage: string;
  tags: string[];
  author: string;
  body: string;
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, '').trim();
}

function normalizeSlug3Digits(value: string): string {
  const trimmed = (value || '').trim();
  if (/^\d{3}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(\d{1,3})(?!.*\d)/);
  if (match && match[1]) return match[1].padStart(3, '0');
  return String(Date.now() % 1000).padStart(3, '0');
}

function normalizeDate(value: string): string {
  const trimmed = (value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function normalizePublishAt(value: string): string {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString();
}

function parseSimpleFrontmatter(frontmatterText: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = frontmatterText.split('\n');
  let activeListKey: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const listMatch = line.match(/^-\s*(.+)$/);
    if (listMatch && activeListKey) {
      if (!Array.isArray(result[activeListKey])) result[activeListKey] = [];
      (result[activeListKey] as string[]).push(stripQuotes(listMatch[1]));
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

function generateDescriptionFromBody(body: string): string {
  const plain = (body || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/<img[\s\S]*?>/g, ' ')
    .replace(/[#>*`_~[\]\(\)-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.slice(0, 220);
}

export function parseMarkdownFileContent(markdownText: string, fileName = ''): ParsedMdPayload {
  const text = (markdownText || '').replace(/^\uFEFF/, '');
  const frontmatterMatch = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error('No valid frontmatter block found.');
  }

  const frontmatter = parseSimpleFrontmatter(frontmatterMatch[1]);
  const body = (frontmatterMatch[2] || '').trim();
  const fileSlug = fileName.replace(/\.(md|markdown)$/i, '');
  const rawTags = frontmatter.tags;

  const tags = Array.isArray(rawTags)
    ? rawTags.map((v) => String(v).trim()).filter(Boolean)
    : typeof rawTags === 'string'
      ? rawTags.split(',').map((v) => v.trim()).filter(Boolean)
      : [];

  const visibility =
    typeof frontmatter.visibility === 'string' && frontmatter.visibility.toLowerCase() === 'private'
      ? 'private'
      : 'public';

  return {
    title: String(frontmatter.title || '').trim(),
    slug: normalizeSlug3Digits(String(frontmatter.slug || fileSlug || '')),
    date: normalizeDate(String(frontmatter.date || '')),
    visibility,
    publishAt: normalizePublishAt(String(frontmatter.publishAt || '')),
    description: String(frontmatter.description || '').trim() || generateDescriptionFromBody(body),
    ogImage: String(frontmatter.ogImage || '').trim(),
    tags,
    author: String(frontmatter.author || 'EpicKor').trim(),
    body,
  };
}

export function buildMarkdownContent(payload: ParsedMdPayload): string {
  const frontmatterLines = [
    '---',
    `title: "${(payload.title || '').replace(/"/g, '\\"')}"`,
    `slug: "${payload.slug}"`,
    `date: "${payload.date}"`,
    `visibility: "${payload.visibility}"`,
    `publishAt: "${payload.publishAt || ''}"`,
    `description: "${(payload.description || '').replace(/"/g, '\\"')}"`,
    `ogImage: "${payload.ogImage || ''}"`,
    `tags: [${(payload.tags || []).map((tag) => `'${String(tag).replace(/'/g, "\\'")}'`).join(', ')}]`,
    `author: "${(payload.author || 'EpicKor').replace(/"/g, '\\"')}"`,
    '---',
    '',
  ];

  return `${frontmatterLines.join('\n')}${payload.body || ''}\n`;
}
