'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles,
  Save,
  Globe,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Gift,
  Shirt,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  ExternalLink,
  Copy,
  RotateCcw,
  ShieldOff,
  Lock,
  CreditCard,
  Share2,
  Palette,
  Type,
  Music,
  Image as ImageIcon,
  Check,
  Crown,
  ChevronRight,
  ListPlus,
  Trash2,
  Radio,
  Sliders,
  Flame,
  Volume2,
  Info,
  X,
} from 'lucide-react'

// Available Fonts for Title and Body
const TITLE_FONTS = [
  { id: 'Cinzel', name: 'Cinzel (Romano Clásico / Bodas de Gala)', class: 'font-cinzel' },
  { id: 'Playfair Display', name: 'Playfair Display (Editorial / Tradicional)', class: 'font-playfair' },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond (Poético / Romántico)', class: 'font-cormorant' },
  { id: 'Syne', name: 'Syne (Audaz / Vanguardista / Tech)', class: 'font-syne' },
  { id: 'Outfit', name: 'Outfit (Limpio / Sofisticado)', class: 'font-outfit' },
  { id: 'Montserrat', name: 'Montserrat (Moderno / Contemporáneo)', class: 'font-montserrat' },
]

const BODY_FONTS = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Geométrico / Fresco)' },
  { id: 'Outfit', name: 'Outfit (Limpio & Legible)' },
  { id: 'Montserrat', name: 'Montserrat (Elegante & Nítido)' },
]

