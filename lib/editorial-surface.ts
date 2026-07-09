import editorialSurfaceData from '@/content/data/editorial-surface.json';
import type { SectionPageKey } from '@/lib/section-pages';

export interface EditorialSlot {
  slug: string;
  reason?: string;
  pinnedSince?: string;
  reviewAfter?: string;
}

export interface HomeEditorialSurface {
  selectionMode: string;
  reviewCadence: string;
  nextReviewDate: string;
  hero: EditorialSlot;
  secondary: EditorialSlot[];
  popular: EditorialSlot[];
  plan: EditorialSlot[];
  reels: EditorialSlot[];
}

export interface SectionEditorialSurface {
  selectionMode: string;
  reviewCadence: string;
  nextReviewDate: string;
  hero: EditorialSlot;
  startHere: EditorialSlot[];
  recommended: EditorialSlot[];
}

interface EditorialSurfaceData {
  version: number;
  updatedAt: string;
  selectionMode: string;
  randomization: string;
  reviewPolicy: {
    homeCadence: string;
    categoryCadence: string;
    homeReviewDay: string;
    categoryReviewDay: string;
    replacementRule: string;
    automaticSections: string[];
    manualSections: string[];
  };
  surfaces: {
    home: HomeEditorialSurface;
  } & Record<SectionPageKey, SectionEditorialSurface>;
}

export const editorialSurface = editorialSurfaceData as EditorialSurfaceData;

export function getHomeSurface(): HomeEditorialSurface {
  return editorialSurface.surfaces.home;
}

export function getSectionSurface(key: SectionPageKey): SectionEditorialSurface {
  return editorialSurface.surfaces[key];
}

export function getSlotSlug(slot: EditorialSlot | undefined): string {
  return slot?.slug || '';
}

export function getSlotSlugs(slots: EditorialSlot[] | undefined): string[] {
  return (slots || []).map((slot) => slot.slug).filter(Boolean);
}

export function uniqueSlugs(slugs: string[]): string[] {
  return Array.from(new Set(slugs.filter(Boolean)));
}
