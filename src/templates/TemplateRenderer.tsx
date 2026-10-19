'use client'

import { getTemplateComponent } from '@/templates/registry'
import {
  EventContentData,
  EventVisualTheme,
  PlanLimits,
} from '@/templates/types'

export interface TemplateRendererProps {
  event: {
    id: string
    title: string
    slug: string
    event_date?: string | null
    content_data?: any
    visual_theme?: any
    templates?: {
      code?: string
      slug?: string
      name?: string
    } | null
    plans?: {
      name?: string
      code?: string
      limits?: any
    } | null
  }
  guest?: {
    name: string
    authorizedCompanions: number
  }
  invitationToken?: string
  isDemo?: boolean
  isReadOnly?: boolean
}

/**
 * Universal Template Renderer.
 * Determines the target design component from the registry and mounts it with full interactive props.
 */
export function TemplateRenderer({
  event,
  guest,
  invitationToken,
  isDemo = false,
  isReadOnly = false,
}: TemplateRendererProps) {
  // Resolve template code or slug
  const templateCode = event.templates?.code || event.templates?.slug || null
  const TemplateComponent = getTemplateComponent(templateCode)

  const content: EventContentData = (event.content_data as EventContentData) || {}
  const theme: EventVisualTheme = (event.visual_theme as EventVisualTheme) || {}

  // Parse plan limits with safe defaults
  const planLimits: PlanLimits = {
    allow_music: event.plans?.limits?.allow_music ?? true,
    allow_countdown: event.plans?.limits?.allow_countdown ?? true,
    max_gallery_photos: event.plans?.limits?.max_gallery_photos ?? 10,
    max_companions_per_guest: event.plans?.limits?.max_companions_per_guest ?? 2,
    custom_domain_allowed: event.plans?.limits?.custom_domain_allowed ?? false,
    analytics_level: event.plans?.limits?.analytics_level ?? 'basic',
  }

  return (
    <TemplateComponent
      event={event}
      content={content}
      theme={theme}
      plan={planLimits}
      guest={guest}
      invitationToken={invitationToken}
      isDemo={isDemo}
      isReadOnly={isReadOnly}
    />
  )
}
