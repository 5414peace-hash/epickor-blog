'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

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

interface Candidate {
  id: string;
  src: string;
  source: string;
  licenseNote: string;
  keywordCoverage?: string;
  fitReason: string;
  weakness: string;
  duplicateRisk: string;
  reviewStatus: ReviewStatus;
  reviewerNote: string;
  rank?: number | null;
  fitMode?: 'cover' | 'contain_frame';
}

interface CandidateScene {
  number: number;
  thumbnailOverlay?: {
    kicker?: string;
    titleLines?: string[];
    watermark?: string;
  };
  candidates: Candidate[];
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

interface MotionCardTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;
  motionPreset: string;
}

interface Payload {
  slug: string;
  title: string;
  status: string;
  minRankedVisualsPerScene: number;
  nextStep?: string;
  lastAction?: string;
  scenes: Scene[];
  candidateScenes: CandidateScene[];
  motionCards?: MotionCard[];
  motionCardTemplates?: MotionCardTemplate[];
  motionCardStatus?: string;
  motionCardTargetCoverageRatio?: number;
}

interface Props {
  initialPayload: Payload;
}

const statusLabels: Record<ReviewStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  replace_needed: 'Replace',
};

const statusColors: Record<ReviewStatus, string> = {
  pending: '#8a6d1d',
  approved: '#146c43',
  rejected: '#9f1239',
  replace_needed: '#9a3412',
};

const FINAL_REQUIRED_VISUALS_PER_SCENE = 1;

function getCandidates(payload: Payload, sceneNumber: number): Candidate[] {
  return getCandidateScene(payload, sceneNumber)?.candidates || [];
}

function getCandidateScene(payload: Payload, sceneNumber: number): CandidateScene | undefined {
  return payload.candidateScenes.find((scene) => scene.number === sceneNumber);
}

function getMotionCards(payload: Payload, sceneNumber: number): MotionCard[] {
  return (payload.motionCards || []).filter((card) => card.sceneNumber === sceneNumber);
}

function candidateNeedsContainFrame(candidate: Candidate) {
  return candidate.fitMode === 'contain_frame';
}

