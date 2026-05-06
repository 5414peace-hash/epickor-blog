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

interface Payload {
  slug: string;
  title: string;
  status: string;
  minRankedVisualsPerScene: number;
  nextStep?: string;
  lastAction?: string;
  scenes: Scene[];
  candidateScenes: CandidateScene[];
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

function getCandidates(payload: Payload, sceneNumber: number): Candidate[] {
  return payload.candidateScenes.find((scene) => scene.number === sceneNumber)?.candidates || [];
}

export default function ReelsReviewClient({ initialPayload }: Props) {
  const [payload, setPayload] = useState<Payload>(initialPayload);
  const [savingId, setSavingId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const isFinalized = payload.status === 'visuals_approved';

  const progress = useMemo(() => {
    const total = payload.scenes.length;
    const approved = payload.scenes.filter((scene) => (scene.selectedImages || []).length >= payload.minRankedVisualsPerScene).length;
    const replaceNeeded = payload.candidateScenes.filter((scene) =>
      scene.candidates.some((candidate) => candidate.reviewStatus === 'replace_needed')
    ).length;
    return { total, approved, replaceNeeded };
  }, [payload.candidateScenes, payload.minRankedVisualsPerScene, payload.scenes]);

  const missingScenes = useMemo(() => {
    return payload.scenes
      .filter((scene) => (scene.selectedImages || []).length < payload.minRankedVisualsPerScene)
      .map((scene) => scene.number);
  }, [payload.minRankedVisualsPerScene, payload.scenes]);

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
            const candidates = getCandidates(payload, scene.number);
            const rankedCount = (scene.selectedImages || []).length;
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
                      <span style={pillStyle(rankedCount >= payload.minRankedVisualsPerScene ? '#146c43' : '#9a3412')}>
                        {rankedCount}/{payload.minRankedVisualsPerScene}+ ranked
                      </span>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: 10 }}>
                  {candidates.map((candidate) => (
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
                        <img
                          src={candidate.src}
                          alt={`${candidate.id} candidate`}
                          style={{
                            width: '100%',
                            aspectRatio: '4 / 3',
                            objectFit: 'cover',
                            borderRadius: 6,
                            background: '#e7e5e4',
                          }}
                        />
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
                  ))}
                </div>
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
        {busyAction === 'submit_pass' ? 'Saving review pass...' : 'Submit review pass'}
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
          Rank at least two visuals for scenes {missingScenes.join(', ')} before finalizing.
        </span>
      ) : (
        <span style={{ color: '#146c43', fontSize: 13, fontWeight: 800 }}>
          All scenes have enough ranked visuals.
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

  if (message) {
    return (
      <div style={statusPanelStyle('#44403c', '#fafaf9')}>
        <strong>Saved</strong>
        <span>{message}</span>
      </div>
    );
  }

  if (missingScenes.length === 0) {
    return (
      <div style={statusPanelStyle('#146c43', '#ecfdf5')}>
        <strong>Ready to finalize</strong>
        <span>All scenes have enough ranked visuals. Press Finalize visual review when this pass looks right.</span>
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
