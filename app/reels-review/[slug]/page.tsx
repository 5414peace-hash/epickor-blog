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

interface MotionCard {
  id: string;
  sceneNumber: number;
  templateId?: string;
  kicker: string;
  headline: string;
  headlineLines?: string[];
  subhead?: string;
  subheadLines?: string[];
  bullets: string[];
  footer?: string;
  footerLines?: string[];
  layout: string;
  motionPreset: string;
  accentColor: string;
  overlayOpacity: number;
  durationSeconds: number;
  backgroundImage?: string;
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'replace_needed';
  reviewerNote?: string;
}

interface MotionCardsFile {
  status?: string;
  targetCoverageRatio?: number;
  cards: MotionCard[];
}

interface MotionCardTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;
  motionPreset: string;
}

interface MotionCardTemplatesFile {
  templates: MotionCardTemplate[];
}

async function readJson<T>(filePath: string): Promise<T> {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text) as T;
}

async function readOptionalJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return await readJson<T>(filePath);
  } catch (_error) {
    return fallback;
  }
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
    const motionCardsFile = await readOptionalJson<MotionCardsFile>(path.join(reelDir, 'motion-cards.json'), {
      cards: [],
    });
    const motionCardTemplatesFile = await readOptionalJson<MotionCardTemplatesFile>(
      path.join(reelDir, 'motion-card-templates.json'),
      await readOptionalJson<MotionCardTemplatesFile>(path.join(root, '.claude', 'skills', 'reels', 'motion-card-templates.json'), {
        templates: [],
      })
    );

    return (
      <ReelsReviewClient
        initialPayload={{
          slug,
          title: scenesFile.title,
          status: scenesFile.status,
          minRankedVisualsPerScene: 2,
          scenes: scenesFile.scenes,
          candidateScenes: candidatesFile.scenes,
          motionCards: motionCardsFile.cards,
          motionCardTemplates: motionCardTemplatesFile.templates,
          motionCardStatus: motionCardsFile.status,
          motionCardTargetCoverageRatio: motionCardsFile.targetCoverageRatio,
        }}
      />
    );
  } catch (_error) {
    notFound();
  }
}
