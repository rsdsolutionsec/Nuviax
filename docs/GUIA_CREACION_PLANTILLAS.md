# GUÍA MAESTRA DE CREACIÓN DE PLANTILLAS CON CÓDIGO — NUVIAX (RSD SOLUTIONS)

Esta guía explica detalladamente la arquitectura, flujo y pasos técnicos para que el equipo de desarrollo de RSD Solutions pueda **crear plantillas con código**, integrando animaciones, música, paletas dinámicas, interactividad, botones funcionales y componentes visuales editables.

---

## 1. Filosofía de Arquitectura de Plantillas en Nuviax

En Nuviax, las plantillas no son PDFs estáticos ni páginas web rígidas:
- **El Código React (`src/templates/designs/`)** define el diseño visual, la tipografía artística, las animaciones (CSS/Tailwind), la ambientación de fondo, la disposición de elementos y los micro-componentes interactivos.
- **La Base de Datos (Supabase `events.content_data` y `events.visual_theme`)** almacena los datos personalizados que el cliente edita desde su panel de control (nombres, fechas, ubicaciones, fotos de galería subidas a Supabase Storage, música, código de vestimenta, datos bancarios).
- **El Registry (`src/templates/registry.ts`)** conecta el código único de la plantilla (ej. `BOD-001`, `XV-001`) con el componente React correspondiente.
- **El `TemplateRenderer` (`src/templates/TemplateRenderer.tsx`)** orquesta la carga de la plantilla en las 4 vistas del sistema:
  1. Invitación Pública Oficial (`/[slug]`)
  2. Demostración Privada para el Anfitrión (`/preview/[token]`)
  3. Demostración en Vivo del Catálogo (`/demo/[template]`)
  4. Vista Previa en Tiempo Real del Editor (`/dashboard/events/[id]/edit`)

---

## 2. Contrato Técnico de Props (`InvitationTemplateProps`)

Toda plantilla desarrollada con código debe recibir la interfaz universal definida en `src/templates/types.ts`:

```typescript
export interface InvitationTemplateProps {
  // Datos base del evento en Supabase
  event: {
    id: string
    title: string
    slug: string
    event_date?: string | null
    status?: 'draft' | 'published' | 'expired'
  }
  
  // Contenido editable rellenado por el usuario
  content: {
    title?: string
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
    }>
    dress_code?: string
    gifts?: {
      message?: string
      bank_details?: string
      registry_url?: string
    }
    gallery?: string[] // URLs de fotos subidas a Supabase Storage
    music_url?: string  // URL del archivo de audio MP3
    music_title?: string
  }

  // Paleta de colores e identidad visual editable
  theme: {
    primary_color?: string
    secondary_color?: string
    background_color?: string
    accent_color?: string
    heading_font?: string
    body_font?: string
  }

  // Reglas y límites del plan contratado (Esencial, Interactiva, Evento Pro)
  plan: {
    allow_rsvp?: boolean
    allow_advanced_rsvp?: boolean
    allow_countdown?: boolean
    allow_music?: boolean
    max_gallery_photos?: number
    max_companions_per_guest?: number
    remove_watermark?: boolean
  }

  // Banderas de entorno
  isDemo?: boolean
  isReadOnly?: boolean
  invitationToken?: string

  // Datos del invitado para pases personalizados
  guest?: {
    name: string
    authorizedCompanions: number
    dietaryRestrictions?: string
  }
}
```

---

## 3. Guía Paso a Paso para Crear una Nueva Plantilla

### Paso 1: Crear la Carpeta del Diseño
Crea una carpeta dentro de `src/templates/designs/` con el nombre de tu plantilla:
```bash
src/templates/designs/quince-neon-glow/index.tsx
```

### Paso 2: Desarrollar el Componente React con Animaciones y Botones
Aquí tienes una estructura lista para usar con todos los elementos clave:

