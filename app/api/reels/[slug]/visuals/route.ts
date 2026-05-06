import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'replace_needed';

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
  reviewStatus: ReviewStatus;
  reviewerNote: string;
}

interface ScenesFile {
  slug: string;
  sourcePost: string;
  title: string;
  format: Record<string, unknown>;
  status: string;
  scenes: Scene[];
}

interface Candidate {
  id: string;
  src: string;
  source: string;
  licenseNote: string;
  fitReason: string;
  weakness: string;
  duplicateRisk: string;
  reviewStatus: ReviewStatus;
  reviewerNote: string;
  rank?: number | null;
}

interface CandidateScene {
  number: number;
  candidates: Candidate[];
}

interface CandidatesFile {
  slug: string;
  sourcePost: string;
  notes: string[];
  scenes: CandidateScene[];
}

function isSafeSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

function getPaths(slug: string) {
  const reelDir = path.join(process.cwd(), 'output', 'reels', slug);
  return {
    reelDir,
    scenesPath: path.join(reelDir, 'scenes.json'),
    candidatesPath: path.join(reelDir, 'visual-candidates.json'),
    approvedPath: path.join(reelDir, 'approved-visuals.json'),
    reviewPassPath: path.join(reelDir, 'review-pass.json'),
    replacementRequestsPath: path.join(reelDir, 'replacement-requests.json'),
  };
}

async function readJson<T>(filePath: string): Promise<T> {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text) as T;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function buildPayload(slug: string, scenesFile: ScenesFile, candidatesFile: CandidatesFile) {
  const missingScenes = scenesFile.scenes
    .filter((scene) => !Array.isArray(scene.selectedImages) || scene.selectedImages.length < 2)
    .map((scene) => scene.number);
  const replacementScenes = candidatesFile.scenes
    .filter((scene) => scene.candidates.some((candidate) => candidate.reviewStatus === 'replace_needed'))
    .map((scene) => scene.number);
  const nextStep =
    scenesFile.status === 'visuals_approved'
      ? 'Next: generate ElevenLabs narration audio, then prepare the Remotion preview.'
      : scenesFile.status === 'replacement_requested'
        ? `Next: source replacement candidates for scene${replacementScenes.length === 1 ? '' : 's'} ${replacementScenes.join(', ')}.`
        : missingScenes.length === 0
          ? 'Next: press Finalize visual review to lock visuals for voice and Remotion prep.'
          : `Next: rank at least two visuals for scene${missingScenes.length === 1 ? '' : 's'} ${missingScenes.join(', ')}.`;

  return {
    slug,
    title: scenesFile.title,
    status: scenesFile.status,
    minRankedVisualsPerScene: 2,
    nextStep,
    scenes: scenesFile.scenes,
    candidateScenes: candidatesFile.scenes,
  };
}

function getRankedCandidates(candidateScene: CandidateScene): Candidate[] {
  return candidateScene.candidates
    .filter((candidate) => typeof candidate.rank === 'number' && candidate.rank >= 1 && candidate.rank <= 5 && candidate.src)
    .sort((a, b) => Number(a.rank) - Number(b.rank));
}

function syncSceneFromRanks(scene: Scene, candidateScene: CandidateScene) {
  const ranked = getRankedCandidates(candidateScene);
  scene.selectedImages = ranked.map((candidate) => candidate.src);
  scene.selectedImage = ranked[0]?.src || '';
  scene.reviewStatus = ranked.length >= 2 ? 'approved' : ranked.length > 0 ? 'pending' : scene.reviewStatus;
}

function buildApprovedScenes(scenesFile: ScenesFile) {
  return scenesFile.scenes
    .map((item) => ({
      number: item.number,
      selectedImage: item.selectedImage,
      selectedImages: item.selectedImages || [],
      motion: item.motion,
      durationSeconds: item.expectedDurationSeconds,
      caption: item.subtitleText || item.narration,
      typographyBeats: item.typographyBeats || [],
    }))
    .filter((item) => item.selectedImages.length > 0);
}

