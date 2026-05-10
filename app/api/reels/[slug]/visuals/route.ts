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
  reviewStatus?: ReviewStatus;
  reviewerNote?: string;
}

interface MotionCardsFile {
  slug: string;
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
  slug: string;
  version?: string;
  templates: MotionCardTemplate[];
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
    motionCardsPath: path.join(reelDir, 'motion-cards.json'),
    motionCardTemplatesPath: path.join(reelDir, 'motion-card-templates.json'),
    defaultMotionCardTemplatesPath: path.join(process.cwd(), '.claude', 'skills', 'reels', 'motion-card-templates.json'),
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

async function readOptionalJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return await readJson<T>(filePath);
  } catch (_error) {
    return fallback;
  }
}

async function readMotionCardTemplates(paths: ReturnType<typeof getPaths>, slug: string): Promise<MotionCardTemplatesFile> {
  return readOptionalJson<MotionCardTemplatesFile>(
    paths.motionCardTemplatesPath,
    await readOptionalJson<MotionCardTemplatesFile>(paths.defaultMotionCardTemplatesPath, { slug, templates: [] })
  );
}

function buildPayload(
  slug: string,
  scenesFile: ScenesFile,
  candidatesFile: CandidatesFile,
  motionCardsFile?: MotionCardsFile,
  motionCardTemplatesFile?: MotionCardTemplatesFile
) {
  const motionCards = motionCardsFile?.cards || [];
  const hasMotionCards = (sceneNumber: number) => motionCards.some((card) => card.sceneNumber === sceneNumber);
  const hasApprovedMotionCard = (sceneNumber: number) =>
    motionCards.some((card) => card.sceneNumber === sceneNumber && card.reviewStatus === 'approved');
  const missingScenes = scenesFile.scenes
    .filter((scene) =>
      hasMotionCards(scene.number)
        ? !hasApprovedMotionCard(scene.number)
        : !Array.isArray(scene.selectedImages) || scene.selectedImages.length < 2
    )
    .map((scene) => scene.number);
  const replacementScenes = candidatesFile.scenes
    .filter((scene) => scene.candidates.some((candidate) => candidate.reviewStatus === 'replace_needed'))
    .map((scene) => scene.number);
  const nextStep =
    scenesFile.status === 'visuals_approved'
      ? 'Next: generate ElevenLabs narration audio, then prepare the Remotion preview.'
      : scenesFile.status === 'replacement_requested'
        ? replacementScenes.length > 0
          ? `Next: source replacement candidates for scene${replacementScenes.length === 1 ? '' : 's'} ${replacementScenes.join(', ')}.`
          : `Next: review the refreshed replacement candidates for scene${missingScenes.length === 1 ? '' : 's'} ${missingScenes.join(', ')}.`
        : missingScenes.length === 0
          ? 'Next: press Finalize visual review to lock visuals for voice and Remotion prep.'
          : `Next: complete visual or motion-card selections for scene${missingScenes.length === 1 ? '' : 's'} ${missingScenes.join(', ')}.`;

  return {
    slug,
    title: scenesFile.title,
    status: scenesFile.status,
    minRankedVisualsPerScene: 2,
    nextStep,
    scenes: scenesFile.scenes,
    candidateScenes: candidatesFile.scenes,
    motionCards,
    motionCardTemplates: motionCardTemplatesFile?.templates || [],
    motionCardStatus: motionCardsFile?.status,
    motionCardTargetCoverageRatio: motionCardsFile?.targetCoverageRatio,
  };
}

