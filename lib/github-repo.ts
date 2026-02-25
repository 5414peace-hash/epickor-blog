interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface GithubFile {
  path: string;
  content: string;
  sha: string;
}

function parseRepoFullName(repoFullName: string): { owner: string; repo: string } {
  const [owner, repo] = repoFullName.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid repo fullname: ${repoFullName}`);
  }
  return { owner, repo };
}

function resolveToken(overrideToken?: string): string {
  return (
    overrideToken ||
    process.env.STUDIO_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PAT ||
    ''
  );
}

export function getRepoConfig(overrideToken?: string): RepoConfig {
  const repoFullName = process.env.STUDIO_REPO || '5414peace-hash/epickor-blog';
  const branch = process.env.STUDIO_BRANCH || 'master';
  const token = resolveToken(overrideToken);
  const { owner, repo } = parseRepoFullName(repoFullName);

  if (!token) {
    throw new Error('GitHub token missing. Set STUDIO_GITHUB_TOKEN or provide token from admin session.');
  }

  return { owner, repo, branch, token };
}

function encodeBase64(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64');
}

function decodeBase64(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf8');
}

async function githubFetch(
  config: RepoConfig,
  path: string,
  init?: RequestInit
): Promise<Response> {
  const apiPath = path.replace(/^\/+/, '');
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/${apiPath}`;

  return fetch(url, {
    ...init,
    headers: {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
}

export async function getFileFromGithub(
  filePath: string,
  overrideToken?: string
): Promise<GithubFile | null> {
  const config = getRepoConfig(overrideToken);
  const response = await githubFetch(
    config,
    `contents/${filePath}?ref=${encodeURIComponent(config.branch)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub get file failed (${response.status}): ${text.slice(0, 260)}`);
  }

  const json = (await response.json()) as { content?: string; sha?: string; path?: string };
  if (!json.content || !json.sha || !json.path) {
    throw new Error('GitHub get file response is missing content/sha/path.');
  }

  return {
    path: json.path,
    content: decodeBase64(json.content.replace(/\n/g, '')),
    sha: json.sha,
  };
}

export async function putFileToGithub(
  filePath: string,
  content: string,
  message: string,
  options?: { sha?: string; overrideToken?: string }
): Promise<void> {
  const config = getRepoConfig(options?.overrideToken);

  const body: Record<string, string> = {
    message,
    content: encodeBase64(content),
    branch: config.branch,
  };

  if (options?.sha) {
    body.sha = options.sha;
  }

  const response = await githubFetch(config, `contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub put file failed (${response.status}): ${text.slice(0, 260)}`);
  }
}

export async function deleteFileFromGithub(
  filePath: string,
  message: string,
  options?: { sha?: string; overrideToken?: string }
): Promise<boolean> {
  const config = getRepoConfig(options?.overrideToken);
  const sha = options?.sha || (await getFileFromGithub(filePath, options?.overrideToken))?.sha;

  if (!sha) {
    return false;
  }

  const response = await githubFetch(config, `contents/${filePath}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message,
      sha,
      branch: config.branch,
    }),
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub delete file failed (${response.status}): ${text.slice(0, 260)}`);
  }

  return true;
}