// Preset Cover Images
const PRESET_COVERS = [
  { label: 'Boda Elegance Gold', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
  { label: 'Midnight Velvet & Luces', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jardín & Floral', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' },
  { label: 'Champagne & Copas', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vela & Noche Íntima', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80' },
]

interface ItineraryItem {
  time: string
  title: string
  description?: string
}

export default function EventEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const eventId = resolvedParams.id
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'details' | 'theme' | 'animations' | 'locations' | 'multimedia' | 'rsvp' | 'subscription' | 'demo'
  >('details')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // Plan & Event Metadata
  const [eventRecord, setEventRecord] = useState<any>(null)
  const [currentPlanCode, setCurrentPlanCode] = useState('interactive')
  const [currentPlanName, setCurrentPlanName] = useState('Plan Interactiva')

  // Demo token state
  const [demoToken, setDemoToken] = useState<string | null>(null)
  const [demoRevoked, setDemoRevoked] = useState(false)
  const [demoExpiresAt, setDemoExpiresAt] = useState<string | null>(null)
  const [copiedDemo, setCopiedDemo] = useState(false)
  const [isDemoActionLoading, setIsDemoActionLoading] = useState(false)

  // 1. Text & General Content
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'expired'>('draft')
  const [eventDate, setEventDate] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [hosts, setHosts] = useState('')
  const [quote, setQuote] = useState('')
  const [dressCode, setDressCode] = useState('Formal Elegante')
  const [giftMessage, setGiftMessage] = useState('')
  const [giftBank, setGiftBank] = useState('')

  // 2. Colors & Typography (Theme)
  const [primaryColor, setPrimaryColor] = useState('#D4AF37')
  const [secondaryColor, setSecondaryColor] = useState('#EC4899')
  const [backgroundColor, setBackgroundColor] = useState('#080415')
  const [accentColor, setAccentColor] = useState('#7C3AED')
  const [headingFont, setHeadingFont] = useState('Cinzel')
  const [bodyFont, setBodyFont] = useState('Plus Jakarta Sans')

  // 3. Animations & Hover (Premium Options)
  const [animationStyle, setAnimationStyle] = useState<'sparkles' | 'floating_orbs' | 'neon_pulse' | 'subtle'>('floating_orbs')
  const [hoverCardElevation, setHoverCardElevation] = useState(true)
  const [sparkleBadges, setSparkleBadges] = useState(true)
  const [smoothScroll, setSmoothScroll] = useState(true)

  // 4. Locations & Timeline
  const [ceremonyName, setCeremonyName] = useState('')
  const [ceremonyTime, setCeremonyTime] = useState('')
  const [ceremonyLocation, setCeremonyLocation] = useState('')
  const [ceremonyAddress, setCeremonyAddress] = useState('')
  const [ceremonyMap, setCeremonyMap] = useState('')

  const [receptionName, setReceptionName] = useState('')
  const [receptionTime, setReceptionTime] = useState('')
  const [receptionLocation, setReceptionLocation] = useState('')
  const [receptionAddress, setReceptionAddress] = useState('')
  const [receptionMap, setReceptionMap] = useState('')

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { time: '18:00', title: 'Ceremonia Religiosa', description: 'Recepción y bienvenida de invitados' },
    { time: '19:30', title: 'Cóctel & Brindis de Honor', description: 'Música ambiental y sesión de fotos' },
    { time: '21:00', title: 'Banquete de Gala', description: 'Cena principal y momentos emotivos' },
    { time: '22:30', title: 'Fiesta & Hora Loca', description: 'Apertura de pista de baile y sorpresas' },
  ])

  // 5. Multimedia & Music (Premium)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [enableMusic, setEnableMusic] = useState(true)
  const [musicUrl, setMusicUrl] = useState('')
  const [musicTitle, setMusicTitle] = useState('Melodía Romántica de Gala')
  const [enableCountdown, setEnableCountdown] = useState(true)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [newGalleryInput, setNewGalleryInput] = useState('')

  // 6. RSVP Options
  const [enableRsvp, setEnableRsvp] = useState(true)
  const [maxCompanions, setMaxCompanions] = useState(2)
  const [askDietary, setAskDietary] = useState(true)
  const [strictGuestList, setStrictGuestList] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('*, plans(id, name, code, price_usd, duration_days)')
        .eq('id', eventId)
        .single()

      if (error || !data) {
        setErrorMessage('No se encontró el evento solicitado.')
        return
      }

      setEventRecord(data)
      setCurrentPlanCode(data.plans?.code || 'interactive')
      setCurrentPlanName(data.plans?.name || 'Plan Interactiva')

      setTitle(data.title || '')
      setSlug(data.slug || '')
      setStatus(data.status as any)
      setEventDate(data.event_date ? data.event_date.substring(0, 16) : '')

      // Content data
      const content = data.content_data || {}
      setSubtitle(content.subtitle || '')
      setHosts(content.hosts || '')
      setQuote(content.quote || '')
      setDressCode(content.dress_code || 'Formal Elegante')

      if (content.gifts) {
        setGiftMessage(content.gifts.message || '')
        setGiftBank(content.gifts.bank_info || '')
      }

      if (content.ceremony) {
        setCeremonyName(content.ceremony.name || 'Ceremonia Religiosa')
        setCeremonyTime(content.ceremony.time || '18:00')
        setCeremonyLocation(content.ceremony.location_name || '')
        setCeremonyAddress(content.ceremony.address || '')
        setCeremonyMap(content.ceremony.map_url || '')
      }

      if (content.reception) {
        setReceptionName(content.reception.name || 'Recepción & Fiesta')
        setReceptionTime(content.reception.time || '20:00')
        setReceptionLocation(content.reception.location_name || '')
        setReceptionAddress(content.reception.address || '')
        setReceptionMap(content.reception.map_url || '')
      }

      if (content.itinerary && Array.isArray(content.itinerary)) {
        setItinerary(content.itinerary)
      }

      setCoverImageUrl(content.cover_image || '')
      setEnableMusic(content.allow_music ?? true)
      setMusicUrl(content.audio_url || '')
      setMusicTitle(content.music_title || 'Melodía Ambiental de Celebración')
      setEnableCountdown(content.allow_countdown ?? true)
      setGalleryImages(content.gallery_images || [])

      setEnableRsvp(content.allow_rsvp ?? true)
      setMaxCompanions(content.max_companions ?? 2)
      setAskDietary(content.ask_dietary ?? true)
      setStrictGuestList(content.strict_guest_list ?? false)

      // Theme data
      const theme = data.visual_theme || {}
      if (theme.primary_color) setPrimaryColor(theme.primary_color)
      if (theme.secondary_color) setSecondaryColor(theme.secondary_color)
      if (theme.background_color) setBackgroundColor(theme.background_color)
      if (theme.accent_color) setAccentColor(theme.accent_color)
      if (theme.heading_font) setHeadingFont(theme.heading_font)
      if (theme.body_font) setBodyFont(theme.body_font)
      if (theme.animation_style) setAnimationStyle(theme.animation_style)
      if (theme.hover_card_elevation !== undefined) setHoverCardElevation(theme.hover_card_elevation)
      if (theme.sparkle_badges !== undefined) setSparkleBadges(theme.sparkle_badges)

      setDemoToken(data.demo_token || null)
      setDemoRevoked(!!data.demo_revoked)
      setDemoExpiresAt(data.demo_expires_at || null)
    } catch {
      setErrorMessage('Error al cargar la información del evento.')
    } finally {
      setIsLoading(false)
    }
  }

  // Count active premium features configured
  const isEssentialPlan = currentPlanCode === 'essential'

  const premiumFeaturesCount = [
    enableMusic && musicUrl,
    enableCountdown,
    animationStyle !== 'subtle',
    hoverCardElevation,
    galleryImages.length > 1,
    maxCompanions > 1,
    askDietary,
  ].filter(Boolean).length

  // Add itinerary row
  const addItineraryStep = () => {
    setItinerary([
      ...itinerary,
      { time: '23:30', title: 'Nuevo Momento', description: 'Detalle o indicación especial' },
    ])
  }

  const removeItineraryStep = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index))
  }

  const updateItineraryStep = (index: number, field: keyof ItineraryItem, val: string) => {
    setItinerary(
      itinerary.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    )
  }

  // Add gallery image
  const addGalleryImage = () => {
    if (!newGalleryInput.trim()) return
    setGalleryImages([...galleryImages, newGalleryInput.trim()])
    setNewGalleryInput('')
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
  }

  // Save handler
  const handleSave = async (publishImmediate = false) => {
    setIsSaving(true)
    setErrorMessage(null)
    setSaveSuccess(false)

    try {
      const supabase = createClient()

      const contentPayload = {
        subtitle,
        hosts,
        quote,
        dress_code: dressCode,
        gifts: {
          message: giftMessage,
          bank_info: giftBank,
        },
        ceremony: {
          name: ceremonyName,
          time: ceremonyTime,
          location_name: ceremonyLocation,
          address: ceremonyAddress,
          map_url: ceremonyMap,
        },
        reception: {
          name: receptionName,
          time: receptionTime,
          location_name: receptionLocation,
          address: receptionAddress,
          map_url: receptionMap,
        },
        itinerary,
        cover_image: coverImageUrl,
        allow_music: enableMusic,
        audio_url: musicUrl,
        music_title: musicTitle,
        allow_countdown: enableCountdown,
        gallery_images: galleryImages,
        allow_rsvp: enableRsvp,
        max_companions: maxCompanions,
        ask_dietary: askDietary,
        strict_guest_list: strictGuestList,
      }

      const visualThemePayload = {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        background_color: backgroundColor,
        accent_color: accentColor,
        heading_font: headingFont,
        body_font: bodyFont,
        animation_style: animationStyle,
        hover_card_elevation: hoverCardElevation,
        sparkle_badges: sparkleBadges,
        smooth_scroll: smoothScroll,
      }

      const updateData: any = {
        title,
        content_data: contentPayload,
        visual_theme: visualThemePayload,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
      }

      if (publishImmediate) {
        updateData.status = 'published'
        setStatus('published')
      }

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setErrorMessage('Ocurrió un error al guardar los cambios.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyDemo = () => {
    if (!demoToken) return
    const url = `${window.location.origin}/preview/${demoToken}`
    navigator.clipboard.writeText(url)
    setCopiedDemo(true)
    setTimeout(() => setCopiedDemo(false), 2500)
  }

  const handleRegenerateDemo = async () => {
    setIsDemoActionLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('regenerate_demo_token', {
        p_event_id: eventId,
      })
      if (error) {
        setErrorMessage(error.message)
        return
      }
      if (data && (data as any).demo_token) {
        setDemoToken((data as any).demo_token)
        setDemoRevoked(false)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch {
      setErrorMessage('No se pudo regenerar el enlace de demostración.')
    } finally {
      setIsDemoActionLoading(false)
    }
  }

  const handleRevokeDemo = async () => {
    if (!confirm('¿Seguro que deseas revocar este enlace de demo? Nadie podrá acceder hasta que generes uno nuevo.')) {
      return
    }
    setIsDemoActionLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('revoke_demo_token', {
        p_event_id: eventId,
      })
      if (error) {
        setErrorMessage(error.message)
        return
      }
      setDemoRevoked(true)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setErrorMessage('No se pudo revocar el enlace de demostración.')
    } finally {
      setIsDemoActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070510] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC] flex flex-col">
      {/* TOP STICKY BAR */}
      <header className="border-b border-purple-900/30 bg-[#0C091C]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white truncate max-w-[200px] sm:max-w-xs">
                {title || 'Mi Invitación'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {status === 'published' ? 'Publicada' : 'Borrador'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                /{slug}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4" />
            <span>{showMobilePreview ? 'Ocultar Móvil' : 'Ver Móvil'}</span>
          </button>

          {/* Quick Upgrade / Plan indicator */}
          <Link
            href={`/dashboard/events/${eventId}/checkout`}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isEssentialPlan
                ? 'bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-amber-300 border-amber-500/40 hover:scale-105'
                : 'bg-purple-600/20 text-purple-200 border-purple-500/30 hover:bg-purple-600/30'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{currentPlanName}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/10 text-white">
              {isEssentialPlan ? 'Upgrade' : 'Plan'}
            </span>
          </Link>

          {/* Guests Button */}
          <Link
            href={`/dashboard/events/${eventId}/guests`}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Invitados RSVP</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="rsd-glow-button px-4 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </header>

      {/* FEEDBACK BANNERS */}
      {saveSuccess && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs py-2 px-6 text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>¡Todos los cambios y ajustes visuales han sido guardados con éxito!</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs py-2 px-6 text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SMART PREMIUM FEATURES BANNER FOR ESSENTIAL PLAN */}
      {isEssentialPlan && premiumFeaturesCount > 0 && (
        <div className="bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-pink-950/60 border-b border-amber-500/30 py-2.5 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-200">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Tienes <strong>{premiumFeaturesCount} funciones premium</strong> configuradas (música, animaciones avanzadas o itinerario extendido). En el Plan Esencial se publicarán en modo básico.
            </span>
          </div>
          <Link
            href={`/dashboard/events/${eventId}/checkout`}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1 hover:brightness-110"
          >
            <span>Hacer Upgrade a Interactiva o Pro</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* MAIN DUAL-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: EDITOR TABS & FORMS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          {/* NAVIGATION TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-purple-900/30">
            {[
              { id: 'details', label: 'Contenido & Textos', icon: Shirt },
              { id: 'theme', label: 'Colores & Tipografía', icon: Palette },
              { id: 'animations', label: 'Animaciones & Hover', icon: Sparkles, premium: true },
              { id: 'locations', label: 'Ubicaciones & Itinerario', icon: MapPin },
              { id: 'multimedia', label: 'Música & Fotos', icon: Music, premium: true },
              { id: 'rsvp', label: 'RSVP & Seguridad', icon: CheckCircle2 },
              { id: 'subscription', label: 'Mi Plan & Vigencia', icon: Crown },
              { id: 'demo', label: 'Demo Privada', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-purple-600/30 border border-purple-500/50 text-white shadow-lg shadow-purple-600/20'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.premium && isEssentialPlan && (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded">
                      ⭐
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: CONTENIDO & TEXTOS */}
          {activeTab === 'details' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Información Principal de la Celebración</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Título de la Invitación
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Valeria & Sebastián / Mis 30 Años"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Subtítulo / Tipo de Celebración
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ej: Nuestra Boda / Fiesta de Gala"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Anfitriones o Protagonistas
                  </label>
                  <input
                    type="text"
                    value={hosts}
                    onChange={(e) => setHosts(e.target.value)}
                    placeholder="Ej: Familia Morales Castro"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Fecha y Hora del Evento
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 scheme-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Frase o Pensamiento de Bienvenida
                </label>
                <textarea
                  rows={2}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Ej: Dos almas que se encuentran para escribir una historia eterna..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Código de Vestimenta (Dress Code)
                  </label>
                  <input
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    placeholder="Ej: Formal Elegante / Guayabera Blanca"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Mensaje de Mesa de Regalos / Sobres
                  </label>
                  <input
                    type="text"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Ej: Tu presencia es nuestro mayor regalo (Lluvia de Sobres)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Datos de Cuenta Bancaria / Transferencias (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={giftBank}
                  onChange={(e) => setGiftBank(e.target.value)}
                  placeholder="Banco Pichincha · Ahorros # 1234567890 · CI: 1720304050 · Titular: Valeria Morales"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: COLORES & TIPOGRAFÍA */}
          {activeTab === 'theme' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Identidad Cromática & Estilo Visual
                </h3>
                <p className="text-xs text-slate-400">
                  Personaliza los tonos y el contraste de tu plantilla para armonizar con la paleta de tu fiesta o matrimonio.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/30 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Color Primario</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full px-2 py-1 bg-black/40 rounded text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/30 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Color Secundario</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full px-2 py-1 bg-black/40 rounded text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/30 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Color de Fondo</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full px-2 py-1 bg-black/40 rounded text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/30 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Acento / Resplandor</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full px-2 py-1 bg-black/40 rounded text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4 pt-4 border-t border-purple-900/20">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tipografías Editoriales
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Fuente de Títulos
                    </label>
                    <select
                      value={headingFont}
                      onChange={(e) => setHeadingFont(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      {TITLE_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Fuente de Párrafos y Detalles
                    </label>
                    <select
                      value={bodyFont}
                      onChange={(e) => setBodyFont(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      {BODY_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANIMACIONES & EFECTOS HOVER (⭐ PREMIUM) */}
          {activeTab === 'animations' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Efectos de Micro-Animación & Hover
                    </h3>
                    {isEssentialPlan ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        ⭐ Plan Interactiva / Pro
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        ✓ Activo en tu Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Controla el dinamismo visual: orbes flotantes, destellos mágicos y respuesta al cursor en tarjetas.
                  </p>
                </div>
              </div>

              {/* Animation Styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'floating_orbs',
                    title: 'Orbes de Luz Flotantes',
                    desc: 'Círculos ambientales que flotan en el fondo con resplandor suave y continuo.',
                  },
                  {
                    id: 'sparkles',
                    title: 'Destellos & Chispas Mágicas',
                    desc: 'Partículas brillantes y badges con animación de destello en bucle suave.',
                  },
                  {
                    id: 'neon_pulse',
                    title: 'Pulso Neón & Vibración',
                    desc: 'Bordes iluminados con gradiente pulsante para celebraciones nocturnas.',
                  },
                  {
                    id: 'subtle',
                    title: 'Elegante Sutil (Estático)',
                    desc: 'Animaciones mínimas para eventos sobrios y de alta etiqueta.',
                  },
                ].map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setAnimationStyle(style.id as any)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      animationStyle === style.id
                        ? 'bg-purple-600/25 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-[#090714] border-purple-900/30 text-slate-300 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{style.title}</span>
                      {animationStyle === style.id && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{style.desc}</p>
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-purple-900/20">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090714] border border-purple-900/30">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Elevación Hover 3D en Tarjetas
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Las tarjetas de ceremonia, recepción e itinerario flotan suavemente al pasar el cursor.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hoverCardElevation}
                    onChange={(e) => setHoverCardElevation(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090714] border border-purple-900/30">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Insignias Brillantes (Badges Glow)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Muestra badges con resplandor dorado y magenta en la cabecera y fechas.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sparkleBadges}
                    onChange={(e) => setSparkleBadges(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UBICACIONES & ITINERARIO */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              {/* Ceremony */}
              <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-4">
                <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lugar de la Ceremonia Principal</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Nombre de la Ceremonia
                    </label>
                    <input
                      type="text"
                      value={ceremonyName}
                      onChange={(e) => setCeremonyName(e.target.value)}
                      placeholder="Ej: Ceremonia Religiosa"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Hora
                    </label>
                    <input
                      type="text"
                      value={ceremonyTime}
                      onChange={(e) => setCeremonyTime(e.target.value)}
                      placeholder="Ej: 18:00 hrs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Nombre del Recinto / Templo
                    </label>
                    <input
                      type="text"
                      value={ceremonyLocation}
                      onChange={(e) => setCeremonyLocation(e.target.value)}
                      placeholder="Ej: Parroquia Nuestra Señora de la Paz"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={ceremonyAddress}
                      onChange={(e) => setCeremonyAddress(e.target.value)}
                      placeholder="Ej: Av. de las Rosas # 120"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Enlace de Google Maps (GPS)
                  </label>
                  <input
                    type="url"
                    value={ceremonyMap}
                    onChange={(e) => setCeremonyMap(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Reception */}
              <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-4">
                <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lugar de la Recepción & Fiesta</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Nombre de la Recepción
                    </label>
                    <input
                      type="text"
                      value={receptionName}
                      onChange={(e) => setReceptionName(e.target.value)}
                      placeholder="Ej: Recepción & Fiesta de Gala"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Hora
                    </label>
                    <input
                      type="text"
                      value={receptionTime}
                      onChange={(e) => setReceptionTime(e.target.value)}
                      placeholder="Ej: 20:30 hrs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Nombre del Salón / Club
                    </label>
                    <input
                      type="text"
                      value={receptionLocation}
                      onChange={(e) => setReceptionLocation(e.target.value)}
                      placeholder="Ej: Quinta Los Rosales"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={receptionAddress}
                      onChange={(e) => setReceptionAddress(e.target.value)}
                      placeholder="Ej: Km 12 Vía al Valle"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Enlace de Google Maps (GPS)
                  </label>
                  <input
                    type="url"
                    value={receptionMap}
                    onChange={(e) => setReceptionMap(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Itinerario Paso a Paso (Timeline)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Organiza el cronograma de actividades de la celebración para que tus invitados sigan cada momento.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addItineraryStep}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Agregar Momento</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {itinerary.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#090714] border border-purple-900/20 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <input
                        type="text"
                        value={step.time}
                        onChange={(e) => updateItineraryStep(idx, 'time', e.target.value)}
                        placeholder="18:00"
                        className="w-20 px-2.5 py-1.5 rounded-lg bg-black/40 border border-purple-900/40 text-center font-mono text-xs text-purple-300 font-bold"
                      />
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateItineraryStep(idx, 'title', e.target.value)}
                        placeholder="Título del momento"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-purple-900/40 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={step.description || ''}
                        onChange={(e) => updateItineraryStep(idx, 'description', e.target.value)}
                        placeholder="Detalle o instrucción"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-purple-900/40 text-xs text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeItineraryStep(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Eliminar momento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MÚSICA & MULTIMEDIA (⭐ PREMIUM) */}
          {activeTab === 'multimedia' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Música Ambiental & Contenido Fotográfico
                  </h3>
                  {isEssentialPlan ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      ⭐ Plan Interactiva / Pro
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      ✓ Activo en tu Plan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Agrega banda sonora no intrusiva con control de pausa y galería de recuerdos fotográficos.
                </p>
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Foto de Portada Principal (Hero Image)
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] text-slate-500 shrink-0">Presets rápidos:</span>
                  {PRESET_COVERS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverImageUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] whitespace-nowrap border border-white/5"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Music */}
              <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Reproductor Musical de Fondo
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Muestra el disco de vinilo flotante con rotación continua al reproducir.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableMusic}
                    onChange={(e) => setEnableMusic(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                {enableMusic && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        Título de la Canción
                      </label>
                      <input
                        type="text"
                        value={musicTitle}
                        onChange={(e) => setMusicTitle(e.target.value)}
                        placeholder="Ej: A Thousand Years · Instrumental"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-900/40 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        URL del Audio MP3
                      </label>
                      <input
                        type="url"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        placeholder="https://cdn.pixabay.com/audio/..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-900/40 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Countdown Timer */}
              <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Cuenta Regresiva en Tiempo Real (Días, Horas, Minutos)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Calcula dinámicamente el tiempo restante hasta la hora del evento.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableCountdown}
                  onChange={(e) => setEnableCountdown(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Extended Gallery */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Galería de Fotos ({galleryImages.length} fotos cargadas)
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryInput}
                    onChange={(e) => setNewGalleryInput(e.target.value)}
                    placeholder="Pega la URL de una foto para agregar a la galería..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Agregar Foto
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {galleryImages.map((imgUrl, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-black/40 group">
                        <img src={imgUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: RSVP & SEGURIDAD */}
          {activeTab === 'rsvp' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Control de Asistencia (RSVP) & Anti-Spam
                </h3>
                <p className="text-xs text-slate-400">
                  Configura cómo tus invitados confirman y previene registros duplicados con verificación por número de teléfono.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Habilitar Botón de Confirmación RSVP en la Invitación
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Al hacer clic, se abre el modal pidiendo Nombre, Apellido y Número de Teléfono.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableRsvp}
                  onChange={(e) => setEnableRsvp(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30">
                  <label className="block text-xs font-bold text-white mb-1">
                    Límite Máximo de Acompañantes
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Cupos adicionales permitidos en confirmaciones públicas abiertas.
                  </p>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={maxCompanions}
                    onChange={(e) => setMaxCompanions(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-1.5 rounded-xl bg-black/40 border border-purple-900/40 text-white font-bold text-center"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Preguntar Menú / Restricciones Dietarias
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Permite indicar si el invitado es vegetariano, celíaco o tiene alergias.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={askDietary}
                    onChange={(e) => setAskDietary(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-800/30 space-y-2">
                <span className="text-xs font-bold text-purple-300 block">
                  🛡️ Seguridad Anti-Duplicados Integrada
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  El sistema detecta automáticamente cuando una persona ya confirmó asistencia con su número de teléfono o desde su navegador. Si la persona reenvía el formulario, sus datos se actualizan sin crear filas duplicadas en tu lista de confirmados.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: MI PLAN & SUSCRIPCIÓN */}
          {activeTab === 'subscription' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
                    Gestión de Suscripción del Evento
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {currentPlanName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Vigencia de hosting activo y nivel de funcionalidades contratadas.
                  </p>
                </div>

                <Link
                  href={`/dashboard/events/${eventId}/checkout`}
                  className="rsd-glow-button px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Mejorar Plan (Upgrade)</span>
                </Link>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estado</span>
                  <p className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{status === 'published' ? 'Publicado en Línea' : 'Borrador'}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Vigencia Post-Evento</span>
                  <p className="text-base font-bold text-white mt-1">
                    {isEssentialPlan ? '30 días' : currentPlanCode === 'interactive' ? '90 días' : '180 días'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Fecha de Expiración</span>
                  <p className="text-base font-bold text-purple-300 mt-1">
                    {eventRecord?.expires_at
                      ? new Date(eventRecord.expires_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Activo con tu plan'}
                  </p>
                </div>
              </div>

              {/* Comparison matrix */}
              <div className="p-5 rounded-2xl bg-[#0B071A] border border-purple-900/30 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Funcionalidades Incluidas en este Evento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Enlace único personalizado (/{slug})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ubicaciones GPS en Google Maps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Demostración privada gratuita</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEssentialPlan ? (
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className={isEssentialPlan ? 'text-slate-500' : 'text-slate-200'}>
                      Música de fondo ambiental (Interactiva / Pro)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEssentialPlan ? (
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className={isEssentialPlan ? 'text-slate-500' : 'text-slate-200'}>
                      Cuenta regresiva en vivo (Interactiva / Pro)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentPlanCode === 'event_pro' ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={currentPlanCode === 'event_pro' ? 'text-slate-200' : 'text-slate-500'}>
                      Remoción de marca de agua Nuviax (Solo Evento Pro)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DEMO PRIVADA */}
          {activeTab === 'demo' && (
            <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 space-y-6">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  Previsualización Criptográfica
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Enlace Privado de Demostración
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Comparte este enlace con tus allegados o tu pareja para revisar el diseño en sus teléfonos antes de pagar y publicar la invitación oficial.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090714] border border-purple-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">URL de Demostración:</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      demoRevoked
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {demoRevoked ? 'Revocado' : 'Activo'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      demoToken && !demoRevoked
                        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/preview/${demoToken}`
                        : 'Enlace revocado o pendiente de generar.'
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-purple-900/40 text-xs font-mono text-slate-300"
                  />
                  <button
                    onClick={handleCopyDemo}
                    disabled={!demoToken || demoRevoked}
                    className="rsd-glow-button px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {copiedDemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDemo ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handleRegenerateDemo}
                    disabled={isDemoActionLoading}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isDemoActionLoading ? 'animate-spin' : ''}`} />
                    <span>{demoToken ? 'Regenerar Nuevo Enlace' : 'Generar Enlace Privado'}</span>
                  </button>

                  {demoToken && !demoRevoked && (
                    <button
                      onClick={handleRevokeDemo}
                      disabled={isDemoActionLoading}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <ShieldOff className="w-3.5 h-3.5" />
                      <span>Revocar Acceso</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW */}
        <div
          className={`flex-1 border-l border-purple-900/20 bg-[#06040C] p-4 lg:flex items-center justify-center ${
            showMobilePreview ? 'block' : 'hidden'
          }`}
        >
          <div
            className="w-full max-w-sm h-[720px] rounded-[44px] border-4 border-slate-700 overflow-y-auto shadow-2xl relative scrollbar-none flex flex-col justify-between transition-colors duration-500"
            style={{ backgroundColor }}
          >
            {/* Top mobile speaker bezel */}
            <div className="sticky top-0 w-full h-6 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
              <div className="w-16 h-1.5 rounded-full bg-slate-700" />
            </div>

            {/* Mobile invitation preview content */}
            <div className="p-6 text-center space-y-6">
              {coverImageUrl && (
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 shadow-lg" style={{ borderColor: primaryColor }}>
                  <img src={coverImageUrl} alt="Portada" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold block" style={{ color: secondaryColor }}>
                  {subtitle || 'Invitación Digital'}
                </span>

                <h2 className="text-2xl font-extrabold text-white mt-1" style={{ color: primaryColor }}>
                  {title || 'Título del Evento'}
                </h2>

                {hosts && (
                  <p className="text-xs text-slate-300 mt-1">{hosts}</p>
                )}
              </div>

              {quote && (
                <p className="text-xs italic text-slate-400 border-y py-2" style={{ borderColor: `${primaryColor}30` }}>
                  "{quote}"
                </p>
              )}

              {/* Countdown Preview */}
              {enableCountdown && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                    Cuenta Regresiva
                  </span>
                  <div className="flex justify-center gap-2 font-mono text-xs font-bold text-white">
                    <span className="px-2 py-1 rounded bg-black/40">45d</span>
                    <span className="px-2 py-1 rounded bg-black/40">12h</span>
                    <span className="px-2 py-1 rounded bg-black/40">30m</span>
                  </div>
                </div>
              )}

              {eventDate && (
                <div className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white font-semibold">
                  {new Date(eventDate).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              )}

              {/* Locations Preview */}
              {(ceremonyLocation || receptionLocation) && (
                <div className="space-y-3 pt-2 text-left">
                  {ceremonyLocation && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <p className="font-bold" style={{ color: primaryColor }}>{ceremonyName}</p>
                      <p className="text-white mt-0.5">{ceremonyLocation}</p>
                      {ceremonyTime && <p className="text-slate-400 text-[10px]">Hora: {ceremonyTime}</p>}
                    </div>
                  )}

                  {receptionLocation && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <p className="font-bold" style={{ color: secondaryColor }}>{receptionName}</p>
                      <p className="text-white mt-0.5">{receptionLocation}</p>
                      {receptionTime && <p className="text-slate-400 text-[10px]">Hora: {receptionTime}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Music Player Preview */}
              {enableMusic && (
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
                    <span className="text-white truncate max-w-[150px]">{musicTitle}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">03:45</span>
                </div>
              )}

              <div className="pt-2">
                <div
                  className="w-full py-3 rounded-xl text-white font-bold text-xs text-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  Confirmar Asistencia (RSVP)
                </div>
              </div>
            </div>

            <div className="p-4 text-center text-[10px] text-slate-500 border-t border-white/5">
              Vista previa interactiva en tiempo real
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