async function buildPayloadWithMotionCards(
  slug: string,
  scenesFile: ScenesFile,
  candidatesFile: CandidatesFile,
  paths: ReturnType<typeof getPaths>
) {
  const motionCardsFile = await readOptionalJson<MotionCardsFile>(paths.motionCardsPath, { slug, cards: [] });
  const motionCardTemplatesFile = await readMotionCardTemplates(paths, slug);
  return buildPayload(slug, scenesFile, candidatesFile, motionCardsFile, motionCardTemplatesFile);
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

function getApprovedMotionCard(motionCardsFile: MotionCardsFile, sceneNumber: number): MotionCard | undefined {
  return motionCardsFile.cards.find((card) => card.sceneNumber === sceneNumber && card.reviewStatus === 'approved');
}

function sceneHasMotionCards(motionCardsFile: MotionCardsFile, sceneNumber: number): boolean {
  return motionCardsFile.cards.some((card) => card.sceneNumber === sceneNumber);
}

function syncMotionSceneVisuals(scenesFile: ScenesFile, motionCardsFile: MotionCardsFile) {
  for (const scene of scenesFile.scenes) {
    const approvedCard = getApprovedMotionCard(motionCardsFile, scene.number);
    if (!approvedCard?.backgroundImage) continue;
    scene.selectedImage = approvedCard.backgroundImage;
    scene.selectedImages = [approvedCard.backgroundImage];
    scene.reviewStatus = 'approved';
    scene.reviewerNote = `Motion card approved: ${approvedCard.id}`;
  }
}

function getMissingScenes(scenesFile: ScenesFile, motionCardsFile: MotionCardsFile) {
  return scenesFile.scenes
    .filter((scene) =>
      sceneHasMotionCards(motionCardsFile, scene.number)
        ? !getApprovedMotionCard(motionCardsFile, scene.number)
        : !Array.isArray(scene.selectedImages) || scene.selectedImages.length < 2
    )
    .map((scene) => scene.number);
}

function motionCardReviewStatus(motionCardsFile: MotionCardsFile) {
  const sceneNumbers = [...new Set(motionCardsFile.cards.map((card) => card.sceneNumber))];
  if (sceneNumbers.length === 0) return motionCardsFile.status;
  if (motionCardsFile.cards.some((card) => card.reviewStatus === 'replace_needed')) return 'motion_cards_review';
  return sceneNumbers.every((sceneNumber) => getApprovedMotionCard(motionCardsFile, sceneNumber))
    ? 'motion_cards_approved'
    : 'motion_cards_review';
}

function buildReviewPass(slug: string, scenesFile: ScenesFile, candidatesFile: CandidatesFile, motionCardsFile?: MotionCardsFile) {
  const scenes = scenesFile.scenes.map((scene) => {
    const approvedMotionCard = motionCardsFile ? getApprovedMotionCard(motionCardsFile, scene.number) : undefined;
    if (motionCardsFile && sceneHasMotionCards(motionCardsFile, scene.number)) {
      return {
        number: scene.number,
        narration: scene.subtitleText || scene.narration,
        visualIntent: scene.visualIntent,
        rankedVisuals: approvedMotionCard
          ? [
              {
                id: approvedMotionCard.id,
                rank: 1,
                src: approvedMotionCard.backgroundImage || '',
                source: `Approved motion card: ${approvedMotionCard.templateId || approvedMotionCard.layout}`,
              },
            ]
          : [],
        replaceCandidateIds: approvedMotionCard ? [] : ['motion_card_selection'],
        rejectedCandidateIds: [],
        needsReplacementSourcing: !approvedMotionCard,
        replacementBrief: approvedMotionCard ? '' : 'Select one motion-card design option for this scene before final approval.',
      };
    }

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
    const motionCardsFile = await readOptionalJson<MotionCardsFile>(paths.motionCardsPath, { slug, cards: [] });
    const motionCardTemplatesFile = await readMotionCardTemplates(paths, slug);
    return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile, motionCardsFile, motionCardTemplatesFile));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const requestHost = request.headers.get('host') || '';
  const isLocalReviewHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(requestHost);
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_REELS_REVIEW_WRITE !== 'true' && !isLocalReviewHost) {
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
      const motionCardsFile = await readOptionalJson<MotionCardsFile>(paths.motionCardsPath, { slug, cards: [] });
      for (const scene of scenesFile.scenes) {
        if (sceneHasMotionCards(motionCardsFile, scene.number)) continue;
        const candidateScene = candidatesFile.scenes.find((item) => item.number === scene.number);
        if (candidateScene) syncSceneFromRanks(scene, candidateScene);
      }
      syncMotionSceneVisuals(scenesFile, motionCardsFile);

      const missingScenes = getMissingScenes(scenesFile, motionCardsFile);

      if (missingScenes.length > 0) {
        return NextResponse.json(
          {
            error: `Visual review is not complete. Rank at least two visuals for scenes: ${missingScenes.join(', ')}`,
            missingScenes,
            ...(await buildPayloadWithMotionCards(slug, scenesFile, candidatesFile, paths)),
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

      return NextResponse.json(await buildPayloadWithMotionCards(slug, scenesFile, candidatesFile, paths));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (action === 'submit_pass') {
    try {
      const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
      const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);
      const motionCardsFile = await readOptionalJson<MotionCardsFile>(paths.motionCardsPath, { slug, cards: [] });
      syncMotionSceneVisuals(scenesFile, motionCardsFile);

      for (const scene of scenesFile.scenes) {
        if (sceneHasMotionCards(motionCardsFile, scene.number)) {
          if (!getApprovedMotionCard(motionCardsFile, scene.number)) {
            scene.reviewStatus = 'replace_needed';
            scene.reviewerNote = 'Review pass submitted without an approved motion-card option.';
          }
          continue;
        }
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

      const reviewPass = buildReviewPass(slug, scenesFile, candidatesFile, motionCardsFile);
      const missingScenes = getMissingScenes(scenesFile, motionCardsFile);
      scenesFile.status = missingScenes.length > 0 ? 'replacement_requested' : 'review_pass_submitted';

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

      return NextResponse.json(await buildPayloadWithMotionCards(slug, scenesFile, candidatesFile, paths));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const sceneNumber = Number(body.sceneNumber);
  const candidateId = String(body.candidateId || '');
  const cardId = String(body.cardId || '');
  const status = String(body.status || '') as ReviewStatus;
  const rank = body.rank === null || body.rank === undefined ? null : Number(body.rank);
  const note = String(body.note || '');

  if (action === 'motion_card_status') {
    if (!cardId || !['pending', 'approved', 'rejected', 'replace_needed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid motion card update' }, { status: 400 });
    }

    try {
      const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
      const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);
      const motionCardsFile = await readOptionalJson<MotionCardsFile>(paths.motionCardsPath, { slug, cards: [] });
      const card = motionCardsFile.cards.find((item) => item.id === cardId);

      if (!card) {
        return NextResponse.json({ error: 'Motion card not found' }, { status: 404 });
      }

      if (status === 'approved') {
        for (const item of motionCardsFile.cards) {
          if (item.sceneNumber === card.sceneNumber && item.id !== card.id && item.reviewStatus === 'approved') {
            item.reviewStatus = 'pending';
            item.reviewerNote = 'Superseded by another approved option for this scene.';
          }
        }
      }

      card.reviewStatus = status;
      card.reviewerNote = note;
      if (status === 'approved' && card.backgroundImage) {
        const scene = scenesFile.scenes.find((item) => item.number === card.sceneNumber);
        if (scene) {
          scene.selectedImage = card.backgroundImage;
          scene.selectedImages = [card.backgroundImage];
          scene.reviewStatus = 'approved';
          scene.reviewerNote = `Motion card approved: ${card.id}`;
        }
      }
      motionCardsFile.status = motionCardReviewStatus(motionCardsFile);

      await writeJson(paths.motionCardsPath, motionCardsFile);
      await writeJson(paths.scenesPath, scenesFile);
      return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile, motionCardsFile));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (action === 'motion_card_template') {
    const templateId = String(body.templateId || '');
    if (!cardId || !templateId) {
      return NextResponse.json({ error: 'Invalid motion card template update' }, { status: 400 });
    }

    try {
      const scenesFile = await readJson<ScenesFile>(paths.scenesPath);
      const candidatesFile = await readJson<CandidatesFile>(paths.candidatesPath);
      const motionCardsFile = await readOptionalJson<MotionCardsFile>(paths.motionCardsPath, { slug, cards: [] });
      const motionCardTemplatesFile = await readMotionCardTemplates(paths, slug);
      const card = motionCardsFile.cards.find((item) => item.id === cardId);
      const template = motionCardTemplatesFile.templates.find((item) => item.id === templateId);

      if (!card || !template) {
        return NextResponse.json({ error: 'Motion card or template not found' }, { status: 404 });
      }

      card.templateId = template.id;
      card.layout = template.layout;
      card.motionPreset = template.motionPreset;
      card.reviewStatus = 'pending';
      card.reviewerNote = note;
      motionCardsFile.status = 'motion_cards_review';

      await writeJson(paths.motionCardsPath, motionCardsFile);
      return NextResponse.json(buildPayload(slug, scenesFile, candidatesFile, motionCardsFile, motionCardTemplatesFile));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

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

      return NextResponse.json(await buildPayloadWithMotionCards(slug, scenesFile, candidatesFile, paths));
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

    return NextResponse.json(await buildPayloadWithMotionCards(slug, scenesFile, candidatesFile, paths));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
