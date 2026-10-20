'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { normalizeSlug, isReservedSlug } from '@/lib/slug'
import { normalizeTemplateCode } from '@/templates/registry'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface TemplateOption {
  id: string
  code: string
  name: string
  category?: { name: string }
}

function NewEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialParam = searchParams.get('template') || 'boda-elegance-gold'
  const initialTemplate = normalizeTemplateCode(initialParam)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [templateCode, setTemplateCode] = useState(initialTemplate)
  const [dbTemplates, setDbTemplates] = useState<TemplateOption[]>([])
  const [eventDate, setEventDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)

  // Fetch active templates from DB
  useEffect(() => {
    async function loadDbTemplates() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('templates')
          .select('id, code, name, category:categories(name)')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (data && data.length > 0) {
          setDbTemplates(data as unknown as TemplateOption[])
        }
      } catch {
        // Keep fallback list
      }
    }
    loadDbTemplates()
  }, [])

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug || slug === normalizeSlug(title)) {
      const generated = normalizeSlug(val)
      setSlug(generated)
      checkSlugAvailability(generated)
    }
  }

  const handleSlugChange = (val: string) => {
    const clean = normalizeSlug(val)
    setSlug(clean)
    checkSlugAvailability(clean)
  }

  const checkSlugAvailability = async (slugToCheck: string) => {
    if (!slugToCheck || slugToCheck.length < 3 || isReservedSlug(slugToCheck)) {
      setSlugAvailable(false)
      return
    }

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('events')
        .select('id')
        .eq('slug', slugToCheck)
        .maybeSingle()

      setSlugAvailable(!data)
    } catch {
      setSlugAvailable(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    if (isReservedSlug(slug)) {
      setErrorMessage('Este slug es una palabra reservada del sistema. Por favor elige otro.')
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/dashboard/events/new')
        return
      }

      // 1. Resolve template by normalized code
      const targetCode = normalizeTemplateCode(templateCode)
      let { data: template } = await supabase
        .from('templates')
        .select('id, default_config')
        .eq('code', targetCode)
        .maybeSingle()

      // If not found, try by ID if it's a UUID
      if (!template) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(templateCode)
        if (isUuid) {
          const { data: byId } = await supabase
            .from('templates')
            .select('id, default_config')
            .eq('id', templateCode)
            .maybeSingle()
          template = byId
        }
      }

      // Fallback: pick the first active template in database!
      if (!template) {
        const { data: firstTemplate } = await supabase
          .from('templates')
          .select('id, default_config')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(1)
          .maybeSingle()
        template = firstTemplate
      }

      if (!template) {
        setErrorMessage('No hay plantillas activas disponibles en el sistema. Contacta al soporte de Nuviax.')
        setIsSubmitting(false)
        return
      }

      // 2. Resolve default plan
      let { data: defaultPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('code', 'interactive')
        .maybeSingle()

      if (!defaultPlan) {
        const { data: firstPlan } = await supabase
          .from('plans')
          .select('id')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(1)
          .maybeSingle()
        defaultPlan = firstPlan
      }

      if (!defaultPlan) {
        setErrorMessage('No hay planes activos configurados en el sistema.')
        setIsSubmitting(false)
        return
      }

      const templateId = template.id
      const planId = defaultPlan.id

      const defaultContent = {
        title,
        hosts: title,
        date: eventDate ? new Date(eventDate).toISOString() : null,
        ceremony: {
          name: 'Ceremonia Principal',
          time: '18:00',
          location_name: 'Lugar del Evento',
          address: '',
        },
        reception: {
          name: 'Recepción & Fiesta',
          time: '20:00',
          location_name: '',
          address: '',
        },
        dress_code: 'Formal Elegante',
        gifts: {
          message: 'Tu presencia es nuestro mejor obsequio.',
        },
      }

      const { data: newEvent, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          template_id: templateId,
          plan_id: planId,
          title,
          slug,
          status: 'draft',
          content_data: defaultContent,
          visual_theme: {},
          event_date: eventDate ? new Date(eventDate).toISOString() : null,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          setErrorMessage('El enlace /' + slug + ' ya está reservado. Elige otro nombre.')
        } else {
          setErrorMessage(error.message)
        }
        return
      }

      router.push(`/dashboard/events/${newEvent.id}/edit`)
    } catch {
      setErrorMessage('Ocurrió un error al crear la invitación.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rsd-glow-card p-8 sm:p-10 rounded-3xl border border-purple-900/30 shadow-2xl">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Título del Evento
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ej: Boda de Ana & Carlos / Mis XV Valentina"
            className="w-full px-4 py-3.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Enlace Web Personalizado (Slug)
            </label>
            {slugAvailable === true && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Enlace disponible
              </span>
            )}
            {slugAvailable === false && (
              <span className="text-[11px] text-rose-400 font-semibold">
                No disponible
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-xs font-mono text-purple-400/70 select-none">
              nuviax.com/
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="ana-y-carlos"
              className="w-full pl-28 pr-4 py-3.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Este será el enlace directo que enviarás a tus invitados por WhatsApp.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Fecha del Evento
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 scheme-dark"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Plantilla Seleccionada (18 Diseños Disponibles)
          </label>
          <select
            value={templateCode}
            onChange={(e) => setTemplateCode(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            {dbTemplates.length > 0 ? (
              dbTemplates.map((t) => (
                <option key={t.id} value={t.code}>
                  {t.name} ({t.category?.name || 'General'})
                </option>
              ))
            ) : (
              <>
                <optgroup label="Bodas & Compromisos (Programador A)">
                  <option value="boda-elegance-gold">Elegance Gold · Gala Clásica & Oro</option>
                  <option value="boda-botanica-minimal">Botánica Minimal · Orgánico & Campestre</option>
                  <option value="boda-dark-romance">Midnight Velvet · Gala Nocturna</option>
                  <option value="boda-boho-sunset">Boho Chic Sunset · Terracota & Bohemio</option>
                </optgroup>
                <optgroup label="Aniversarios & Parejas (Programador A)">
                  <option value="aniv-silver-jubilee">Bodas de Plata & Oro · 25 y 50 Años</option>
                  <option value="compromiso-champagne">Champagne Engagement · Velada Romántica</option>
                </optgroup>
                <optgroup label="Cumpleaños Adultos (Programador B)">
                  <option value="cumple-vintage-jazz">Vintage Gatsby Night · Jazz & Años 20</option>
                  <option value="cumple-neon-fest">Neon Fest & Cocktails · Fiesta Cyberpunk</option>
                </optgroup>
                <optgroup label="Quinceañeras (Programador B)">
                  <option value="quince-princesa-rosea">Rose Princess XV · Cuento de Hadas</option>
                  <option value="quince-glam-sparkle">Glam Sparkle XV · Neón & Partículas</option>
                </optgroup>
                <optgroup label="Cumpleaños Infantiles (Programador B)">
                  <option value="cumple-kids-aventura">Aventura Cósmica · Cohetes & Planetas</option>
                  <option value="cumple-kids-safari">Safari Selvático · Acuarela Animales</option>
                </optgroup>
                <optgroup label="Baby Showers (Programador C)">
                  <option value="baby-shower-pastel">Pastel Cloud & Bears · Dulce Nube</option>
                  <option value="baby-revelacion-luz">Glow Gender Reveal · Predicción Niño/Niña</option>
                </optgroup>
                <optgroup label="Bautizos & Comunión (Programador C)">
                  <option value="bautizo-luz-celestial">Luz Celestial & Olivo · Espiritual Blanco</option>
                </optgroup>
                <optgroup label="Graduaciones (Programador C)">
                  <option value="graduacion-laurel-oro">Honor & Laurel · Magna Cum Laude</option>
                  <option value="graduacion-modern-tech">Modern Vanguard Grad · Tecnológico & Fiesta</option>
                </optgroup>
                <optgroup label="Corporativo & Galas (Programador C)">
                  <option value="gala-corporativa-lux">Executive Gala & Launch · RSD High-Tech</option>
                </optgroup>
              </>
            )}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || slugAvailable === false}
            className="w-full rsd-glow-button py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando borrador...</span>
              </>
            ) : (
              <>
                <span>Continuar al Editor de Invitación</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-[#090714] text-[#F8FAFC]">
      <header className="border-b border-purple-900/20 bg-[#0C091C]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Invitaciones</span>
          </Link>
          <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
            Paso 1 de 2: Configuración Inicial
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Crear Nueva Invitación
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Configura el título de tu evento y reserva tu enlace web único.
          </p>
        </div>

        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />}>
          <NewEventForm />
        </Suspense>
      </main>
    </div>
  )
}
