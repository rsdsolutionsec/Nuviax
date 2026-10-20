import { ComponentType } from 'react'
import { InvitationTemplateProps } from '@/templates/types'
import { UniversalBaseTemplate } from '@/templates/UniversalBaseTemplate'
import { BodaImperialGoldTemplate } from '@/templates/designs/boda-imperial-gold'

/**
 * Normalizes template codes/slugs (including alphanumeric IDs like BOD-001)
 * to the actual production codes stored in the `templates` database table.
 */
export const TEMPLATE_CODE_MAP: Record<string, string> = {
  // BODAS & COMPROMISOS (Programador A)
  'bod-001': 'boda-elegance-gold',
  'boda-imperial-gold': 'boda-elegance-gold',
  'boda-elegance-gold': 'boda-elegance-gold',

  'bod-002': 'boda-botanica-minimal',
  'boda-jardin-botanico': 'boda-botanica-minimal',
  'boda-botanica-minimal': 'boda-botanica-minimal',

  'bod-003': 'boda-dark-romance',
  'boda-minimalista-noir': 'boda-dark-romance',
  'boda-dark-romance': 'boda-dark-romance',

  'bod-004': 'boda-boho-sunset',
  'boda-bohemia-terracota': 'boda-boho-sunset',
  'boda-boho-sunset': 'boda-boho-sunset',

  // ANIVERSARIOS & PAREJAS (Programador A)
  'par-001': 'aniv-silver-jubilee',
  'aniversario-bodas-de-plata': 'aniv-silver-jubilee',
  'aniv-silver-jubilee': 'aniv-silver-jubilee',

  'par-002': 'compromiso-champagne',
  'compromiso-romantico': 'compromiso-champagne',
  'compromiso-champagne': 'compromiso-champagne',

  // QUINCEAÑERAS (Programador B)
  'qui-001': 'quince-princesa-rosea',
  'quinceanera-princesa-rose': 'quince-princesa-rosea',
  'quince-princesa-rosea': 'quince-princesa-rosea',

  'qui-002': 'quince-glam-sparkle',
  'quinceanera-midnight-star': 'quince-glam-sparkle',
  'quince-glam-sparkle': 'quince-glam-sparkle',

  // CUMPLEAÑOS ADULTOS (Programador B)
  'cum-001': 'cumple-vintage-jazz',
  'cumpleanos-midnight-glam': 'cumple-vintage-jazz',
  'cumple-vintage-jazz': 'cumple-vintage-jazz',

  'cum-002': 'cumple-neon-fest',
  'neon-party-retro-wave': 'cumple-neon-fest',
  'cumple-neon-fest': 'cumple-neon-fest',

  'cum-003': 'gala-corporativa-lux',
  'tropical-sunset-celebration': 'gala-corporativa-lux',

  // INFANTILES (Programador B)
  'kis-001': 'cumple-kids-aventura',
  'aventura-galactica-kids': 'cumple-kids-aventura',
  'cumple-kids-aventura': 'cumple-kids-aventura',

  'kis-002': 'cumple-kids-safari',
  'cumple-kids-safari': 'cumple-kids-safari',

  // BABY SHOWERS (Programador C)
  'bab-001': 'baby-shower-pastel',
  'baby-shower-dulce-nube': 'baby-shower-pastel',
  'baby-shower-pastel': 'baby-shower-pastel',

  'bab-002': 'baby-revelacion-luz',
  'baby-revelacion-sexo': 'baby-revelacion-luz',
  'baby-revelacion-luz': 'baby-revelacion-luz',

  // BAUTIZOS (Programador C)
  'bau-001': 'bautizo-luz-celestial',
  'bautizo-angeles-olivo': 'bautizo-luz-celestial',
  'bautizo-luz-celestial': 'bautizo-luz-celestial',

  'bau-002': 'bautizo-luz-celestial',
  'bautizo-celeste-luz': 'bautizo-luz-celestial',

  // GRADUACIONES (Programador C)
  'gra-001': 'graduacion-laurel-oro',
  'graduacion-magna-cum-laude': 'graduacion-laurel-oro',
  'graduacion-laurel-oro': 'graduacion-laurel-oro',

  'gra-002': 'graduacion-modern-tech',
  'graduacion-vanguardia-moderna': 'graduacion-modern-tech',
  'graduacion-modern-tech': 'graduacion-modern-tech',

  // CORPORATIVO (Programador C)
  'corp-001': 'gala-corporativa-lux',
  'gala-corporativa-lux': 'gala-corporativa-lux',
}

export function normalizeTemplateCode(codeOrSlug?: string | null): string {
  if (!codeOrSlug) return 'boda-elegance-gold'
  const clean = codeOrSlug.toLowerCase().trim()
  return TEMPLATE_CODE_MAP[clean] || clean
}

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
  'boda-boho-chic': BodaImperialGoldTemplate,
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

  // 3. Try mapped code
  const mapped = normalizeTemplateCode(codeOrSlug)
  if (TEMPLATE_REGISTRY[mapped]) {
    return TEMPLATE_REGISTRY[mapped]
  }

  // 4. Fallback to universal declarative template
  return UniversalBaseTemplate
}
