function normalizeImageCandidate(raw: string): string {
  const trimmed = String(raw || '').trim().replace(/^<|>$/g, '');
  if (!trimmed) return '';

  const withTitleMatch = trimmed.match(/^(\S+)\s+["'][^"']*["']$/);
  const candidate = withTitleMatch ? withTitleMatch[1] : trimmed;
  return candidate.trim();
}

function isPlaceholderImageUrl(url: string): boolean {
  if (!url) return true;

  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch (_error) {
    // Keep original string.
  }

  return /\{\{[^}]+\}\}/.test(decoded);
}

export function extractFirstImageUrl(markdown: string): string {
  if (!markdown) return '';

  const markdownImagePattern = /!\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of markdown.matchAll(markdownImagePattern)) {
    const candidate = normalizeImageCandidate(match[1] || '');
    if (candidate && !isPlaceholderImageUrl(candidate)) {
      return candidate;
    }
  }

  const htmlImagePattern = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  for (const match of markdown.matchAll(htmlImagePattern)) {
    const candidate = normalizeImageCandidate(match[1] || '');
    if (candidate && !isPlaceholderImageUrl(candidate)) {
      return candidate;
    }
  }

  return '';
}

