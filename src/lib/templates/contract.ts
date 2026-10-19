import { z } from 'zod'

export const FONT_OPTIONS = [
  { id: 'Cinzel', name: 'Cinzel (Romano Clásico / Bodas de Gala)', class: 'font-cinzel' },
  { id: 'Playfair Display', name: 'Playfair Display (Editorial / Tradicional)', class: 'font-playfair' },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond (Poético / Romántico)', class: 'font-cormorant' },
  { id: 'Montserrat', name: 'Montserrat (Moderno / Contemporáneo)', class: 'font-montserrat' },
  { id: 'Syne', name: 'Syne (Audaz / Vanguardista / Tech)', class: 'font-syne' },
  { id: 'Outfit', name: 'Outfit (Limpio / Sofisticado)', class: 'font-outfit' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Geométrico / Fresco)', class: 'font-jakarta' },
]

export const ARTISTIC_STYLES = [
  'Gala Clásica Imperial',
  'Orgánico & Campestre Chic',
  'Minimalista & Editorial',
  'Boho Sunset & Terracota',
  'Nocturno & Cóctel VIP',
  'Cyberpunk & Neón Vibrante',
  'Cálido & Pool Party',
  'Cuento de Hadas & Rosas',
  'Cosmos & Noche Estrellada',
  'Infantil Ilustrado & Aventura',
  'Ternura Pastel & Acuarela',
  'Espiritual & Ramas de Olivo',
  'Puro & Blanco Marfil',
  'Académico de Gala & Birrete',
  'Tecnológico & Vanguardia',
  'Plata Noble & Sobriedad',
]

export const AVAILABLE_SECTIONS = [
  { id: 'hero', name: 'Portada Principal / Hero', required: true },
  { id: 'countdown', name: 'Cuenta Regresiva en Tiempo Real' },
  { id: 'quote', name: 'Frase / Pensamiento Especial' },
  { id: 'ceremony', name: 'Ceremonia Religiosa / Protocolaria' },
  { id: 'reception', name: 'Recepción / Fiesta' },
  { id: 'itinerary', name: 'Itinerario Paso a Paso' },
  { id: 'gallery', name: 'Galería de Fotografías' },
  { id: 'dress_code', name: 'Código de Vestimenta (Dress Code)' },
  { id: 'gifts', name: 'Mesa de Regalos / Lluvia de Sobres' },
  { id: 'music', name: 'Música Ambiental de Fondo' },
  { id: 'rsvp', name: 'Formulario de Confirmación RSVP' },
]

export const CreateTemplateSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'El código solo puede contener letras, números, guiones y guiones bajos'),
  name: z.string().min(3).max(100),
  category_id: z.string().uuid('Debe seleccionar una categoría válida'),
  description: z.string().min(10).max(500),
  thumbnail_url: z.string().url('Debe ser una URL de imagen válida'),
  artistic_style: z.string().min(3).max(100),
  assigned_developer: z.string().default('Robin (Admin)'),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('published'),
  is_active: z.boolean().default(true),
  theme_options: z.object({
    heading_font: z.string().default('Cinzel'),
    body_font: z.string().default('Plus Jakarta Sans'),
    primary_color: z.string().default('#D4AF37'),
    secondary_color: z.string().default('#EC4899'),
    background_color: z.string().default('#070510'),
    accent_color: z.string().default('#7C3AED'),
  }),
  allowed_sections: z.array(z.string()).default(['hero', 'countdown', 'quote', 'ceremony', 'reception', 'itinerary', 'gallery', 'dress_code', 'gifts', 'rsvp']),
  supports_music: z.boolean().default(true),
  supports_gallery: z.boolean().default(true),
  supports_countdown: z.boolean().default(true),
  example_data: z.record(z.string(), z.any()).default({}),
})

export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>
