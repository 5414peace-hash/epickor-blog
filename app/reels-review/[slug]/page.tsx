import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import ReelsReviewClient from './ReelsReviewClient';

export const dynamic = 'force-dynamic';

interface Scene {
  number: number;
  narration: string;
  caption: string;
  subtitleText?: string;
  selectedImages?: string[];
  typographyBeats?: Array<{
    text: string;
    emphasis: string;
    timingHint: string;
  }>;
  visualIntent: string;
  imageSearchQuery: string;
  selectedImage: string;
  motion: string;
  expectedDurationSeconds: number;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'replace_needed';
  reviewerNote: string;
}

interface ScenesFile {
  slug: string;
  title: string;
  status: string;
  scenes: Scene[];
}

interface CandidateScene {
  number: number;
  candidates: Array<{
    id: string;
    src: string;
    source: string;
    licenseNote: string;
    fitReason: string;
    weakness: string;
    duplicateRisk: string;
    reviewStatus: 'pending' | 'approved' | 'rejected' | 'replace_needed';
    reviewerNote: string;
    rank?: number | null;
  }>;
}

interface CandidatesFile {
  scenes: CandidateScene[];
}

async function readJson<T>(filePath: string): Promise<T> {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text) as T;
}

function assertSafeSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

export default async function ReelsReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!assertSafeSlug(slug)) notFound();

  const root = process.cwd();
  const reelDir = path.join(root, 'output', 'reels', slug);

  try {
    const scenesFile = await readJson<ScenesFile>(path.join(reelDir, 'scenes.json'));
    const candidatesFile = await readJson<CandidatesFile>(path.join(reelDir, 'visual-candidates.json'));

    return (
      <ReelsReviewClient
        initialPayload={{
          slug,
          title: scenesFile.title,
          status: scenesFile.status,
          minRankedVisualsPerScene: 2,
          scenes: scenesFile.scenes,
          candidateScenes: candidatesFile.scenes,
        }}
      />
    );
  } catch (_error) {
    notFound();
  }
}
