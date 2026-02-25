import fs from 'fs';
import path from 'path';
import { getFileFromGithub, putFileToGithub } from './github-repo';

const COUNTER_FILE_PATH = 'content/data/post-views.json';
const LOCAL_COUNTER_FILE_PATH = path.join(process.cwd(), COUNTER_FILE_PATH);

function hasServerWriteToken(): boolean {
  return Boolean(process.env.STUDIO_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT);
}

export interface ViewCounterStore {
  updatedAt: string;
  totals: Record<string, number>;
  daily: Record<string, Record<string, number>>;
}

interface CounterLoadResult {
  store: ViewCounterStore;
  sha?: string;
  warning?: string;
}

function buildDefaultStore(): ViewCounterStore {
  return {
    updatedAt: new Date().toISOString(),
    totals: {},
    daily: {},
  };
}

function sanitizeStore(input: unknown): ViewCounterStore {
  const defaultStore = buildDefaultStore();
  if (!input || typeof input !== 'object') {
    return defaultStore;
  }

  const raw = input as Record<string, unknown>;
  const totalsRaw = raw.totals && typeof raw.totals === 'object' ? (raw.totals as Record<string, unknown>) : {};
  const dailyRaw = raw.daily && typeof raw.daily === 'object' ? (raw.daily as Record<string, unknown>) : {};

  const totals: Record<string, number> = {};
  Object.entries(totalsRaw).forEach(([slug, value]) => {
    const n = Number(value);
    if (!Number.isNaN(n) && n >= 0) {
      totals[slug] = Math.floor(n);
    }
  });

  const daily: Record<string, Record<string, number>> = {};
  Object.entries(dailyRaw).forEach(([dateKey, dateBucket]) => {
    if (!dateBucket || typeof dateBucket !== 'object') return;
    const bucket: Record<string, number> = {};
    Object.entries(dateBucket as Record<string, unknown>).forEach(([slug, value]) => {
      const n = Number(value);
      if (!Number.isNaN(n) && n >= 0) {
        bucket[slug] = Math.floor(n);
      }
    });
    daily[dateKey] = bucket;
  });

  return {
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : defaultStore.updatedAt,
    totals,
    daily,
  };
}

function loadLocalCounterStore(): CounterLoadResult {
  try {
    if (!fs.existsSync(LOCAL_COUNTER_FILE_PATH)) {
      return { store: buildDefaultStore() };
    }

    const text = fs.readFileSync(LOCAL_COUNTER_FILE_PATH, 'utf8');
    const parsed = JSON.parse(text);
    return { store: sanitizeStore(parsed) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown local counter error';
    return {
      store: buildDefaultStore(),
      warning: `Local counter fallback used due to read error: ${message}`,
    };
  }
}

export async function loadCounterStore(overrideToken?: string): Promise<CounterLoadResult> {
  try {
    const githubFile = await getFileFromGithub(COUNTER_FILE_PATH, overrideToken);
    if (!githubFile) {
      return { store: buildDefaultStore() };
    }
    return {
      store: sanitizeStore(JSON.parse(githubFile.content)),
      sha: githubFile.sha,
    };
  } catch (error) {
    const local = loadLocalCounterStore();
    const message = error instanceof Error ? error.message : 'unknown github counter error';
    return {
      store: local.store,
      warning: local.warning || `Counter using local fallback: ${message}`,
    };
  }
}

export function getViewsForRange(
  store: ViewCounterStore,
  slug: string,
  startDate: string,
  endDate: string
): number {
  let total = 0;
  Object.entries(store.daily).forEach(([dateKey, bucket]) => {
    if (dateKey < startDate || dateKey > endDate) return;
    total += bucket?.[slug] || 0;
  });
  return total;
}

export async function incrementPostView(slug: string): Promise<{ warning?: string }> {
  if (!slug) {
    return { warning: 'Missing slug for view increment.' };
  }

  if (!hasServerWriteToken()) {
    return { warning: 'View counter write disabled. Set STUDIO_GITHUB_TOKEN for persistent counting.' };
  }

  const load = await loadCounterStore();
  const store = sanitizeStore(load.store);
  const today = new Date().toISOString().slice(0, 10);

  store.totals[slug] = (store.totals[slug] || 0) + 1;
  if (!store.daily[today]) {
    store.daily[today] = {};
  }
  store.daily[today][slug] = (store.daily[today][slug] || 0) + 1;
  store.updatedAt = new Date().toISOString();

  try {
    await putFileToGithub(
      COUNTER_FILE_PATH,
      JSON.stringify(store, null, 2),
      `[studio] track view ${slug}`,
      { sha: load.sha }
    );
    return load.warning ? { warning: load.warning } : {};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown counter save error';
    return {
      warning: `View counted in memory but save failed: ${message}`,
    };
  }
}
