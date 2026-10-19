import { PlanLimits } from '@/types/database.types'

export type PlanFeatureKey =
  | 'allow_rsvp'
  | 'allow_countdown'
  | 'allow_custom_slug'
  | 'allow_export_csv'
  | 'allow_custom_domain'
  | 'allow_music'
  | 'remove_watermark'

export interface PlanConfig {
  code: string
  name: string
  priceUsd: number
  durationDays: number
  limits: PlanLimits
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  essential: {
    code: 'essential',
    name: 'Esencial',
    priceUsd: 19.99,
    durationDays: 30,
    limits: {
      max_gallery_photos: 0,
      max_guests: 50,
      allow_rsvp: false,
      allow_countdown: false,
      allow_custom_slug: true,
      allow_export_csv: false,
      allow_custom_domain: false,
      allow_music: false,
      remove_watermark: false,
    },
  },
  interactive: {
    code: 'interactive',
    name: 'Interactiva',
    priceUsd: 29.99,
    durationDays: 90,
    limits: {
      max_gallery_photos: 8,
      max_guests: 150,
      allow_rsvp: true,
      allow_countdown: true,
      allow_custom_slug: true,
      allow_export_csv: false,
      allow_custom_domain: false,
      allow_music: true,
      remove_watermark: false,
    },
  },
  event_pro: {
    code: 'event_pro',
    name: 'Evento Pro',
    priceUsd: 49.99,
    durationDays: 180,
    limits: {
      max_gallery_photos: 24,
      max_guests: 500,
      allow_rsvp: true,
      allow_countdown: true,
      allow_custom_slug: true,
      allow_export_csv: true,
      allow_custom_domain: true,
      allow_music: true,
      remove_watermark: true,
    },
  },
}

/**
 * Returns the plan configuration for a given plan code, falling back to 'essential'.
 */
export function getPlanConfig(planCode?: string | null): PlanConfig {
  if (!planCode || !PLAN_CONFIGS[planCode]) {
    return PLAN_CONFIGS.essential
  }
  return PLAN_CONFIGS[planCode]
}

/**
 * Centralized authorization check: verifies if a plan allows a specific feature.
 */
export function hasFeature(planCode: string | null | undefined, feature: PlanFeatureKey): boolean {
  const plan = getPlanConfig(planCode)
  return Boolean(plan.limits[feature])
}

/**
 * Checks photo gallery allowance.
 */
export function getMaxPhotos(planCode: string | null | undefined): number {
  return getPlanConfig(planCode).limits.max_gallery_photos
}

/**
 * Checks guest capacity limit.
 */
export function getMaxGuests(planCode: string | null | undefined): number {
  return getPlanConfig(planCode).limits.max_guests
}
