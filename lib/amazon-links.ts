import fs from 'fs';
import path from 'path';
import { getFileFromGithub, putFileToGithub } from './github-repo';

const AMAZON_LINKS_PATH = 'content/data/amazon-links.json';
const LOCAL_AMAZON_LINKS_PATH = path.join(process.cwd(), AMAZON_LINKS_PATH);

export interface AmazonProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  url: string;
  category: string;
  image: string;
  tags?: string[];
}

interface AmazonLinksFile {
  products: AmazonProduct[];
}

export interface AmazonLinksLoadResult {
  products: AmazonProduct[];
  sha?: string;
  warning?: string;
}

function sanitizeProduct(input: unknown): AmazonProduct | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  const product: AmazonProduct = {
    id: String(raw.id || '').trim(),
    name: String(raw.name || '').trim(),
    description: String(raw.description || '').trim(),
    price: String(raw.price || '').trim(),
    url: String(raw.url || '').trim(),
    category: String(raw.category || '').trim(),
    image: String(raw.image || '').trim(),
    tags: Array.isArray(raw.tags)
      ? raw.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
  };

  if (!product.id || !product.name || !product.url) {
    return null;
  }

  return product;
}

function sanitizeProducts(list: unknown): AmazonProduct[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) => sanitizeProduct(item)).filter((item): item is AmazonProduct => item !== null);
}

function parseAmazonLinksText(text: string): AmazonProduct[] {
  try {
    const parsed = JSON.parse(text) as AmazonLinksFile;
    return sanitizeProducts(parsed.products);
  } catch (_error) {
    return [];
  }
}

function loadAmazonLinksFromLocal(): AmazonLinksLoadResult {
  try {
    if (!fs.existsSync(LOCAL_AMAZON_LINKS_PATH)) {
      return { products: [] };
    }
    const text = fs.readFileSync(LOCAL_AMAZON_LINKS_PATH, 'utf8');
    return { products: parseAmazonLinksText(text) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown local read error';
    return {
      products: [],
      warning: `Failed to load local amazon links: ${message}`,
    };
  }
}

export async function loadAmazonLinks(overrideToken?: string): Promise<AmazonLinksLoadResult> {
  if (!overrideToken) {
    return loadAmazonLinksFromLocal();
  }

  try {
    const githubFile = await getFileFromGithub(AMAZON_LINKS_PATH, overrideToken);
    if (!githubFile) {
      return { products: [] };
    }
    return {
      products: parseAmazonLinksText(githubFile.content),
      sha: githubFile.sha,
    };
  } catch (error) {
    const local = loadAmazonLinksFromLocal();
    const message = error instanceof Error ? error.message : 'unknown github read error';
    return {
      products: local.products,
      warning: local.warning || `GitHub load failed, using local fallback: ${message}`,
    };
  }
}

export async function saveAmazonLinks(products: AmazonProduct[], token: string): Promise<void> {
  if (!token) {
    throw new Error('GitHub token is required to save amazon links.');
  }

  const existing = await getFileFromGithub(AMAZON_LINKS_PATH, token);
  const payload: AmazonLinksFile = {
    products: sanitizeProducts(products),
  };

  await putFileToGithub(
    AMAZON_LINKS_PATH,
    `${JSON.stringify(payload, null, 2)}\n`,
    '[studio] update amazon links',
    {
      sha: existing?.sha,
      overrideToken: token,
    }
  );
}