function thumbnailTitleLines(title: string, overlay?: CandidateScene['thumbnailOverlay']): string[] {
  if (overlay?.titleLines?.length) {
    return overlay.titleLines.map((line) => line.trim()).filter(Boolean);
  }
  if (/Webtoons Changed How Stories Travel/i.test(title)) {
    return ['WEBTOONS CHANGED', 'HOW STORIES TRAVEL'];
  }
  if (/Eating Alone Has A Name/i.test(title)) {
    return ['EATING ALONE', 'HAS A NAME'];
  }
  return title
    .replace(/\|/g, '\n')
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ReelsReviewClient({ initialPayload }: Props) {
  const [payload, setPayload] = useState<Payload>(initialPayload);
  const [savingId, setSavingId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const isFinalized = payload.status === 'visuals_approved';

  const progress = useMemo(() => {
    const total = payload.scenes.length;
      const approved = payload.scenes.filter((scene) => {
        const motionCards = getMotionCards(payload, scene.number);
        if (motionCards.length > 0) return motionCards.some((card) => card.reviewStatus === 'approved');
      return (scene.selectedImages || []).length >= FINAL_REQUIRED_VISUALS_PER_SCENE;
    }).length;
    const replaceNeeded = payload.candidateScenes.filter((scene) =>
      scene.candidates.some((candidate) => candidate.reviewStatus === 'replace_needed')
    ).length;
    const motionCards = payload.motionCards || [];
    const motionSceneNumbers = [...new Set(motionCards.map((card) => card.sceneNumber))];
    const approvedMotionScenes = motionSceneNumbers.filter((sceneNumber) =>
      motionCards.some((card) => card.sceneNumber === sceneNumber && card.reviewStatus === 'approved')
    ).length;
    return { total, approved, replaceNeeded, motionScenes: motionSceneNumbers.length, approvedMotionScenes };
  }, [payload, payload.candidateScenes, payload.motionCards, payload.scenes]);

  const missingScenes = useMemo(() => {
    return payload.scenes
      .filter((scene) => {
        const motionCards = getMotionCards(payload, scene.number);
        if (motionCards.length > 0) return !motionCards.some((card) => card.reviewStatus === 'approved');
        return (scene.selectedImages || []).length < FINAL_REQUIRED_VISUALS_PER_SCENE;
      })
      .map((scene) => scene.number);
  }, [payload, payload.scenes]);

  async function updateCandidate(sceneNumber: number, candidateId: string, status: ReviewStatus) {
    setSavingId(candidateId);
    setMessage('');

    try {
      const response = await fetch(`/api/reels/${payload.slug}/visuals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneNumber,
          candidateId,
          status,
          note: notes[candidateId] || '',
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || `Save failed (${response.status})`);
      }
      setPayload(json);
      setMessage(`Saved ${candidateId} as ${statusLabels[status]}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setSavingId('');
    }
  }

  async function updateMotionCard(cardId: string, status: ReviewStatus) {
    setSavingId(cardId);
    setMessage('');

    try {
      const response = await fetch(`/api/reels/${payload.slug}/visuals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'motion_card_status',
          cardId,
          status,
          note: notes[cardId] || '',
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || `Motion card save failed (${response.status})`);
      }
      setPayload(json);
      setMessage(`Saved ${cardId} as ${statusLabels[status]}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Motion card save failed.');
    } finally {
      setSavingId('');
    }
  }

  async function updateMotionCardTemplate(cardId: string, templateId: string) {
    setSavingId(`${cardId}-${templateId}`);
    setMessage('');

    try {
      const response = await fetch(`/api/reels/${payload.slug}/visuals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'motion_card_template',
          cardId,
          templateId,
          note: notes[cardId] || '',
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || `Template save failed (${response.status})`);
      }
      setPayload(json);
      setMessage(`Saved ${cardId} template as ${templateId}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Template save failed.');
    } finally {
      setSavingId('');
    }
  }

  async function rankCandidate(sceneNumber: number, candidateId: string, rank: number) {
    setSavingId(`${candidateId}-${rank}`);
    setMessage('');

    try {
      const response = await fetch(`/api/reels/${payload.slug}/visuals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rank',
          sceneNumber,
          candidateId,
          rank,
          note: notes[candidateId] || '',
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || `Rank save failed (${response.status})`);
      }
      setPayload(json);
      setMessage(`Saved ${candidateId} as rank ${rank}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Rank save failed.');
    } finally {
      setSavingId('');
    }
  }

  async function finalizeReview() {
    setSavingId('finalize');
    setMessage('');

    try {
      const response = await fetch(`/api/reels/${payload.slug}/visuals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finalize' }),
      });
      const json = await response.json();
      if (!response.ok) {
        if (Array.isArray(json.missingScenes)) {
          throw new Error(`Still needs approved visuals for scenes: ${json.missingScenes.join(', ')}`);
        }
        throw new Error(json.error || `Finalize failed (${response.status})`);
      }
      setPayload(json);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMessage('Visual review finalized. This Reel is ready for voice and Remotion prep.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Finalize failed.');
    } finally {
      setSavingId('');
    }
  }

  async function submitReviewPass() {
    setSavingId('submit_pass');
    setMessage('');

    try {
      const response = await fetch(`/api/reels/${payload.slug}/visuals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_pass' }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || `Review pass failed (${response.status})`);
      }
      setPayload(json);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMessage('Review pass saved. Replacement scenes can now be sourced as the next batch.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Review pass failed.');
    } finally {
      setSavingId('');
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f7f4ee', color: '#18181b' }}>
      <div style={{ margin: '0 auto', maxWidth: 1180, padding: '32px 20px 56px' }}>
        <header style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#78716c', fontSize: 13, fontWeight: 700, letterSpacing: 0 }}>
            EPICKOR REELS REVIEW
          </p>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: 0 }}>{payload.title}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={pillStyle('#334155')}>Slug {payload.slug}</span>
            <span style={pillStyle('#57534e')}>{payload.status}</span>
            <span style={pillStyle('#146c43')}>{progress.approved}/{progress.total} approved</span>
            {progress.motionScenes > 0 && (
              <span style={pillStyle('#7c3aed')}>
                Motion scenes {progress.approvedMotionScenes}/{progress.motionScenes}
              </span>
            )}
            {progress.replaceNeeded > 0 && <span style={pillStyle('#9a3412')}>{progress.replaceNeeded} need replacement</span>}
          </div>
          <ReviewActionsBar
            finalizeDisabled={savingId === 'finalize' || missingScenes.length > 0}
            submitDisabled={savingId === 'submit_pass'}
            missingScenes={missingScenes}
            onFinalize={finalizeReview}
            onSubmitPass={submitReviewPass}
            busyAction={savingId}
            status={payload.status}
          />
          <StatusPanel payload={payload} message={message} missingScenes={missingScenes} savingId={savingId} />
        </header>

        <div style={{ display: 'grid', gap: 18 }}>
          {payload.scenes.map((scene) => {
            const candidateScene = getCandidateScene(payload, scene.number);
            const candidates = getCandidates(payload, scene.number);
            const sceneMotionCards = getMotionCards(payload, scene.number);
            const isMotionScene = sceneMotionCards.length > 0;
            const rankedCount = isMotionScene
              ? sceneMotionCards.filter((card) => card.reviewStatus === 'approved').length
              : (scene.selectedImages || []).length;
            const replaceCount = candidates.filter((candidate) => candidate.reviewStatus === 'replace_needed').length;
            return (
              <section
                key={scene.number}
                style={{
                  display: 'grid',
                  gap: 14,
                  padding: 16,
                  border: '1px solid #e4ded4',
                  borderRadius: 8,
                  background: '#fffdf8',
                  boxShadow: '0 12px 30px rgba(31, 25, 20, 0.06)',
                }}
              >
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <h2 style={{ margin: 0, fontSize: 22, letterSpacing: 0 }}>Scene {scene.number}</h2>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={pillStyle(statusColors[scene.reviewStatus])}>{statusLabels[scene.reviewStatus]}</span>
                      {isMotionScene ? (
                        <span style={pillStyle(rankedCount >= 1 ? '#146c43' : '#9a3412')}>
                          {rankedCount}/1 motion selected
                        </span>
                      ) : (
                        <span style={pillStyle(rankedCount >= FINAL_REQUIRED_VISUALS_PER_SCENE ? '#146c43' : '#9a3412')}>
                          {rankedCount}/{FINAL_REQUIRED_VISUALS_PER_SCENE}+ selected
                        </span>
                      )}
                      {replaceCount > 0 && <span style={pillStyle('#9a3412')}>{replaceCount} replace requests</span>}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(280px, 1fr) minmax(260px, 0.55fr)',
                      gap: 14,
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ display: 'grid', gap: 8 }}>
                      <p style={labelStyle}>Narration / Subtitle Source</p>
                      <p style={{ ...bodyStyle, fontSize: 17, fontWeight: 750 }}>
                        {scene.subtitleText || scene.narration}
                      </p>
                      <p style={smallMetaStyle}>
                        Subtitles will be generated from this narration text, not from a separate caption line.
                      </p>
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <p style={labelStyle}>Visual Intent</p>
                      <p style={bodyStyle}>{scene.visualIntent}</p>
                      <span style={smallMetaStyle}>Motion: {scene.motion}</span>
                      <span style={smallMetaStyle}>Duration: {scene.expectedDurationSeconds}s</span>
                    </div>
                  </div>

                  {scene.typographyBeats && scene.typographyBeats.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {scene.typographyBeats.map((beat) => (
                        <span key={`${scene.number}-${beat.text}`} style={pillStyle('#7c3aed')}>
                          {beat.text} / {beat.emphasis}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isMotionScene ? (
                  <MotionCardReviewSection
                    cards={sceneMotionCards}
                    templates={payload.motionCardTemplates || []}
                    targetCoverageRatio={payload.motionCardTargetCoverageRatio}
                    savingId={savingId}
                    onUpdate={updateMotionCard}
                    onTemplateUpdate={updateMotionCardTemplate}
                  />
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 180px))',
                      justifyContent: 'start',
                      gap: 10,
                    }}
                  >
                    {candidates.map((candidate) => {
                      const shouldContain = candidateNeedsContainFrame(candidate);
                      return (
                    <article
                      key={candidate.id}
                      style={{
                        display: 'grid',
                        gap: 8,
                        padding: 8,
                        border: `2px solid ${candidate.rank ? '#2563eb' : candidate.reviewStatus === 'replace_needed' ? '#f97316' : candidate.reviewStatus === 'rejected' ? '#e11d48' : '#e7e5e4'}`,
                        borderRadius: 8,
                        background: '#ffffff',
                      }}
                    >
                      {candidate.src ? (
                        <div
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '100%',
                            aspectRatio: scene.number === 1 ? '9 / 16' : '4 / 3',
                            borderRadius: 6,
                            background: '#e7e5e4',
                          }}
                        >
                          {shouldContain && (
                            <img
                              src={candidate.src}
                              alt=""
                              aria-hidden="true"
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'blur(12px)',
                                transform: 'scale(1.12)',
                                opacity: 0.42,
                              }}
                            />
                          )}
                          {shouldContain && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.46))',
                              }}
                            />
                          )}
                          <img
                            src={candidate.src}
                            alt={`${candidate.id} candidate`}
                            style={{
                              position: shouldContain ? 'absolute' : undefined,
                              inset: shouldContain ? 0 : undefined,
                              width: '100%',
                              height: '100%',
                              objectFit: shouldContain ? 'contain' : 'cover',
                              padding: shouldContain ? 8 : 0,
                              boxSizing: 'border-box',
                            }}
                          />
                          {scene.number === 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 10,
                                padding: 14,
                                color: '#fff',
                                textAlign: 'center',
                                background: 'linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.62))',
                                textShadow: '0 3px 12px rgba(0,0,0,0.8)',
                                pointerEvents: 'none',
                              }}
                            >
                              <span style={{ color: '#facc15', fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>
                                {candidateScene?.thumbnailOverlay?.kicker ||
                                (/Eating Alone Has A Name/i.test(payload.title)
                                  ? 'KOREA SOLO DINING'
                                  : (scene.typographyBeats?.[0]?.text || 'INTRO THUMBNAIL').replace(/\|/g, ' '))}
                              </span>
                              <strong style={{ display: 'block', fontSize: 18, fontWeight: 950, lineHeight: 1.04, textTransform: 'uppercase' }}>
                                {thumbnailTitleLines(payload.title, candidateScene?.thumbnailOverlay).map((line) => (
                                  <span key={line} style={{ display: 'block' }}>
                                    {line}
                                  </span>
                                ))}
                              </strong>
                              <span style={{ alignSelf: 'center', borderRadius: 999, padding: '3px 7px', background: 'rgba(0,0,0,0.46)', fontSize: 8, fontWeight: 900 }}>
                                {candidateScene?.thumbnailOverlay?.watermark || 'EPICKOR.COM'}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '100%',
                            aspectRatio: '4 / 3',
                            borderRadius: 6,
                            background: '#f1f5f9',
                            color: '#64748b',
                            fontWeight: 800,
                            textAlign: 'center',
                            padding: 16,
                          }}
                        >
                          Replacement needed
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                        <strong style={{ fontSize: 13 }}>{candidate.id}</strong>
                        <span style={pillStyle(candidate.rank ? '#2563eb' : statusColors[candidate.reviewStatus])}>
                          {candidate.rank ? `Rank ${candidate.rank}` : statusLabels[candidate.reviewStatus]}
                        </span>
                      </div>
                      {candidate.keywordCoverage && (
                        <span style={{ ...pillStyle('#0f766e'), justifySelf: 'start', borderRadius: 6 }}>
                          {candidate.keywordCoverage}
                        </span>
                      )}
                      <p style={miniBlockStyle}>{candidate.fitReason}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
                        {[1, 2, 3, 4, 5].map((rank) => (
                          <button
                            key={rank}
                          onClick={() => rankCandidate(scene.number, candidate.id, rank)}
                            disabled={isFinalized || savingId === `${candidate.id}-${rank}` || !candidate.src}
                            style={rankButtonStyle(candidate.rank === rank)}
                          >
                            {rank}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <button
                          onClick={() => updateCandidate(scene.number, candidate.id, 'rejected')}
                          disabled={isFinalized || savingId === candidate.id}
                          style={buttonStyle('#9f1239')}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => updateCandidate(scene.number, candidate.id, 'replace_needed')}
                          disabled={isFinalized || savingId === candidate.id}
                          style={buttonStyle('#9a3412')}
                        >
                          Replace
                        </button>
                      </div>
                    </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <footer style={{ marginTop: 22 }}>
          <ReviewActionsBar
            finalizeDisabled={savingId === 'finalize' || missingScenes.length > 0}
            submitDisabled={savingId === 'submit_pass'}
            missingScenes={missingScenes}
            onFinalize={finalizeReview}
            onSubmitPass={submitReviewPass}
            busyAction={savingId}
            status={payload.status}
          />
        </footer>
      </div>
    </main>
  );
}

function MotionCardReviewSection({
  cards,
  templates,
  targetCoverageRatio,
  savingId,
  onUpdate,
  onTemplateUpdate,
}: {
  cards: MotionCard[];
  templates: MotionCardTemplate[];
  targetCoverageRatio?: number;
  savingId: string;
  onUpdate: (cardId: string, status: ReviewStatus) => void;
  onTemplateUpdate: (cardId: string, templateId: string) => void;
}) {
  const totalSeconds = cards.reduce((total, card) => total + Number(card.durationSeconds || 0), 0);
  return (
    <section
      style={{
        display: 'grid',
        gap: 16,
        padding: 16,
        border: '1px solid #ddd6fe',
        borderRadius: 8,
        background: '#fbfaff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 5 }}>
          <p style={labelStyle}>Motion Card Review</p>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: 0 }}>Choose one motion design</h2>
          <p style={{ ...smallMetaStyle, margin: 0 }}>
            These are alternative designs for this scene. Approving one option replaces the regular image-candidate ranking for this scene.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={pillStyle('#7c3aed')}>{cards.length} cards</span>
          <span style={pillStyle('#334155')}>{totalSeconds.toFixed(1)}s planned</span>
          {targetCoverageRatio ? <span style={pillStyle('#146c43')}>{Math.round(targetCoverageRatio * 100)}% target</span> : null}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 360px))', gap: 12, justifyContent: 'start' }}>
        {cards.map((card) => (
          <article
            key={card.id}
            style={{
              display: 'grid',
              gap: 10,
              padding: 10,
              border: `2px solid ${card.reviewStatus === 'approved' ? '#146c43' : card.reviewStatus === 'replace_needed' ? '#f97316' : '#ddd6fe'}`,
              borderRadius: 8,
              background: '#ffffff',
              maxWidth: 380,
            }}
          >
            <MotionCardPreview card={card} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: 13 }}>Scene {card.sceneNumber}</strong>
              <span style={pillStyle(statusColors[card.reviewStatus || 'pending'])}>
                {statusLabels[card.reviewStatus || 'pending']}
              </span>
            </div>
            <p style={miniBlockStyle}>
              {card.templateId || card.layout} / {card.motionPreset} / {card.durationSeconds.toFixed(1)}s
            </p>
            {templates.length > 0 && (
              <div style={{ display: 'grid', gap: 5 }}>
                <p style={labelStyle}>Template</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 5 }}>
                  {templates.map((template) => {
                    const active = (card.templateId || card.layout) === template.id || card.layout === template.layout;
                    return (
                      <button
                        key={`${card.id}-${template.id}`}
                        onClick={() => onTemplateUpdate(card.id, template.id)}
                        disabled={savingId === `${card.id}-${template.id}`}
                        title={template.description}
                        style={{
                          minHeight: 30,
                          border: `1px solid ${active ? '#7c3aed' : '#e7e5e4'}`,
                          borderRadius: 5,
                          background: active ? '#f3e8ff' : '#ffffff',
                          color: active ? '#6d28d9' : '#292524',
                          fontSize: 12,
                          fontWeight: 850,
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: '0 8px',
                        }}
                      >
                        {template.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <button
                onClick={() => onUpdate(card.id, 'approved')}
                disabled={savingId === card.id}
                style={buttonStyle('#146c43')}
              >
                Approve
              </button>
              <button
                onClick={() => onUpdate(card.id, 'replace_needed')}
                disabled={savingId === card.id}
                style={buttonStyle('#9a3412')}
              >
                Revise
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function textLines(text?: string, explicit?: string[]) {
  if (explicit?.length) return explicit;
  if (!text) return [];
  return text.split(/\s*\|\s*/).filter(Boolean);
}

function PreviewLineStack({ lines, style }: { lines: string[]; style: CSSProperties }) {
  return (
    <div style={style}>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

function PreviewShell({ card, compact = false }: { card: MotionCard; compact?: boolean }) {
  return (
    <div style={{ display: 'grid', gap: compact ? 6 : 8 }}>
      <div style={{ color: card.accentColor, fontSize: compact ? 9 : 10, fontWeight: 950, textTransform: 'uppercase' }}>
        {card.kicker}
      </div>
      <PreviewLineStack
        lines={textLines(card.headline, card.headlineLines)}
        style={{ fontSize: compact ? 22 : 25, fontWeight: 950, lineHeight: 0.92, textTransform: 'uppercase' }}
      />
      <PreviewLineStack
        lines={textLines(card.subhead, card.subheadLines)}
        style={{ fontSize: compact ? 11 : 12, fontWeight: 780, lineHeight: 1.16, color: 'rgba(255,255,255,0.84)' }}
      />
    </div>
  );
}

function MotionCardPreview({ card }: { card: MotionCard }) {
  const template = card.templateId || card.layout;
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: 'min(100%, 340px)',
        justifySelf: 'center',
        aspectRatio: '9 / 16',
        borderRadius: 8,
        background: '#111827',
        color: '#fff',
      }}
    >
      {card.backgroundImage ? (
        <img
          src={card.backgroundImage}
          alt={`${card.id} background`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${card.overlayOpacity})` }} />
      {template === 'zone_compare' ? <PreviewZoneCompare card={card} /> : null}
      {template === 'kit_grid' ? <PreviewKitGrid card={card} /> : null}
      {template === 'convenience_tray' ? <PreviewConvenienceTray card={card} /> : null}
      {template === 'morning_route' ? <PreviewMorningRoute card={card} /> : null}
      {template === 'wrapper_tabs' ? <PreviewWrapperTabs card={card} /> : null}
      {template === 'receipt_stack' ? <PreviewReceiptStack card={card} /> : null}
      {template === 'stamp_stack' ? <PreviewStampStack card={card} /> : null}
      {template === 'editorial_box' ? <PreviewEditorialBox card={card} /> : null}
      {template === 'radial_burst' ? <PreviewRadial card={card} /> : null}
      {template === 'menu_board' ? <PreviewMenu card={card} /> : null}
      {template === 'kinetic_steps' ? <PreviewKineticSteps card={card} /> : null}
      {template === 'split_checklist' ? <PreviewChecklist card={card} /> : null}
      {!['zone_compare', 'kit_grid', 'convenience_tray', 'morning_route', 'wrapper_tabs', 'receipt_stack', 'stamp_stack', 'editorial_box', 'radial_burst', 'menu_board', 'kinetic_steps', 'split_checklist'].includes(template) ? <PreviewGeneric card={card} /> : null}
    </div>
  );
}

function PreviewZoneCompare({ card }: { card: MotionCard }) {
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);
  const zones = [
    {
      label: 'Bath area',
      title: card.bullets[0] || 'Wet bath',
      rule: card.bullets[1] || 'Nude zone',
      note: 'separated',
      light: true,
    },
    {
      label: 'Common area',
      title: card.bullets[2] || 'Common room',
      rule: card.bullets[3] || 'Uniform zone',
      note: 'shared',
      light: false,
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: '6.5% 6.5% 14%', overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(255,255,255,0.24)', background: 'linear-gradient(180deg, rgba(8,13,24,0.9), rgba(8,13,24,0.68))', boxShadow: '0 12px 30px rgba(0,0,0,0.34)' }}>
      <div style={{ position: 'absolute', left: 15, right: 15, top: 16, display: 'grid', gridTemplateColumns: '1fr 44px', gap: 10, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 5 }}>
          <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 18 ? 21 : 25, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          <PreviewLineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 10, fontWeight: 800, lineHeight: 1.12 }} />
        </div>
        <div style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 999, border: `2px solid ${card.accentColor}`, color: card.accentColor, fontSize: 11, fontWeight: 950 }}>
          2X
        </div>
      </div>
      <div style={{ position: 'absolute', left: 15, right: 15, top: '37%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {zones.map((zone, index) => (
          <div
            key={zone.label}
            style={{
              minHeight: 198,
              display: 'grid',
              alignContent: 'space-between',
              gap: 10,
              padding: 10,
              borderRadius: 13,
              background: zone.light ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.16)',
              color: zone.light ? '#111827' : '#ffffff',
              border: `1px solid ${zone.light ? card.accentColor : 'rgba(255,255,255,0.24)'}`,
              boxShadow: '0 8px 22px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                <span style={{ color: zone.light ? '#111827' : card.accentColor, fontSize: 8, fontWeight: 950, textTransform: 'uppercase' }}>{zone.label}</span>
                <span style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: 7, background: zone.light ? '#111827' : card.accentColor, color: zone.light ? card.accentColor : '#111827', fontSize: 8, fontWeight: 950 }}>{`0${index + 1}`}</span>
              </div>
              <div style={{ height: 2, borderRadius: 999, background: zone.light ? 'rgba(17,24,39,0.2)' : 'rgba(255,255,255,0.22)' }} />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ fontSize: String(zone.title).length > 11 ? 18 : 21, fontWeight: 950, lineHeight: 0.92, textTransform: 'uppercase' }}>{zone.title}</div>
              <div style={{ borderRadius: 999, padding: '7px 9px', background: zone.light ? card.accentColor : 'rgba(255,255,255,0.16)', color: zone.light ? '#111827' : '#ffffff', fontSize: String(zone.rule).length > 11 ? 11 : 13, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>{zone.rule}</div>
            </div>
            <div style={{ color: zone.light ? 'rgba(17,24,39,0.68)' : 'rgba(255,255,255,0.72)', fontSize: 8, fontWeight: 850, textTransform: 'uppercase' }}>{zone.note}</div>
          </div>
        ))}
      </div>
      <PreviewLineStack lines={footerLines} style={{ position: 'absolute', left: 18, right: 18, bottom: 16, textAlign: 'center', color: 'rgba(255,255,255,0.76)', fontSize: 10, fontWeight: 850, lineHeight: 1.12, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewKitGrid({ card }: { card: MotionCard }) {
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);
  const tileColors = ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.18)', card.accentColor];

  return (
    <div style={{ position: 'absolute', inset: '6.5% 6.5% 14%', overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(255,255,255,0.24)', background: 'linear-gradient(180deg, rgba(8,13,24,0.9), rgba(8,13,24,0.66))', boxShadow: '0 12px 30px rgba(0,0,0,0.34)' }}>
      <div style={{ position: 'absolute', left: 15, right: 15, top: 16, display: 'grid', gridTemplateColumns: '1fr 72px', gap: 10, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 5 }}>
          <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 18 ? 21 : 25, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          <PreviewLineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 10, fontWeight: 800, lineHeight: 1.12 }} />
        </div>
        <div style={{ height: 58, display: 'grid', placeItems: 'center', borderRadius: 11, border: `2px solid ${card.accentColor}`, color: card.accentColor, fontSize: 12, fontWeight: 950, textTransform: 'uppercase' }}>
          Small
        </div>
      </div>
      <div style={{ position: 'absolute', left: 15, right: 15, top: '37%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {card.bullets.slice(0, 4).map((bullet, index) => {
          const darkText = index === 0 || index === 3;
          return (
            <div
              key={bullet}
              style={{
                minHeight: 94,
                display: 'grid',
                alignContent: 'space-between',
                gap: 9,
                padding: 10,
                borderRadius: 13,
                background: tileColors[index % tileColors.length],
                color: darkText ? '#111827' : '#ffffff',
                border: `1px solid ${darkText ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.22)'}`,
                boxShadow: '0 8px 22px rgba(0,0,0,0.22)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 950, opacity: 0.8 }}>{`0${index + 1}`}</span>
                <span style={{ width: 24, height: 4, borderRadius: 999, background: darkText ? 'rgba(17,24,39,0.24)' : card.accentColor }} />
              </div>
              <span style={{ fontSize: String(bullet).length > 12 ? 17 : 20, fontWeight: 950, lineHeight: 0.94, textTransform: 'uppercase' }}>{bullet}</span>
            </div>
          );
        })}
      </div>
      <PreviewLineStack lines={footerLines} style={{ position: 'absolute', left: 18, right: 18, bottom: 16, textAlign: 'center', color: 'rgba(255,255,255,0.76)', fontSize: 10, fontWeight: 850, lineHeight: 1.12, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewEditorialBox({ card }: { card: MotionCard }) {
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);
  return (
    <div style={{ position: 'absolute', inset: '6.5% 7%', overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(255,255,255,0.24)', background: 'linear-gradient(180deg, rgba(13,18,28,0.94), rgba(12,18,26,0.84))', boxShadow: '0 12px 30px rgba(0,0,0,0.32)' }}>
      <div style={{ height: 6, background: card.accentColor }} />
      <div style={{ position: 'absolute', left: 16, right: 16, top: 18, display: 'grid', gridTemplateColumns: '1fr 42px', gap: 10, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 5 }}>
          <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 18 ? 21 : 25, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          <PreviewLineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 10, fontWeight: 800, lineHeight: 1.12 }} />
        </div>
        <div style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 9, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.82)', fontSize: 8, fontWeight: 950 }}>
          EPIC
        </div>
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, top: '38%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {card.bullets.slice(0, 4).map((bullet, index) => (
          <div key={bullet} style={{ minHeight: 74, display: 'grid', alignContent: 'space-between', gap: 6, borderRadius: 11, padding: 10, background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.13)', color: index === 0 ? '#111827' : '#ffffff', border: '1px solid rgba(255,255,255,0.18)' }}>
            <span style={{ width: 23, height: 23, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 8, fontWeight: 950 }}>{String(index + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: String(bullet).length > 12 ? 12 : 14, fontWeight: 950, lineHeight: 0.98, textTransform: 'uppercase' }}>{bullet}</span>
          </div>
        ))}
      </div>
      <PreviewLineStack lines={footerLines} style={{ position: 'absolute', left: 18, right: 18, bottom: 17, textAlign: 'center', color: 'rgba(255,255,255,0.76)', fontSize: 10, fontWeight: 850, lineHeight: 1.12, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewConvenienceTray({ card }: { card: MotionCard }) {
  const colors = ['#fff7d6', '#d8f3ee', '#ffe1d2', '#eef2ff', '#fef3c7'];
  return (
    <div style={{ position: 'absolute', inset: '7% 7%', overflow: 'hidden', borderRadius: 16, background: 'linear-gradient(180deg, rgba(255,250,235,0.97), rgba(238,247,244,0.94))', color: '#10231f', boxShadow: '0 12px 30px rgba(0,0,0,0.28)' }}>
      <div style={{ height: 20, background: `repeating-linear-gradient(90deg, ${card.accentColor} 0 6px, #10231f 6px 10px)` }} />
      <div style={{ padding: 14, display: 'grid', gap: 7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>
          <span>{card.kicker}</span>
          <span style={{ color: '#24312d' }}>07:42</span>
        </div>
        <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 25, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
        <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: '#36413d', fontSize: 11, fontWeight: 820, lineHeight: 1.14 }} />
      </div>
      <div style={{ position: 'absolute', left: 14, right: 14, top: '55%', transform: 'translateY(-50%)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {card.bullets.map((bullet, index) => (
          <div key={bullet} style={{ minHeight: index === 0 ? 62 : 48, gridColumn: index === 0 ? 'span 2' : 'span 1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, borderRadius: 9, padding: '0 9px', background: colors[index % colors.length], border: '1px solid rgba(16,35,31,0.12)' }}>
            <span style={{ fontSize: index === 0 ? 19 : 14, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>{bullet}</span>
            <span style={{ minWidth: 20, height: 20, display: 'grid', placeItems: 'center', borderRadius: 5, color: '#fffaf0', background: '#10231f', fontSize: 8, fontWeight: 950 }}>{String(index + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: '#47534e', fontSize: 9, fontWeight: 850, lineHeight: 1.12, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewMorningRoute({ card }: { card: MotionCard }) {
  return (
    <div style={{ position: 'absolute', inset: '7% 7%' }}>
      <div style={{ position: 'absolute', left: 8, right: 8, top: 10, display: 'grid', gap: 6 }}>
        <div style={{ color: card.accentColor, fontSize: 10, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
        <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 24, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
        <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: 820, lineHeight: 1.12 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '54%', transform: 'translateY(-50%)', display: 'grid', gap: 10 }}>
        {card.bullets.map((bullet, index) => {
          const parts = bullet.split('->').map((part) => part.trim());
          return (
            <div key={bullet} style={{ minHeight: 58, display: 'grid', gridTemplateColumns: '38px 1fr', gap: 9, alignItems: 'center', padding: '0 9px', borderRadius: 12, background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.18)', color: index === 0 ? '#111827' : '#ffffff', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 22px rgba(0,0,0,0.26)' }}>
              <span style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 12, fontWeight: 950 }}>{index + 1}</span>
              <span style={{ display: 'grid', gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 950, lineHeight: 0.95, textTransform: 'uppercase' }}>{parts[0]}</span>
                {parts[1] ? <span style={{ fontSize: 11, fontWeight: 850, lineHeight: 1, opacity: 0.82, textTransform: 'uppercase' }}>{parts[1]}</span> : null}
              </span>
            </div>
          );
        })}
      </div>
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 18, right: 18, bottom: 8, textAlign: 'center', fontSize: 10, fontWeight: 850, lineHeight: 1.14, color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewWrapperTabs({ card }: { card: MotionCard }) {
  return (
    <div style={{ position: 'absolute', inset: '7% 7%' }}>
      <div style={{ position: 'absolute', inset: '4% 4% 11%', overflow: 'hidden', borderRadius: 18, background: 'linear-gradient(180deg, rgba(15,23,42,0.94), rgba(15,23,42,0.84))', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ position: 'absolute', left: 18, right: 18, top: 18, display: 'grid', gap: 6 }}>
          <div style={{ color: card.accentColor, fontSize: 10, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 24, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: 820, lineHeight: 1.12 }} />
        </div>
        <div style={{ position: 'absolute', left: 18, right: 18, top: '55%', transform: 'translateY(-50%)', display: 'grid', gap: 10 }}>
          {card.bullets.map((bullet, index) => (
            <div key={bullet} style={{ minHeight: 62, display: 'grid', gridTemplateColumns: '34px 1fr', alignItems: 'center', gap: 9, padding: '0 11px', borderRadius: 12, background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.15)', color: index === 0 ? '#111827' : '#ffffff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 22px rgba(0,0,0,0.24)' }}>
              <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 11, fontWeight: 950 }}>{index + 1}</span>
              <span style={{ fontSize: 16, fontWeight: 950, lineHeight: 0.95, textTransform: 'uppercase' }}>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 18, right: 18, bottom: 4, textAlign: 'center', fontSize: 10, fontWeight: 850, lineHeight: 1.14, color: 'rgba(255,255,255,0.76)', textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewReceiptStack({ card }: { card: MotionCard }) {
  return (
    <div style={{ position: 'absolute', inset: '7% 8%', transform: 'rotate(1deg)', overflow: 'hidden', borderRadius: 7, background: 'linear-gradient(180deg, #fffaf0, #f8efe0)', color: '#1c1917', boxShadow: '0 10px 28px rgba(0,0,0,0.34)' }}>
      <div style={{ height: 13, background: 'repeating-linear-gradient(90deg, transparent 0 8px, rgba(28,25,23,0.12) 8px 11px)' }} />
      <div style={{ padding: '20px 16px 0', display: 'grid', gap: 7 }}>
        <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
        <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 24, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
        <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: '#57534e', fontSize: 10, fontWeight: 820, lineHeight: 1.13 }} />
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, top: '49%', transform: 'translateY(-50%)', display: 'grid', gap: 6 }}>
        {card.bullets.map((bullet, index) => (
          <div key={bullet} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', minHeight: 34, borderBottom: '1px dotted rgba(28,25,23,0.25)' }}>
            <span style={{ fontSize: 13, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>{bullet}</span>
            <span style={{ fontSize: 10, fontWeight: 950, color: card.accentColor }}>{String(index + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 44, height: 22, background: 'repeating-linear-gradient(90deg, #1c1917 0 3px, transparent 3px 6px)' }} />
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 16, right: 16, bottom: 13, color: '#57534e', fontSize: 9, fontWeight: 850, lineHeight: 1.12, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewStampStack({ card }: { card: MotionCard }) {
  const panels = card.bullets.length ? card.bullets : ['Local rule', 'Small habit', 'Big signal'];
  return (
    <div style={{ position: 'absolute', inset: '7% 7%', color: '#fff7ed' }}>
      <div style={{ position: 'absolute', left: 8, right: 8, top: 10, display: 'grid', gap: 7 }}>
        <div style={{ color: card.accentColor, fontSize: 10, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
        <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 23, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
        <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: 820, lineHeight: 1.12 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', display: 'grid', gap: 9 }}>
        {panels.map((panel, index) => (
          <div
            key={panel}
            style={{
              minHeight: 44,
              display: 'grid',
              gridTemplateColumns: '30px 1fr',
              alignItems: 'center',
              gap: 8,
              marginLeft: index % 2 === 0 ? 0 : 20,
              marginRight: index % 2 === 0 ? 20 : 0,
              padding: '0 10px',
              borderRadius: 8,
              transform: `rotate(${[-4, 3, -2, 2][index % 4]}deg)`,
              color: '#111827',
              background: index % 2 === 0 ? '#fff7ed' : '#fde68a',
              border: `2px solid ${index % 2 === 0 ? card.accentColor : '#111827'}`,
              boxShadow: '0 8px 20px rgba(0,0,0,0.28)',
            }}
          >
            <span style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: 999, background: '#111827', color: card.accentColor, fontSize: 10, fontWeight: 950 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 13, fontWeight: 950, lineHeight: 0.96, textTransform: 'uppercase' }}>{panel}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 46, right: 46, bottom: 48, display: 'grid', placeItems: 'center', transform: 'rotate(-5deg)', borderRadius: 999, color: card.accentColor, border: `3px solid ${card.accentColor}`, fontSize: 13, fontWeight: 950, textTransform: 'uppercase', background: 'rgba(17,24,39,0.62)' }}>
        verified
      </div>
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 18, right: 18, bottom: 8, textAlign: 'center', color: 'rgba(255,255,255,0.76)', fontSize: 9, fontWeight: 850, lineHeight: 1.14, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewRadial({ card }: { card: MotionCard }) {
  const chipColors = ['#fde047', '#38bdf8', '#fb7185', '#4ade80'];
  const positions: CSSProperties[] = [
    { top: '18%', left: '6%', transform: 'rotate(-10deg)' },
    { top: '27%', right: '4%', transform: 'rotate(8deg)' },
    { bottom: '25%', left: '8%', transform: 'rotate(7deg)' },
    { bottom: '16%', right: '6%', transform: 'rotate(-7deg)' },
  ];
  return (
    <div style={{ position: 'absolute', inset: '7% 7%' }}>
      <div style={{ position: 'absolute', inset: '31% 13%', display: 'grid', placeItems: 'center', textAlign: 'center', borderRadius: 999, background: 'radial-gradient(circle, rgba(15,23,42,0.94), rgba(15,23,42,0.78) 58%, rgba(255,255,255,0.12) 59%, rgba(255,255,255,0.02) 72%, transparent 73%)' }}>
        <div style={{ display: 'grid', gap: 7, padding: 18 }}>
          <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 25, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ fontSize: 11, fontWeight: 780, lineHeight: 1.12, color: 'rgba(255,255,255,0.82)' }} />
        </div>
      </div>
      {card.bullets.map((bullet, index) => (
        <div
          key={bullet}
          style={{
            position: 'absolute',
            ...positions[index % positions.length],
            minWidth: 76,
            minHeight: 34,
            display: 'grid',
            placeItems: 'center',
            borderRadius: index % 2 === 0 ? 999 : 8,
            padding: '0 10px',
            background: chipColors[index % chipColors.length],
            color: '#111',
            fontSize: 11,
            fontWeight: 950,
            textTransform: 'uppercase',
            boxShadow: '0 8px 20px rgba(0,0,0,0.28)',
          }}
        >
          {bullet}
        </div>
      ))}
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 18, right: 18, bottom: 8, textAlign: 'center', fontSize: 10, fontWeight: 850, lineHeight: 1.14, color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewMenu({ card }: { card: MotionCard }) {
  return (
    <div style={{ position: 'absolute', inset: '7% 8%', padding: 15, borderRadius: 7, border: `5px solid ${card.accentColor}`, background: 'linear-gradient(180deg, rgba(31,18,18,0.96), rgba(18,18,20,0.93))', transform: 'rotate(-1.2deg)' }}>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 16, display: 'grid', gap: 5 }}>
        <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
        <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 22, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
        <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: 820, lineHeight: 1.12 }} />
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, top: '54%', transform: 'translateY(-50%)', display: 'grid', gap: 8 }}>
        {card.bullets.map((bullet, index) => (
          <div key={bullet} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', minHeight: 47, padding: '0 11px', borderRadius: 10, background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.13)', color: index === 0 ? '#111827' : '#ffffff', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 22px rgba(0,0,0,0.24)' }}>
            <span style={{ fontSize: 15, fontWeight: 950, lineHeight: 0.95, textTransform: 'uppercase' }}>{bullet}</span>
            <span style={{ minWidth: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 9, fontWeight: 950 }}>{String(index + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 18, right: 18, bottom: 10, color: 'rgba(255,255,255,0.72)', fontSize: 10, fontWeight: 850, lineHeight: 1.12, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewKineticSteps({ card }: { card: MotionCard }) {
  return (
    <div style={{ position: 'absolute', inset: '7% 8%' }}>
      <div style={{ position: 'absolute', inset: '3% 2% 8%', overflow: 'hidden', borderRadius: 16, background: 'linear-gradient(180deg, rgba(15,23,42,0.94), rgba(15,23,42,0.82))', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'absolute', left: 16, right: 16, top: 16, display: 'grid', gap: 6 }}>
          <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={textLines(card.headline, card.headlineLines)} style={{ fontSize: 23, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
          <PreviewLineStack lines={textLines(card.subhead, card.subheadLines)} style={{ color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: 820, lineHeight: 1.12 }} />
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, top: '55%', transform: 'translateY(-50%)', display: 'grid', gap: 10 }}>
          {card.bullets.map((bullet, index) => (
            <div key={bullet} style={{ minHeight: 58, display: 'grid', gridTemplateColumns: '34px 1fr', alignItems: 'center', gap: 9, padding: '0 11px', borderRadius: 12, background: index === 0 ? card.accentColor : 'rgba(255,255,255,0.15)', color: index === 0 ? '#111827' : '#ffffff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 22px rgba(0,0,0,0.24)' }}>
              <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 999, background: index === 0 ? '#111827' : card.accentColor, color: index === 0 ? '#ffffff' : '#111827', fontSize: 11, fontWeight: 950 }}>{index + 1}</span>
              <span style={{ fontSize: 16, fontWeight: 950, lineHeight: 0.95, textTransform: 'uppercase' }}>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
      <PreviewLineStack lines={textLines(card.footer, card.footerLines)} style={{ position: 'absolute', left: 18, right: 18, bottom: 3, textAlign: 'center', fontSize: 10, fontWeight: 850, lineHeight: 1.14, color: 'rgba(255,255,255,0.76)', textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewChecklist({ card }: { card: MotionCard }) {
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);
  return (
    <div style={{ position: 'absolute', inset: '7% 7%' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 4, display: 'grid', gridTemplateColumns: '0.92fr 1fr', gap: 10, alignItems: 'end' }}>
        <div style={{ display: 'grid', gap: 5 }}>
          <div style={{ color: card.accentColor, fontSize: 9, fontWeight: 950, textTransform: 'uppercase' }}>{card.kicker}</div>
          <PreviewLineStack lines={headlineLines} style={{ fontSize: headlineLines.join('').length > 18 ? 21 : 25, fontWeight: 950, lineHeight: 0.9, textTransform: 'uppercase' }} />
        </div>
        <PreviewLineStack lines={subheadLines} style={{ color: 'rgba(255,255,255,0.84)', fontSize: 10, fontWeight: 800, lineHeight: 1.12, paddingBottom: 2 }} />
      </div>
      <div style={{ position: 'absolute', left: 12, top: '31%', bottom: '18%', width: 5, borderRadius: 999, background: `linear-gradient(180deg, ${card.accentColor}, rgba(255,255,255,0.16))` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '30%', display: 'grid', gap: 9 }}>
        {card.bullets.map((bullet, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={bullet} style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: 9, alignItems: 'center', marginLeft: isEven ? 0 : 38, width: isEven ? '96%' : '82%' }}>
              <span style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 999, background: card.accentColor, color: '#111', fontSize: 11, fontWeight: 950 }}>
                {index + 1}
              </span>
              <span style={{ minHeight: 43, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: isEven ? '11px 11px 11px 4px' : '11px 11px 4px 11px', background: index === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.2)', fontSize: String(bullet).length > 13 ? 12 : 14, fontWeight: 950, lineHeight: 1, textTransform: 'uppercase' }}>
                {bullet}
              </span>
            </div>
          );
        })}
      </div>
      <PreviewLineStack lines={footerLines} style={{ position: 'absolute', left: 18, right: 18, bottom: 14, textAlign: 'center', color: 'rgba(255,255,255,0.72)', fontSize: 10, fontWeight: 850, lineHeight: 1.14, textTransform: 'uppercase' }} />
    </div>
  );
}

function PreviewGeneric({ card }: { card: MotionCard }) {
  return (
    <div style={{ position: 'absolute', inset: '7% 8%', display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(17,24,39,0.9)' }}>
      <PreviewShell card={card} />
      <div style={{ display: 'grid', gap: 6, marginTop: 'auto' }}>
        {card.bullets.map((bullet, index) => (
          <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: 7, minHeight: 28, borderRadius: 7, padding: '5px 7px', background: 'rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 850 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 18, height: 18, borderRadius: 999, background: card.accentColor, color: '#111', fontSize: 10, fontWeight: 950 }}>
              {index + 1}
            </span>
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewActionsBar({
  finalizeDisabled,
  submitDisabled,
  missingScenes,
  onFinalize,
  onSubmitPass,
  busyAction,
  status,
}: {
  finalizeDisabled: boolean;
  submitDisabled: boolean;
  missingScenes: number[];
  onFinalize: () => void;
  onSubmitPass: () => void;
  busyAction: string;
  status: string;
}) {
  const isFinalized = status === 'visuals_approved';
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 8 }}>
      <button
        onClick={onSubmitPass}
        disabled={submitDisabled || isFinalized}
        style={{
          minHeight: 42,
          border: 0,
          borderRadius: 6,
          padding: '0 16px',
          background: submitDisabled || isFinalized ? '#a8a29e' : '#2563eb',
          color: '#fff',
          fontWeight: 900,
          cursor: submitDisabled || isFinalized ? 'not-allowed' : 'pointer',
        }}
      >
        {busyAction === 'submit_pass' ? 'Saving review pass...' : status === 'replacement_requested' ? 'Update review pass' : 'Submit review pass'}
      </button>
      <button
        onClick={onFinalize}
        disabled={finalizeDisabled || isFinalized}
        style={{
          minHeight: 42,
          border: 0,
          borderRadius: 6,
          padding: '0 16px',
          background: finalizeDisabled || isFinalized ? '#a8a29e' : '#111827',
          color: '#fff',
          fontWeight: 900,
          cursor: finalizeDisabled || isFinalized ? 'not-allowed' : 'pointer',
        }}
      >
        {busyAction === 'finalize' ? 'Finalizing...' : isFinalized ? 'Visual review finalized' : 'Finalize visual review'}
      </button>
      {isFinalized ? (
        <span style={{ color: '#146c43', fontSize: 13, fontWeight: 800 }}>
          Final approval saved. Voice and Remotion prep can begin.
        </span>
      ) : missingScenes.length > 0 ? (
        <span style={{ color: '#7c2d12', fontSize: 13, fontWeight: 800 }}>
          Complete visual or motion-card selections for scenes {missingScenes.join(', ')} before finalizing.
        </span>
      ) : (
        <span style={{ color: '#146c43', fontSize: 13, fontWeight: 800 }}>
          All scenes have a selected visual or approved motion card.
        </span>
      )}
    </div>
  );
}

function StatusPanel({
  payload,
  message,
  missingScenes,
  savingId,
}: {
  payload: Payload;
  message: string;
  missingScenes: number[];
  savingId: string;
}) {
  if (savingId === 'finalize' || savingId === 'submit_pass') {
    return (
      <div style={statusPanelStyle('#1d4ed8', '#eff6ff')}>
        <strong>{savingId === 'finalize' ? 'Finalizing visual approval...' : 'Saving review pass...'}</strong>
        <span>The manifest is being written. Keep this page open for a moment.</span>
      </div>
    );
  }

  if (message) {
    return (
      <div style={statusPanelStyle('#44403c', '#fafaf9')}>
        <strong>Saved</strong>
        <span>{message}</span>
      </div>
    );
  }

  if (payload.status === 'visuals_approved') {
    return (
      <div style={statusPanelStyle('#146c43', '#ecfdf5')}>
        <strong>Visual review finalized</strong>
        <span>{payload.nextStep || 'Next: generate ElevenLabs narration audio, then prepare the Remotion preview.'}</span>
      </div>
    );
  }

  if (payload.status === 'replacement_requested') {
    return (
      <div style={statusPanelStyle('#9a3412', '#fff7ed')}>
        <strong>Review pass submitted</strong>
        <span>{payload.nextStep || 'Replacement requests were saved. Source new candidates, then come back to rank them.'}</span>
      </div>
    );
  }

  if (payload.motionCardStatus === 'motion_cards_approved' && missingScenes.length > 0) {
    return (
      <div style={statusPanelStyle('#146c43', '#ecfdf5')}>
        <strong>Motion-card choices saved</strong>
        <span>Motion scenes have approved choices. Complete the remaining ranked visuals, then finalize the visual review.</span>
      </div>
    );
  }

  if (missingScenes.length === 0) {
    return (
      <div style={statusPanelStyle('#146c43', '#ecfdf5')}>
        <strong>Ready to finalize</strong>
        <span>All scenes have a selected visual or approved motion card. Press Finalize visual review when this pass looks right.</span>
      </div>
    );
  }

  return null;
}

function pillStyle(color: string): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 28,
    borderRadius: 999,
    padding: '4px 10px',
    background: `${color}14`,
    color,
    fontSize: 12,
    fontWeight: 800,
  };
}

const labelStyle: CSSProperties = {
  margin: 0,
  color: '#78716c',
  fontSize: 12,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 0,
};

const bodyStyle: CSSProperties = {
  margin: 0,
  color: '#292524',
  fontSize: 15,
  lineHeight: 1.55,
};

const smallMetaStyle: CSSProperties = {
  color: '#57534e',
  fontSize: 13,
  lineHeight: 1.4,
};

const miniBlockStyle: CSSProperties = {
  margin: 0,
  color: '#44403c',
  fontSize: 12,
  lineHeight: 1.45,
};

function statusPanelStyle(color: string, background: string): CSSProperties {
  return {
    display: 'grid',
    gap: 4,
    marginTop: 10,
    padding: '14px 16px',
    border: `1px solid ${color}33`,
    borderRadius: 8,
    background,
    color,
    fontSize: 14,
    lineHeight: 1.45,
  };
}

function buttonStyle(background: string): CSSProperties {
  return {
    minHeight: 36,
    border: 0,
    borderRadius: 6,
    background,
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  };
}

function rankButtonStyle(active: boolean): CSSProperties {
  return {
    minHeight: 28,
    border: 0,
    borderRadius: 5,
    background: active ? '#2563eb' : '#e7e5e4',
    color: active ? '#fff' : '#292524',
    fontWeight: 900,
    cursor: 'pointer',
  };
}