```tsx
'use client'

import { useState } from 'react'
import { InvitationTemplateProps } from '@/templates/types'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import { PublicRsvpModal } from '@/components/invitation/PublicRsvpModal'
import { BackgroundMusicPlayer } from '@/components/invitation/BackgroundMusicPlayer'
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  Shirt,
  Copy,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'

export function QuinceNeonGlowTemplate({
  event,
  content,
  theme,
  plan,
  guest,
  invitationToken,
  isDemo = false,
}: InvitationTemplateProps) {
  const [copiedBank, setCopiedBank] = useState(false)

  // 1. Valores dinámicos con respaldo elegante
  const title = content.title || event.title || 'Mis XV Años'
  const subtitle = content.subtitle || 'Una Noche Mágica'
  const eventDate = content.date || event.event_date

  // 2. Colores reactivos al tema que escoja el cliente
  const primaryColor = theme.primary_color || '#F43F5E' // Rosa Neón por defecto
  const accentColor = theme.accent_color || '#8B5CF6'   // Púrpura Eléctrico
  const bgColor = theme.background_color || '#070510'

  const copyBankData = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2500)
  }

  return (
    <div
      className="min-h-screen text-[#F8FAFC] font-sans antialiased relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* A. MÚSICA DE FONDO (Si el plan lo permite y hay URL configurada) */}
      {plan.allow_music && content.music_url && (
        <BackgroundMusicPlayer
          musicUrl={content.music_url}
          musicTitle={content.music_title || 'Melodía de Entrada'}
        />
      )}

      {/* B. EFECTOS VISUALES Y ANIMACIONES DE FONDO */}
      <div
        className="fixed top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none opacity-25 animate-pulse"
        style={{ backgroundColor: primaryColor }}
      />

      {/* C. PASE PERSONALIZADO PARA EL INVITADO */}
      {guest && (
        <div className="relative z-30 bg-white/5 border-b border-white/10 px-6 py-2.5 text-center backdrop-blur-md">
          <p className="text-xs text-slate-300">
            Invitación de Honor para: <strong className="text-white">{guest.name}</strong>
            <span className="mx-2">·</span>
            <span className="text-rose-400 font-mono">
              {guest.authorizedCompanions === 1 ? '1 Pase' : `${guest.authorizedCompanions} Pases`}
            </span>
          </p>
        </div>
      )}

      {/* D. SECCIÓN HERO */}
      <header className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-rose-400 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] font-semibold text-rose-300">
          {subtitle}
        </p>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white mt-4 tracking-tight">
          {title}
        </h1>

        {content.quote && (
          <p className="italic text-sm text-slate-400 max-w-lg mt-6 border-y border-white/10 py-3">
            "{content.quote}"
          </p>
        )}

        {/* E. CUENTA REGRESIVA */}
        {plan.allow_countdown && eventDate && (
          <div className="pt-8">
            <CountdownTimer targetDate={eventDate} />
          </div>
        )}
      </header>

      {/* F. UBICACIONES CON BOTONES DE GOOGLE MAPS */}
      <main className="max-w-4xl mx-auto px-4 pb-24 space-y-16">
        {content.reception && (
          <section className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.reception.name || 'Recepción'}</h3>
            <p className="text-sm text-slate-300">{content.reception.location_name}</p>
            {content.reception.address && <p className="text-xs text-slate-400">{content.reception.address}</p>}
            
            {content.reception.map_url && (
              <a
                href={content.reception.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>Cómo Llegar (Google Maps)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </section>
        )}

        {/* G. GALERÍA DE IMÁGENES SUBIDAS POR EL CLIENTE */}
        {content.gallery && content.gallery.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center">Sesión de Fotos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {content.gallery.slice(0, plan.max_gallery_photos || 10).map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* H. DATOS DE REGALO CON BOTÓN COPIAR */}
        {content.gifts?.bank_details && (
          <section className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Mesa de Regalos & Transferencia</h4>
            <p className="text-xs text-slate-400">{content.gifts.message}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => copyBankData(content.gifts!.bank_details!)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-all"
              >
                {copiedBank ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBank ? '¡Datos Copiados!' : 'Copiar Datos Bancarios'}</span>
              </button>
            </div>
          </section>
        )}

        {/* I. BOTÓN INTERACTIVO RSVP (CONFIRMACIÓN DE ASISTENCIA) */}
        <section className="text-center py-12 p-6 rounded-3xl bg-gradient-to-b from-rose-950/30 to-black/50 border border-rose-500/30 space-y-6">
          <h2 className="text-3xl font-extrabold text-white">¿Nos Acompañas?</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Por favor confirma tu presencia para reservar tu lugar especial en mi fiesta.
          </p>
          <div className="flex justify-center">
            <PublicRsvpModal
              eventSlug={event.slug}
              eventTitle={title}
              maxCompanions={guest?.authorizedCompanions ?? plan.max_companions_per_guest ?? 2}
              initialGuestName={guest?.name}
              invitationToken={invitationToken}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
```

---

### Paso 3: Registrar la Plantilla en `src/templates/registry.ts`

Abre `src/templates/registry.ts` y asocia el código único de la plantilla con el componente:

