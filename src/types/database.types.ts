export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type EventStatus = 'draft' | 'published' | 'expired' | 'archived'
export type RsvpStatus = 'pending' | 'confirmed' | 'declined'
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
export type UserRole = 'admin' | 'advisor' | 'support' | 'customer'
export type TemplateStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserRoleRecord {
  id: string
  user_id: string
  role: UserRole
  granted_at: string
}

export interface Category {
  id: string
  code: string
  name: string
  description: string | null
  icon_name: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface PlanLimits {
  max_gallery_photos: number
  max_guests: number
  allow_rsvp: boolean
  allow_countdown: boolean
  allow_custom_slug: boolean
  allow_export_csv: boolean
  allow_custom_domain: boolean
  allow_music: boolean
  remove_watermark: boolean
}

export interface Plan {
  id: string
  code: string
  name: string
  description: string | null
  price_usd: number
  duration_days: number
  limits: PlanLimits
  is_active: boolean
  display_order: number
  created_at: string
}

export interface TemplateSchemaDefinition {
  allowed_sections: string[]
  supports_music: boolean
  supports_gallery: boolean
  supports_countdown: boolean
  theme_options?: {
    primary_color?: string
    secondary_color?: string
    background_style?: string
    font_heading?: string
    font_body?: string
    [key: string]: Json | undefined
  }
}

export interface Template {
  id: string
  category_id: string
  code: string
  name: string
  description: string | null
  thumbnail_url: string | null
  preview_url: string | null
  schema_definition: TemplateSchemaDefinition
  default_config: Record<string, Json>
  compatible_plans: string[]
  is_active: boolean
  display_order: number
  version: number
  status: TemplateStatus
  assigned_developer: string | null
  artistic_style: string | null
  quality_checklist: Record<string, boolean>
  created_at: string
  updated_at: string
}

export interface EventContentData {
  title: string
  subtitle?: string
  hosts?: string
  quote?: string
  date?: string
  ceremony?: {
    name?: string
    time?: string
    location_name?: string
    address?: string
    map_url?: string
  }
  reception?: {
    name?: string
    time?: string
    location_name?: string
    address?: string
    map_url?: string
  }
  itinerary?: Array<{
    time: string
    title: string
    description?: string
    icon?: string
  }>
  dress_code?: string
  gifts?: {
    type?: string
    message?: string
    bank_info?: string
  }
  gallery?: string[]
  music_url?: string
  rsvp_settings?: {
    deadline?: string
    allow_open_rsvp?: boolean
    max_companions_per_guest?: number
    ask_dietary?: boolean
  }
  [key: string]: Json | undefined
}

export interface EventVisualTheme {
  primary_color?: string
  secondary_color?: string
  background_style?: string
  font_heading?: string
  font_body?: string
}

export interface EventRecord {
  id: string
  user_id: string
  template_id: string
  plan_id: string
  title: string
  slug: string
  status: EventStatus
  content_data: EventContentData
  visual_theme: EventVisualTheme
  event_date: string | null
  published_at: string | null
  expires_at: string | null
  is_private: boolean
  private_passcode: string | null
  demo_token: string | null
  demo_expires_at: string | null
  demo_revoked: boolean
  template_version: number
  entitlement_overrides: Record<string, Json>
  views_count: number
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  event_id: string
  first_name: string
  last_name: string
  group_name: string | null
  invitation_token: string
  authorized_companions: number
  confirmed_companions: number
  rsvp_status: RsvpStatus
  rsvp_responded_at: string | null
  dietary_restrictions: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  event_id: string
  plan_id: string
  amount: number
  currency: string
  status: OrderStatus
  snapshot_features: Record<string, Json>
  duration_days: number
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  order_id: string
  provider: string
  external_transaction_id: string | null
  amount: number
  status: string
  raw_payload: Json | null
  created_at: string
}

export interface AdminException {
  id: string
  event_id: string
  admin_id: string
  action_type: string
  reason: string
  previous_value: Json | null
  new_value: Json | null
  expires_at: string | null
  created_at: string
}