function buildReviewPass(slug: string, scenesFile: ScenesFile, candidatesFile: CandidatesFile) {
  const scenes = scenesFile.scenes.map((scene) => {
    const candidateScene = candidatesFile.scenes.find((item) => item.number === scene.number);
    const candidates = candidateScene?.candidates || [];
    const ranked = getRankedCandidates({ number: scene.number, candidates });
    const replaceCandidates = candidates.filter((candidate) => candidate.reviewStatus === 'replace_needed');
    const rejectedCandidates = candidates.filter((candidate) => candidate.reviewStatus === 'rejected');

    return {
      number: scene.number,
      narration: scene.subtitleText || scene.narration,
      visualIntent: scene.visualIntent,
      rankedVisuals: ranked.map((candidate) => ({
        id: candidate.id,
        rank: candidate.rank,
        src: candidate.src,
        source: candidate.source,
      })),
      replaceCandidateIds: replaceCandidates.map((candidate) => candidate.id),
      rejectedCandidateIds: rejectedCandidates.map((candidate) => candidate.id),
      needsReplacementSourcing: ranked.length < 2 || replaceCandidates.length > 0,
      replacementBrief:
        ranked.length < 2
          ? 'Find more distinct visual candidates matched to narration keywords before final approval.'
          : replaceCandidates.length > 0
            ? 'User requested replacement options; source stronger alternatives if this scene still feels thin.'
            : '',
    };
  });

  return {
    slug,
    submittedAt: new Date().toISOString(),
    minRankedVisualsPerScene: 2,
    status: scenes.some((scene) => scene.needsReplacementSourcing) ? 'replacement_sourcing_needed' : 'ready_for_final_visual_approval',
    scenes,
    replacementScenes: scenes.filter((scene) => scene.needsReplacementSourcing),
  };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  try {
    const paths = getPaths(slug);
    const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
    const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);
    return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_REELS_REVIEW_WRITE !== 'true') {
    return NextResponse.json({ error: 'Reels review writes are local-only by default.' }, { status: 403 });
  }

  const { slug } = await params;
  if (!isSafeSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const body = await request.json();
  const action = String(body.action || '');
  const paths = getPaths(slug);

  if (action === 'finalize') {
    try {
      const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
      const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);
      for (const scene of scenesFile.scenes) {
        const candidateScene = candidatesFile.scenes.find((item) => item.number === scene.number);
        if (candidateScene) syncSceneFromRanks(scene, candidateScene);
      }

      const missingScenes = scenesFile.scenes
        .filter((scene) => !Array.isArray(scene.selectedImages) || scene.selectedImages.length < 2)
        .map((scene) => scene.number);

      if (missingScenes.length > 0) {
        return NextResponse.json(
          {
            error: `Visual review is not complete. Rank at least two visuals for scenes: ${missingScenes.join(', ')}`,
            missingScenes,
            ...buildPayload(slug, scenesFile, candidatesFile),
          },
          { status: 409 }
        );
      }

      const approvedScenes = buildApprovedScenes(scenesFile);

      scenesFile.status = 'visuals_approved';

      await writeJson(paths.scenesPath, scenesFile);
      await writeJson(paths.approvedPath, {
        slug,
        updatedAt: new Date().toISOString(),
        finalizedAt: new Date().toISOString(),
        scenes: approvedScenes,
      });

      return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (action === 'submit_pass') {
    try {
      const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
      const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);

      for (const scene of scenesFile.scenes) {
        const candidateScene = candidatesFile.scenes.find((item) => item.number === scene.number);
        if (!candidateScene) continue;
        syncSceneFromRanks(scene, candidateScene);

        const ranked = getRankedCandidates(candidateScene);
        const hasReplacementRequest = candidateScene.candidates.some((candidate) => candidate.reviewStatus === 'replace_needed');
        if (ranked.length < 2 || hasReplacementRequest) {
          scene.reviewStatus = 'replace_needed';
          scene.reviewerNote = 'Review pass submitted with replacement sourcing requested.';
        }
      }

      const reviewPass = buildReviewPass(slug, scenesFile, candidatesFile);
      scenesFile.status =
        reviewPass.replacementScenes.length > 0 ? 'replacement_requested' : 'review_pass_submitted';

      await writeJson(paths.scenesPath, scenesFile);
      await writeJson(paths.approvedPath, {
        slug,
        updatedAt: new Date().toISOString(),
        scenes: buildApprovedScenes(scenesFile),
      });
      await writeJson(paths.reviewPassPath, reviewPass);
      await writeJson(paths.replacementRequestsPath, {
        slug,
        updatedAt: new Date().toISOString(),
        scenes: reviewPass.replacementScenes,
      });

      return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const sceneNumber = Number(body.sceneNumber);
  const candidateId = String(body.candidateId || '');
  const status = String(body.status || '') as ReviewStatus;
  const rank = body.rank === null || body.rank === undefined ? null : Number(body.rank);
  const note = String(body.note || '');

  if (action === 'rank') {
    if (!Number.isInteger(sceneNumber) || !candidateId || rank === null || !Number.isInteger(rank) || rank < 1 || rank > 5) {
      return NextResponse.json({ error: 'Invalid rank update' }, { status: 400 });
    }

    try {
      const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
      const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);
      const candidateScene = candidatesFile.scenes.find((scene) => scene.number === sceneNumber);
      const scene = scenesFile.scenes.find((item) => item.number === sceneNumber);

      if (!candidateScene || !scene) {
        return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
      }

      const candidate = candidateScene.candidates.find((item) => item.id === candidateId);
      if (!candidate || !candidate.src) {
        return NextResponse.json({ error: 'Candidate not found or has no image' }, { status: 404 });
      }

      for (const item of candidateScene.candidates) {
        if (item.id === candidateId || item.rank === rank) {
          item.rank = null;
          if (item.reviewStatus === 'approved') item.reviewStatus = 'pending';
        }
      }

      candidate.rank = rank;
      candidate.reviewStatus = 'approved';
      candidate.reviewerNote = note;
      syncSceneFromRanks(scene, candidateScene);

      const approvedScenes = buildApprovedScenes(scenesFile);

      scenesFile.status = scenesFile.scenes.every((item) => (item.selectedImages || []).length >= 2)
        ? 'visuals_ranked'
        : 'visual_review_pending';

      await writeJson(paths.candidatesPath, candidatesFile);
      await writeJson(paths.scenesPath, scenesFile);
      await writeJson(paths.approvedPath, {
        slug,
        updatedAt: new Date().toISOString(),
        scenes: approvedScenes,
      });

      return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (!Number.isInteger(sceneNumber) || !candidateId || !['pending', 'approved', 'rejected', 'replace_needed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid review update' }, { status: 400 });
  }

  try {
    const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
    const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);

    const candidateScene = candidatesFile.scenes.find((scene) => scene.number === sceneNumber);
    const scene = scenesFile.scenes.find((item) => item.number === sceneNumber);

    if (!candidateScene || !scene) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
    }

    const candidate = candidateScene.candidates.find((item) => item.id === candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    for (const item of candidateScene.candidates) {
      if (status === 'approved') {
        item.reviewStatus = item.id === candidateId ? 'approved' : item.reviewStatus === 'approved' ? 'pending' : item.reviewStatus;
      }
    }

    candidate.reviewStatus = status;
    candidate.reviewerNote = note;
    if (status !== 'approved') candidate.rank = null;

    scene.reviewStatus = status;
    scene.reviewerNote = note;
    syncSceneFromRanks(scene, candidateScene);

    const approvedScenes = buildApprovedScenes(scenesFile);

    scenesFile.status = scenesFile.scenes.every((item) => (item.selectedImages || []).length >= 2)
      ? 'visuals_ranked'
      : 'visual_review_pending';

    await writeJson(paths.candidatesPath, candidatesFile);
    await writeJson(paths.scenesPath, scenesFile);
    await writeJson(paths.approvedPath, {
      slug,
      updatedAt: new Date().toISOString(),
      scenes: approvedScenes,
    });

    return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
