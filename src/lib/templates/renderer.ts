export function getTemplateFontClass(fontName?: string): string {
  switch (fontName) {
    case 'Cinzel':
      return 'font-cinzel'
    case 'Playfair Display':
      return 'font-playfair'
    case 'Cormorant Garamond':
      return 'font-cormorant'
    case 'Montserrat':
      return 'font-montserrat'
    case 'Syne':
      return 'font-syne'
    case 'Outfit':
      return 'font-outfit'
    case 'Plus Jakarta Sans':
      return 'font-jakarta'
    default:
      return 'font-cinzel'
  }
}

export function getTemplateBodyFontClass(fontName?: string): string {
  switch (fontName) {
    case 'Montserrat':
      return 'font-montserrat'
    case 'Outfit':
      return 'font-outfit'
    case 'Plus Jakarta Sans':
      return 'font-jakarta'
    default:
      return 'font-sans'
  }
}

export interface TemplateThemeColors {
  primary?: string
  secondary?: string
  background?: string
  accent?: string
}

export function buildTemplateStyleVariables(theme?: TemplateThemeColors) {
  if (!theme) return {}

  return {
    '--tpl-primary': theme.primary || '#D4AF37',
    '--tpl-secondary': theme.secondary || '#EC4899',
    '--tpl-bg': theme.background || '#070510',
    '--tpl-accent': theme.accent || '#8B5CF6',
  } as React.CSSProperties
}
