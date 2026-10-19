/**
 * CONTRATO TÉCNICO DE PLANTILLAS — NUVIAX (RSD SOLUTIONS)
 * 
 * Cualquier programador que cree una plantilla debe implementar
 * este contrato de Props para garantizar compatibilidad con:
 * - Renderizador público (/[slug])
 * - Demostración privada (/preview/[token])
 * - Demostración de catálogo (/demo/[template])
 * - Vista previa del editor (/dashboard/events/[id]/edit)
 */

export interface EventCeremonyReception {
  name?: string
  time?: string
  location_name?: string
  address?: string
  map_url?: string
}

export interface EventItineraryItem {
  time: string
  title: string
  description?: string
  icon?: string
}

export interface EventContentData {
  title?: string
  subtitle?: string
  hosts?: string
  quote?: string
  date?: string
  ceremony?: EventCeremonyReception
  reception?: EventCeremonyReception
  itinerary?: EventItineraryItem[]
  dress_code?: string
  dress_code_notes?: string
  gifts?: {
    message?: string
    bank_info?: string
    bank_details?: string
    registry_url?: string
  }
  gallery?: string[]
  music_url?: string
  music_title?: string
  custom_fields?: Record<string, any>
}

export interface EventVisualTheme {
  primary_color?: string
  secondary_color?: string
  background_color?: string
  accent_color?: string
  heading_font?: string
  body_font?: string
  custom_css?: string
}

export interface PlanLimits {
  allow_rsvp?: boolean
  allow_advanced_rsvp?: boolean
  allow_countdown?: boolean
  allow_music?: boolean
  max_gallery_photos?: number
  max_companions_per_guest?: number
  custom_domain_allowed?: boolean
  analytics_level?: string
  remove_watermark?: boolean
  export_guests?: boolean
}

export interface InvitationTemplateProps {
  event: {
    id: string
    title: string
    slug: string
    event_date?: string | null
    status?: 'draft' | 'published' | 'expired'
  }
  content: EventContentData
  theme: EventVisualTheme
  plan: PlanLimits
  isDemo?: boolean
  isReadOnly?: boolean
  invitationToken?: string
  guest?: {
    name: string
    authorizedCompanions: number
    dietaryRestrictions?: string
  }
}

export interface TemplateMeta {
  code: string
  name: string
  category: string
  developer: string
  artisticStyle: string
  description: string
  thumbnailUrl: string
  supportedSections: string[]
  defaultTheme: EventVisualTheme
  defaultContent: EventContentData
}
