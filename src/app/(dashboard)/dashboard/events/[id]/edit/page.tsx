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
} from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'details' | 'locations' | 'extras' | 'demo'>('details')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // Demo token state
  const [demoToken, setDemoToken] = useState<string | null>(null)
  const [demoRevoked, setDemoRevoked] = useState(false)
  const [demoExpiresAt, setDemoExpiresAt] = useState<string | null>(null)
  const [copiedDemo, setCopiedDemo] = useState(false)
  const [isDemoActionLoading, setIsDemoActionLoading] = useState(false)

  // Event state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'expired'>('draft')
  const [eventDate, setEventDate] = useState('')

  // Content state
  const [subtitle, setSubtitle] = useState('')
  const [hosts, setHosts] = useState('')
  const [quote, setQuote] = useState('')
  const [dressCode, setDressCode] = useState('')
  const [giftMessage, setGiftMessage] = useState('')
  const [giftBank, setGiftBank] = useState('')

  // Ceremony
  const [ceremonyName, setCeremonyName] = useState('')
  const [ceremonyTime, setCeremonyTime] = useState('')
  const [ceremonyLocation, setCeremonyLocation] = useState('')
  const [ceremonyAddress, setCeremonyAddress] = useState('')
  const [ceremonyMap, setCeremonyMap] = useState('')

  // Reception
  const [receptionName, setReceptionName] = useState('')
  const [receptionTime, setReceptionTime] = useState('')
  const [receptionLocation, setReceptionLocation] = useState('')
  const [receptionAddress, setReceptionAddress] = useState('')
  const [receptionMap, setReceptionMap] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error || !data) {
        setErrorMessage('No se encontró el evento solicitado.')
        return
      }

      setTitle(data.title || '')
      setSlug(data.slug || '')
      setStatus(data.status as any)
      setEventDate(data.event_date ? data.event_date.substring(0, 16) : '')

      const content = data.content_data || {}
      setSubtitle(content.subtitle || '')
      setHosts(content.hosts || '')
      setQuote(content.quote || '')
      setDressCode(content.dress_code || '')

      if (content.gifts) {
        setGiftMessage(content.gifts.message || '')
        setGiftBank(content.gifts.bank_info || '')
      }

      if (content.ceremony) {
        setCeremonyName(content.ceremony.name || '')
        setCeremonyTime(content.ceremony.time || '')
        setCeremonyLocation(content.ceremony.location_name || '')
        setCeremonyAddress(content.ceremony.address || '')
        setCeremonyMap(content.ceremony.map_url || '')
      }

      if (content.reception) {
        setReceptionName(content.reception.name || '')
        setReceptionTime(content.reception.time || '')
        setReceptionLocation(content.reception.location_name || '')
        setReceptionAddress(content.reception.address || '')
        setReceptionMap(content.reception.map_url || '')
      }

      setDemoToken(data.demo_token || null)
      setDemoRevoked(!!data.demo_revoked)
      setDemoExpiresAt(data.demo_expires_at || null)
    } catch {
      setErrorMessage('Error al cargar la información del evento.')
    } finally {
      setIsLoading(false)
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

  const handleSave = async (publishImmediate = false) => {
    setIsSaving(true)
    setErrorMessage(null)
    setSaveSuccess(false)

    try {
      const supabase = createClient()

      const newStatus = publishImmediate ? 'published' : status

      const contentData = {
        title,
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
      }

      const { error } = await supabase
        .from('events')
        .update({
          title,
          status: newStatus,
          content_data: contentData,
          event_date: eventDate ? new Date(eventDate).toISOString() : null,
          published_at: publishImmediate ? new Date().toISOString() : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', eventId)

      if (error) {
        setErrorMessage(error.message)
        return
      }

      if (publishImmediate) {
        setStatus('published')
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setErrorMessage('Ocurrió un error al guardar los cambios.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090714] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex flex-col">
      {/* Editor Header */}
      <header className="border-b border-purple-900/20 bg-[#0C091C]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {title || 'Editar Invitación'}
            </h1>
            <p className="text-[11px] font-mono text-purple-400 truncate">
              nuviax.com/{slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>{showMobilePreview ? 'Ocultar Vista' : 'Ver Vista'}</span>
          </button>

          {status === 'published' ? (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Online</span>
            </a>
          ) : (
            <Link
              href={`/dashboard/events/${eventId}/checkout`}
              className="rsd-glow-button px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <CreditCard className="w-3.5 h-3.5 text-pink-300" />
              <span>Activar Plan</span>
            </Link>
          )}

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CONTROLS FORM */}
        <div className={`flex-1 p-4 sm:p-8 overflow-y-auto max-w-3xl ${showMobilePreview ? 'hidden lg:block' : 'block'}`}>
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-purple-900/20 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'details'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              1. Datos Principales
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'locations'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              2. Ubicaciones & Mapa
            </button>
            <button
              onClick={() => setActiveTab('extras')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'extras'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              3. Regalos & Vestimenta
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3 h-3 text-pink-400" />
              <span>4. Demo Privada</span>
              {demoToken && !demoRevoked && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </div>

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Título del Evento
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Subtítulo / Tipo de Celebración
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ej: Nuestra Boda / Celebración de Quince Años"
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nombres de Anfitriones
                </label>
                <input
                  type="text"
                  value={hosts}
                  onChange={(e) => setHosts(e.target.value)}
                  placeholder="Ej: Ana Lucía & Carlos / Familia Martínez"
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Fecha y Hora del Evento
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 scheme-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Frase o Pensamiento Especial
                </label>
                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Ej: Dos vidas, un solo corazón latiendo juntos..."
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="space-y-8">
              {/* Ceremonia */}
              <div className="p-6 rounded-2xl bg-[#120E24] border border-purple-900/30 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Ceremonia Principal / Religiosa</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre del Lugar</label>
                    <input
                      type="text"
                      value={ceremonyLocation}
                      onChange={(e) => setCeremonyLocation(e.target.value)}
                      placeholder="Ej: Parroquia San Francisco"
                      className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hora</label>
                    <input
                      type="text"
                      value={ceremonyTime}
                      onChange={(e) => setCeremonyTime(e.target.value)}
                      placeholder="Ej: 17:00"
                      className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Dirección Completa</label>
                  <input
                    type="text"
                    value={ceremonyAddress}
                    onChange={(e) => setCeremonyAddress(e.target.value)}
                    placeholder="Ej: Av. Las Palmas # 120"
                    className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Enlace a Google Maps</label>
                  <input
                    type="url"
                    value={ceremonyMap}
                    onChange={(e) => setCeremonyMap(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Recepción */}
              <div className="p-6 rounded-2xl bg-[#120E24] border border-purple-900/30 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Recepción / Fiesta</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre del Salón o Finca</label>
                    <input
                      type="text"
                      value={receptionLocation}
                      onChange={(e) => setReceptionLocation(e.target.value)}
                      placeholder="Ej: Hacienda Real Los Rosales"
                      className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hora</label>
                    <input
                      type="text"
                      value={receptionTime}
                      onChange={(e) => setReceptionTime(e.target.value)}
                      placeholder="Ej: 19:30"
                      className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Dirección Completa</label>
                  <input
                    type="text"
                    value={receptionAddress}
                    onChange={(e) => setReceptionAddress(e.target.value)}
                    placeholder="Ej: Km 14 Vía Campestre"
                    className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Enlace a Google Maps</label>
                  <input
                    type="url"
                    value={receptionMap}
                    onChange={(e) => setReceptionMap(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXTRAS */}
          {activeTab === 'extras' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Código de Vestimenta (Dress Code)
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="Ej: Formal Riguroso / Traje Oscuro / Guayabera Blanca"
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Mensaje de Mesa de Regalos / Lluvia de Sobres
                </label>
                <textarea
                  rows={3}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Ej: Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, contaremos con lluvia de sobres."
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Datos de Cuenta Bancaria (Opcional)
                </label>
                <input
                  type="text"
                  value={giftBank}
                  onChange={(e) => setGiftBank(e.target.value)}
                  placeholder="Banco: Banco General · Cuenta: 123456789"
                  className="w-full px-4 py-3 rounded-xl bg-[#120E24] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: DEMO PRIVADA */}
          {activeTab === 'demo' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#16102D] to-[#0F0B1E] border border-purple-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Demostración Privada Gratuita</h3>
                      <p className="text-xs text-slate-400">Comparte tu maqueta en vivo antes de pagar</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      demoRevoked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : demoToken
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {demoRevoked ? 'Revocado' : demoToken ? 'Enlace Activo' : 'Sin Generar'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Envía este enlace privado a tu pareja, familia o amigos para que revisen los textos, colores y diseño interactivo. Nadie podrá editar tu evento, ni consultar invitados, ni hacer confirmaciones RSVP reales.
                </p>

                {demoToken && !demoRevoked ? (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      URL del Enlace Privado:
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 px-3 py-2.5 rounded-xl bg-[#080512] border border-purple-900/40 text-xs font-mono text-purple-300 truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/preview/${demoToken}` : `/preview/${demoToken}`}
                      </div>
                      <button
                        onClick={handleCopyDemo}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedDemo ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                      <a
                        href={`/preview/${demoToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    El enlace de demostración privada se encuentra actualmente revocado o inactivo. Genera uno nuevo a continuación para volver a compartirlo.
                  </div>
                )}

                {/* Management action buttons */}
                <div className="pt-4 border-t border-purple-900/20 flex flex-wrap items-center gap-3">
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

              {/* Security guarantees */}
              <div className="p-6 rounded-2xl bg-[#110D24] border border-purple-900/20 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Garantías de Seguridad & Privacidad RSD
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Token criptográfico aleatorio no deducible.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Permiso estricto de solo lectura para invitados.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>RSVP simulado: no altera tu lista real de confirmados.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>Bloqueo noindex para evitar rastreo en buscadores.</span>
                  </div>
                </div>
              </div>

              {/* Call to action for activation */}
              {status !== 'published' && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">¿Listo para publicar tu invitación oficial?</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Elige un plan desde $19.99 USD para habilitar tu enlace público definitivo y activar la gestión de invitados RSVP.
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/events/${eventId}/checkout`}
                    className="rsd-glow-button px-5 py-2.5 rounded-xl text-white font-bold text-xs whitespace-nowrap shadow-lg flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Contratar Plan</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW */}
        <div className={`flex-1 border-l border-purple-900/20 bg-[#06040C] p-4 lg:flex items-center justify-center ${showMobilePreview ? 'block' : 'hidden'}`}>
          <div className="w-full max-w-sm h-[700px] rounded-[40px] border-4 border-slate-700 bg-[#070510] overflow-y-auto shadow-2xl relative scrollbar-none flex flex-col justify-between">
            {/* Top mobile speaker bezel */}
            <div className="sticky top-0 w-full h-6 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
              <div className="w-16 h-1.5 rounded-full bg-slate-700" />
            </div>

            {/* Mobile invitation preview content */}
            <div className="p-6 text-center space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-purple-400 font-semibold block">
                {subtitle || 'Invitación Digital'}
              </span>

              <h2 className="text-2xl font-extrabold text-white">
                {title || 'Título del Evento'}
              </h2>

              {hosts && (
                <p className="text-xs text-slate-300">{hosts}</p>
              )}

              {quote && (
                <p className="text-xs italic text-slate-400 border-y border-purple-900/30 py-2">
                  "{quote}"
                </p>
              )}

              {eventDate && (
                <div className="py-2 px-3 rounded-xl bg-purple-900/30 text-[11px] text-white font-semibold">
                  {new Date(eventDate).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              )}

              {(ceremonyLocation || receptionLocation) && (
                <div className="space-y-3 pt-2 text-left">
                  {ceremonyLocation && (
                    <div className="p-3 rounded-xl bg-[#110D24] border border-purple-900/20 text-xs">
                      <p className="font-bold text-purple-300">Ceremonia</p>
                      <p className="text-white mt-0.5">{ceremonyLocation}</p>
                      {ceremonyTime && <p className="text-slate-400 text-[10px]">Hora: {ceremonyTime}</p>}
                    </div>
                  )}

                  {receptionLocation && (
                    <div className="p-3 rounded-xl bg-[#110D24] border border-purple-900/20 text-xs">
                      <p className="font-bold text-pink-300">Recepción</p>
                      <p className="text-white mt-0.5">{receptionLocation}</p>
                      {receptionTime && <p className="text-slate-400 text-[10px]">Hora: {receptionTime}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4">
                <div className="w-full rsd-glow-button py-2.5 rounded-xl text-white font-bold text-xs text-center shadow-md">
                  Confirmar Asistencia (RSVP)
                </div>
              </div>
            </div>

            <div className="p-4 text-center text-[10px] text-slate-600 border-t border-white/5">
              Vista previa interactiva en tiempo real
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
