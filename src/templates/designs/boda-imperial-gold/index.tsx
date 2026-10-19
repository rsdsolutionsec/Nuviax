'use client'

import { useState } from 'react'
import { InvitationTemplateProps } from '@/templates/types'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import { PublicRsvpModal } from '@/components/invitation/PublicRsvpModal'
import { BackgroundMusicPlayer } from '@/components/invitation/BackgroundMusicPlayer'
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
  Users,
} from 'lucide-react'

export function BodaImperialGoldTemplate({
  event,
  content,
  theme,
  plan,
  isDemo = false,
  isReadOnly = false,
  guest,
}: InvitationTemplateProps) {
  const [copiedBank, setCopiedBank] = useState(false)

  const title = content.title || event.title || 'Ana & Carlos'
  const subtitle = content.subtitle || 'Nuestra Boda'
  const hosts = content.hosts || 'Ana Lucía Silva & Carlos Mendoza'
  const quote = content.quote || 'Dos vidas, un solo corazón latiendo juntos hacia una misma eternidad.'
  const eventDate = content.date || event.event_date || '2026-11-28T17:00:00Z'

  const ceremony = content.ceremony
  const reception = content.reception
  const itinerary = content.itinerary || [
    { time: '17:00', title: 'Ceremonia Religiosa & Bendición' },
    { time: '18:30', title: 'Cóctel de Bienvenida & Fotografías' },
    { time: '20:00', title: 'Cena de Gala & Brindis de Honor' },
    { time: '21:30', title: 'Primer Baile de Esposos & Fiesta' },
  ]
  const dressCode = content.dress_code || 'Rigurosa Etiqueta / Traje Formal Oscuro'
  const gifts = content.gifts || {
    message: 'Su presencia y cariño son nuestro mejor obsequio. Si desean hacernos un presente, contaremos con lluvia de sobres el día del evento.',
  }
  const gallery = content.gallery || []

  const handleCopyBank = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC] selection:bg-amber-500 selection:text-black font-sans antialiased relative overflow-hidden">
      {/* Dynamic Background Music Player if enabled by plan */}
      {plan.allow_music && (
        <BackgroundMusicPlayer
          musicUrl={content.music_url}
          musicTitle={content.music_title || 'Vals Nupcial de Oro'}
        />
      )}

      {/* Floating Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* GUEST PASS BANNER (If personalized guest token) */}
      {guest && (
        <div className="relative z-30 bg-gradient-to-r from-amber-950/70 via-purple-950/70 to-amber-950/70 border-b border-amber-500/30 px-6 py-3 text-center">
          <p className="text-xs text-amber-200">
            Pase Personal Exclusivo para:{' '}
            <strong className="text-white font-bold">{guest.name}</strong>
            <span className="mx-2 text-amber-400">·</span>
            <span className="text-amber-300 font-mono">
              {guest.authorizedCompanions === 1
                ? '1 cupo reservado'
                : `${guest.authorizedCompanions} cupos reservados`}
            </span>
          </p>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        {/* Decorative Laurel Wreath Icon */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-600/20 border border-amber-500/30 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/10">
          <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold text-amber-300">
            {subtitle}
          </p>

          {/* Title rendered in Cinzel roman font */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-cinzel font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-amber-200 leading-tight tracking-tight drop-shadow-2xl">
            {title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-medium tracking-wide">
            {hosts}
          </p>

          <blockquote className="italic text-sm sm:text-base text-slate-400 max-w-lg mx-auto border-y border-amber-500/20 py-4 my-6 leading-relaxed">
            "{quote}"
          </blockquote>

          {/* Date pill */}
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-white text-sm font-semibold shadow-xl shadow-amber-500/10">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>
              {new Date(eventDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Countdown Timer if enabled */}
          {plan.allow_countdown && (
            <div className="pt-8">
              <CountdownTimer targetDate={eventDate} />
            </div>
          )}
        </div>
      </header>

      {/* CEREMONY & RECEPTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ceremony && (
            <div className="rsd-glow-card p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                Lugar Sagrado
              </span>
              <h2 className="text-2xl font-bold font-cinzel text-white">{ceremony.name || 'Ceremonia Religiosa'}</h2>
              {ceremony.time && (
                <p className="text-sm text-amber-300 mt-2 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hora: {ceremony.time}</span>
                </p>
              )}
              {ceremony.location_name && (
                <p className="text-sm font-semibold text-white mt-3">{ceremony.location_name}</p>
              )}
              {ceremony.address && (
                <p className="text-xs text-slate-400 mt-1">{ceremony.address}</p>
              )}

              {ceremony.map_url && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <a
                    href={ceremony.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Cómo Llegar (Google Maps)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {reception && (
            <div className="rsd-glow-card p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden group hover:border-pink-400/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-300 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
                Celebración
              </span>
              <h2 className="text-2xl font-bold font-cinzel text-white">{reception.name || 'Recepción & Banquete'}</h2>
              {reception.time && (
                <p className="text-sm text-pink-300 mt-2 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hora: {reception.time}</span>
                </p>
              )}
              {reception.location_name && (
                <p className="text-sm font-semibold text-white mt-3">{reception.location_name}</p>
              )}
              {reception.address && (
                <p className="text-xs text-slate-400 mt-1">{reception.address}</p>
              )}

              {reception.map_url && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <a
                    href={reception.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-pink-300 hover:text-pink-200 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>Ubicación de Fiesta (Maps)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ITINERARY */}
      {itinerary.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto border-t border-white/5 relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Cronograma de Nuestra Celebración
            </span>
            <h2 className="text-3xl font-bold font-cinzel text-white mt-1">Itinerario de Boda</h2>
          </div>

          <div className="space-y-4">
            {itinerary.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#0F0B1E] border border-amber-500/20 hover:border-amber-400/40 transition-colors"
              >
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs font-extrabold text-amber-300 shrink-0">
                  {step.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DRESS CODE & GIFTS */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-white/5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          {/* Dress Code */}
          <div className="p-8 rounded-3xl bg-[#0F0B1E] border border-purple-900/30 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-300 flex items-center justify-center mx-auto">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-cinzel text-white">Código de Vestimenta</h3>
            <p className="text-sm text-amber-300 font-semibold">{dressCode}</p>
            <p className="text-xs text-slate-400">
              Agradecemos su elegancia para acompañarnos en esta noche solemne.
            </p>
          </div>

          {/* Gifts */}
          <div className="p-8 rounded-3xl bg-[#0F0B1E] border border-purple-900/30 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-300 flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-cinzel text-white">Mesa de Regalos</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{gifts.message}</p>

            {gifts.bank_info && (
              <div className="pt-2">
                <button
                  onClick={() => handleCopyBank(gifts.bank_info || '')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1.5 mx-auto transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedBank ? '¡Datos Bancarios Copiados!' : 'Copiar Cuenta Bancaria'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP INTERACTIVE SECTION */}
      {plan.allow_rsvp && (
        <section className="py-24 px-4 bg-gradient-to-b from-[#070510] to-[#120B24] border-t border-amber-500/20 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-5">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
              Confirmación de Asistencia
            </span>
            <h2 className="text-4xl font-extrabold font-cinzel text-white">¿Nos Acompañarás?</h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Por favor confirma tu presencia antes del{' '}
              <strong className="text-amber-300">
                {new Date(new Date(eventDate).getTime() - 15 * 86400000).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                })}
              </strong>{' '}
              para asegurar tu lugar en nuestro banquete de gala.
            </p>

            <div className="pt-4">
              <PublicRsvpModal
                eventSlug={event.slug}
                eventTitle={title}
                maxCompanions={guest?.authorizedCompanions || 2}
                askDietary={plan.allow_advanced_rsvp ?? true}
              />
            </div>
          </div>
        </section>
      )}

      {/* FOOTER & WATERMARK */}
      <footer className="py-12 px-4 text-center border-t border-white/5 relative z-10 text-xs text-slate-500">
        <p className="font-cinzel text-slate-400">
          {title} · Con amor y gratitud
        </p>

        {/* Nuviax discrete watermark if not removed by plan */}
        {!plan.remove_watermark && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
            <span>Diseñado y publicado con</span>
            <a
              href="https://nuviax.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-pink-300 font-bold transition-colors"
            >
              Nuviax
            </a>
            <span>by RSD SOLUTIONS</span>
          </div>
        )}
      </footer>
    </div>
  )
}
