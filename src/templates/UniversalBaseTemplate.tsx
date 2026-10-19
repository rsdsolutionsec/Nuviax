'use client'

import { useState } from 'react'
import { InvitationTemplateProps } from '@/templates/types'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import { PublicRsvpModal } from '@/components/invitation/PublicRsvpModal'
import { BackgroundMusicPlayer } from '@/components/invitation/BackgroundMusicPlayer'
import { getTemplateFontClass } from '@/lib/templates/renderer'
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  Shirt,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react'

export function UniversalBaseTemplate({
  event,
  content,
  theme,
  plan,
  isDemo = false,
  isReadOnly = false,
  guest,
  invitationToken,
}: InvitationTemplateProps) {
  const [copiedBank, setCopiedBank] = useState(false)

  const title = content.title || event.title || 'Evento Especial'
  const subtitle = content.subtitle || 'Estás Cordialmente Invitado'
  const hosts = content.hosts || ''
  const quote = content.quote || ''
  const eventDate = content.date || event.event_date

  const ceremony = content.ceremony
  const reception = content.reception
  const itinerary = content.itinerary || []
  const dressCode = content.dress_code
  const gifts = content.gifts
  const gallery = content.gallery || []

  // Dynamic Theme Colors
  const primaryColor = theme.primary_color || '#A855F7'
  const accentColor = theme.accent_color || '#EC4899'
  const bgColor = theme.background_color || '#070510'
  const fontClass = getTemplateFontClass(theme.heading_font)

  const handleCopyBank = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2500)
  }

  return (
    <div
      className="min-h-screen text-[#F8FAFC] selection:bg-purple-600 selection:text-white font-sans antialiased relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Music Player if allowed by plan */}
      {plan.allow_music && content.music_url && (
        <BackgroundMusicPlayer
          musicUrl={content.music_url}
          musicTitle={content.music_title || 'Música de Fondo'}
        />
      )}

      {/* Ambient Lighting Orbs */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="fixed bottom-0 right-10 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-15"
        style={{ backgroundColor: accentColor }}
      />

      {/* Guest Personalized Pass */}
      {guest && (
        <div className="relative z-30 bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 text-center">
          <p className="text-xs text-slate-300">
            Pase Personal Exclusivo para: <strong className="text-white font-bold">{guest.name}</strong>
            <span className="mx-2 text-purple-400">·</span>
            <span className="font-mono text-purple-300">
              {guest.authorizedCompanions === 1
                ? '1 cupo reservado'
                : `${guest.authorizedCompanions} cupos reservados`}
            </span>
          </p>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {subtitle && (
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-purple-300">
              {subtitle}
            </p>
          )}

          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight ${fontClass}`}>
            {title}
          </h1>

          {hosts && (
            <p className="text-lg sm:text-xl text-slate-300 font-medium">
              {hosts}
            </p>
          )}

          {quote && (
            <blockquote className="italic text-sm sm:text-base text-slate-400 max-w-lg mx-auto border-y border-white/10 py-4 my-6">
              "{quote}"
            </blockquote>
          )}

          {/* Date Badge */}
          {eventDate && (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold shadow-lg">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>
                {new Date(eventDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Countdown Timer */}
          {plan.allow_countdown && eventDate && (
            <div className="pt-8">
              <CountdownTimer targetDate={eventDate} />
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-28 space-y-16">
        {/* LOCATIONS SECTION */}
        {(ceremony || reception) && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Lugar & Hora
              </span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-white ${fontClass}`}>
                ¿Dónde y Cuándo?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ceremony && (
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4 hover:border-purple-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{ceremony.name || 'Ceremonia'}</h3>
                    {ceremony.time && (
                      <p className="text-xs text-purple-300 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ceremony.time}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-semibold text-white">{ceremony.location_name}</p>
                    {ceremony.address && <p className="text-xs text-slate-400">{ceremony.address}</p>}
                  </div>
                  {ceremony.map_url && (
                    <a
                      href={ceremony.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 pt-2 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Cómo Llegar (Google Maps)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {reception && (
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4 hover:border-pink-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{reception.name || 'Recepción'}</h3>
                    {reception.time && (
                      <p className="text-xs text-pink-300 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{reception.time}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-semibold text-white">{reception.location_name}</p>
                    {reception.address && <p className="text-xs text-slate-400">{reception.address}</p>}
                  </div>
                  {reception.map_url && (
                    <a
                      href={reception.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-pink-400 hover:text-pink-300 pt-2 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Cómo Llegar (Google Maps)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ITINERARY */}
        {itinerary && itinerary.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Cronograma
              </span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-white ${fontClass}`}>
                Itinerario del Evento
              </h2>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              {itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                >
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold font-mono">
                    {item.time}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PHOTO GALLERY */}
        {gallery && gallery.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Momentos Especiales
              </span>
              <h2 className={`text-2xl sm:text-3xl font-bold text-white ${fontClass}`}>
                Galería de Fotos
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group bg-slate-900"
                >
                  <img
                    src={imgUrl}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DRESS CODE & GIFTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dressCode && (
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Código de Vestimenta</h3>
              <p className="text-sm text-slate-300 font-medium">{dressCode}</p>
            </div>
          )}

          {gifts && (
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Sugerencia de Regalos</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{gifts.message}</p>
              {gifts.bank_details && (
                <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-left text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Datos de Transferencia:</span>
                    <button
                      onClick={() => handleCopyBank(gifts.bank_details!)}
                      className="text-purple-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedBank ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-400 whitespace-pre-wrap">
                    {gifts.bank_details}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RSVP ACTION SECTION */}
        <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-b from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Confirmación de Asistencia
            </span>
            <h2 className={`text-3xl font-extrabold text-white ${fontClass}`}>
              ¿Nos acompañas en este día especial?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Por favor confirma tu presencia para preparar cada detalle con el mayor de los cariños.
            </p>
          </div>

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

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p>Invitación digital creada en Nuviax · RSD SOLUTIONS</p>
      </footer>
    </div>
  )
}
