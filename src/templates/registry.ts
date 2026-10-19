import { ComponentType } from 'react'
import { InvitationTemplateProps } from '@/templates/types'
import { UniversalBaseTemplate } from '@/templates/UniversalBaseTemplate'
import { BodaImperialGoldTemplate } from '@/templates/designs/boda-imperial-gold'

/**
 * Registry mapping template codes and slugs to their custom React components.
 * To add a new coded template:
 * 1. Create your component in `src/templates/designs/<nombre>/index.tsx`
 * 2. Register its code or slug here in `TEMPLATE_REGISTRY`
 */
export const TEMPLATE_REGISTRY: Record<string, ComponentType<InvitationTemplateProps>> = {
  // Flagship Wedding Template (Imperial Gold / BOD-001)
  'BOD-001': BodaImperialGoldTemplate,
  'boda-imperial-gold': BodaImperialGoldTemplate,
  'boda-elegance-gold': BodaImperialGoldTemplate,
  'boda-boho-chic': BodaImperialGoldTemplate, // Can point to custom design or default
}

/**
 * Resolves a template component by code or slug.
 * If no custom component is registered, safely falls back to `UniversalBaseTemplate`.
 */
export function getTemplateComponent(
  codeOrSlug?: string | null
): ComponentType<InvitationTemplateProps> {
  if (!codeOrSlug) {
    return UniversalBaseTemplate
  }

  // 1. Try uppercase match (e.g. "BOD-001")
  const upperKey = codeOrSlug.toUpperCase()
  if (TEMPLATE_REGISTRY[upperKey]) {
    return TEMPLATE_REGISTRY[upperKey]
  }

  // 2. Try lowercase match (e.g. "boda-imperial-gold")
  const lowerKey = codeOrSlug.toLowerCase()
  if (TEMPLATE_REGISTRY[lowerKey]) {
    return TEMPLATE_REGISTRY[lowerKey]
  }

  // 3. Fallback to universal declarative template
  return UniversalBaseTemplate
}