```typescript
import { QuinceNeonGlowTemplate } from '@/templates/designs/quince-neon-glow'

export const TEMPLATE_REGISTRY: Record<string, ComponentType<InvitationTemplateProps>> = {
  // Bodas
  'BOD-001': BodaImperialGoldTemplate,
  'boda-imperial-gold': BodaImperialGoldTemplate,

  // Quinceañeras
  'XV-001': QuinceNeonGlowTemplate,
  'quince-neon-glow': QuinceNeonGlowTemplate,
}
```

---

### Paso 4: Registrar la Plantilla en la Plataforma (Base de Datos)

Para que los usuarios puedan verla en el catálogo, seleccionarla al crear un evento y editarla en el panel, debe existir en la tabla `templates` de Supabase.

Tienes **2 opciones**:

#### Opción A (Visual — Recomendada para Administradores):
1. Inicia sesión como administrador en `http://localhost:3000/login`
2. Ve al panel de control de plantillas: `http://localhost:3000/admin/templates`
3. Haz clic en **"Crear Nueva Plantilla"** (`/admin/templates/new`)
4. Llena los datos:
   - **Código:** `XV-001`
   - **Slug:** `quince-neon-glow`
   - **Nombre:** Quinceañera Neón Glow
   - **Categoría:** Quinceañeras
   - **Desarrollador Responsable:** Robin / RSD Team
   - **Plan Mínimo Requerido:** Interactiva o Evento Pro
   - **Opciones de Tema por Defecto:** `#F43F5E` (Primario), `#8B5CF6` (Acento), `Plus Jakarta Sans` (Fuente)
   - **Activa:** Sí
5. Guarda y ¡listo! La plantilla aparecerá inmediatamente en el catálogo.

#### Opción B (Mediante SQL o Migración en Supabase):
```sql
INSERT INTO public.templates (
  code,
  slug,
  name,
  category_id,
  min_plan_id,
  developer_track,
  artistic_style,
  thumbnail_url,
  preview_url,
  schema_definition,
  example_data,
  is_active
) VALUES (
  'XV-001',
  'quince-neon-glow',
  'Quinceañera Neón Glow',
  (SELECT id FROM public.categories WHERE slug = 'quinceanera' LIMIT 1),
  (SELECT id FROM public.plans WHERE code = 'interactive' LIMIT 1),
  'Robin (RSD Solutions)',
  'Neón Futurista y Vibrante',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  '/demo/XV-001',
  '{"theme_options": {"primary_color": "#F43F5E", "accent_color": "#8B5CF6", "heading_font": "Plus Jakarta Sans"}}'::jsonb,
  '{"title": "Mis 15 Años", "subtitle": "Sofía Valentina"}'::jsonb,
  true
);
```

---

## 4. ¿Cómo Funciona la Edición de Elementos Complejos?

| Elemento | ¿Cómo lo edita el cliente? | ¿Cómo lo recibe la plantilla en código? |
| :--- | :--- | :--- |
| **Textos y Citas** | Inputs de texto en el tab *Detalles* del editor. | `content.title`, `content.subtitle`, `content.quote` |
| **Colores y Fuentes** | Selectores de color en el editor. | `theme.primary_color`, `theme.accent_color` aplicados a estilos CSS o Tailwind. |
| **Música de Fondo** | Sube un archivo MP3 o pega un enlace de audio. | `content.music_url` recibido por `<BackgroundMusicPlayer musicUrl={content.music_url} />` |
| **Subida de Imágenes** | Arrastra fotos a la galería (almacenadas en Supabase Storage). | `content.gallery` (array de URLs de imágenes optimizadas). |
| **Botones de Ubicación** | Escribe dirección y enlace de Google Maps. | `content.ceremony.map_url`, `content.reception.map_url`. |
| **Regalos / Datos Bancarios**| Escribe mensaje y número de cuenta / CBU / Alias. | `content.gifts.bank_details` con botón de copia con feedback instantáneo. |
| **Confirmación RSVP** | El anfitrión activa preguntas dietéticas y cupos. | `<PublicRsvpModal eventSlug={event.slug} />` registra directamente en Supabase y dispara confeti visual. |

---

## 5. Pruebas y Validación de la Plantilla

Cada vez que crees una plantilla, puedes probarla inmediatamente en:
1. **Catálogo:** Visita `/catalog` y busca tu diseño.
2. **Demo en Vivo:** Visita `/demo/XV-001` (o tu código) para interactuar con la música, el mapa y el modal de RSVP simulado.
3. **Editor:** Crea un evento de prueba en `/dashboard/events/new?template=XV-001` y verifica que cada cambio de texto o color se refleje en la vista previa del teléfono celular.
4. **Enlace Público:** Publica el evento y ábrelo en `/[slug]` y en modo invitado con `/[slug]?t=<token_invitado>`.
