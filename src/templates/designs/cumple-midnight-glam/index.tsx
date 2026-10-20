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
  Gift,
  Shirt,
  Copy,
  CheckCircle2,
  ExternalLink,
  PartyPopper,
  Wine,
  Camera,
  Compass,
} from 'lucide-react'

export function CumpleMidnightGlamTemplate({
  event,
  content,
  theme,
  plan,
  invitationToken,
  guest,
}: InvitationTemplateProps) {
  const [copiedBank, setCopiedBank] = useState(false)

  // Dynamic values with elegant celebratory fallbacks
  const title = content.title || event.title || 'Mis 30 Años · Noche VIP'
  const subtitle = content.subtitle || 'Celebración de Cumpleaños'
  const hosts = content.hosts || 'Sebastián Rodríguez'
  const quote =
    content.quote ||
    'La vida se mide en momentos inolvidables, sonrisas compartidas y copas alzadas. ¡Ven a celebrar conmigo esta nueva década!'
  const eventDate = content.date || event.event_date || '2026-11-20T21:00:00Z'

  // Colors & Aesthetic configuration
  const primaryColor = theme.primary_color || '#EC4899' // Hot Pink / Neon Magenta
  const accentColor = theme.accent_color || '#F59E0B' // Golden Amber
  const secondaryColor = theme.secondary_color || '#8B5CF6' // Electric Violet
  const bgColor = theme.background_color || '#080512'

  const reception = content.reception || {
    name: 'Rooftop Lounge & Cóctel VIP',
    location_name: 'Skyline Terrace Bar · Piso 18',
    address: 'Av. Las Américas # 45-80, Zona Rosa',
    time: '21:00',
    map_url: 'https://maps.google.com',
  }

  const itinerary = content.itinerary || [
    {
      time: '21:00',
      title: 'Alfombra Roja & Cóctel de Bienvenida',
      description: 'Recepción de invitados, sesión fotográfica y brindis con cócteles de autor.',
    },
    {
      time: '22:30',
      title: 'Palabras de Agradecimiento & Brindis Central',
      description: 'Momento emotivo para agradecer la compañía de grandes amigos y familia.',
    },
    {
      time: '23:30',
      title: 'Tarta de Cumpleaños & Velas',
      description: 'Pedir deseos y cantar el tradicional cumpleaños feliz con bengalas de luces.',
    },
    {
      time: '00:00',
      title: 'DJ Live Set & Fiesta Neón',
      description: 'Música en vivo, pista de baile iluminada y barra libre hasta el amanecer.',
    },
  ]

  const dressCode = content.dress_code || 'Cóctel VIP / Black Tie con Toque Neón o Metálico'

  const gifts = content.gifts || {
    message:
      'Tu presencia y ganas de celebrar son el regalo más importante. Si deseas tener una atención con el cumpleañero, contaremos con mesa de regalos y lluvia de sobres.',
    bank_details:
      'Banco Pichincha · Ahorros # 2209182341\nTitular: Sebastián Rodríguez\nIdentificación: 1718291024\nAlias: CUMPLE.SEBAS.VIP',
  }

  const gallery =
    content.gallery && content.gallery.length > 0
      ? content.gallery
      : [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        ]

  const copyBankData = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2500)
  }

  return (
    <div
      className="min-h-screen text-[#F8FAFC] font-sans antialiased relative overflow-hidden selection:bg-pink-500 selection:text-white"
      style={{ backgroundColor: bgColor }}
    >
      {/* 1. MÚSICA DE FONDO (Si el plan lo autoriza) */}
      {plan.allow_music && (
        <BackgroundMusicPlayer
          musicUrl={
            content.music_url ||
            'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3'
          }
          musicTitle={content.music_title || 'Celebration Beats VIP'}
        />
      )}

      {/* 2. DESTELLOS Y ESFERAS AMBIENTALES FLOTANTES */}
      <div
        className="fixed -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full blur-[170px] pointer-events-none opacity-25 animate-pulse"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="fixed top-1/3 -right-20 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ backgroundColor: secondaryColor }}
      />
      <div
        className="fixed bottom-10 -left-20 w-[450px] h-[450px] rounded-full blur-[150px] pointer-events-none opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      {/* 3. PASE VIP DE INVITADO (Si llega con token personalizado) */}
      {guest && (
        <div className="relative z-30 bg-gradient-to-r from-pink-950/80 via-purple-950/80 to-amber-950/80 border-b border-pink-500/30 px-6 py-3 text-center backdrop-blur-md">
          <p className="text-xs text-slate-200">
            🎟️ Pase VIP de Invitado de Honor:{' '}
            <strong className="text-white font-bold">{guest.name}</strong>
            <span className="mx-2 text-pink-400">·</span>
            <span className="text-amber-300 font-mono font-semibold">
              {guest.authorizedCompanions === 1
                ? '1 cupo reservado'
                : `${guest.authorizedCompanions} cupos reservados`}
            </span>
          </p>
        </div>
      )}

      {/* 4. SECCIÓN HERO: CELEBRACIÓN DE IMPACTO */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        {/* Festive Icon with Animated Sparks */}
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-amber-500 p-0.5 shadow-2xl shadow-pink-600/30 animate-bounce duration-1000">
            <div className="w-full h-full bg-[#0E0920] rounded-[22px] flex items-center justify-center">
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Subtitle Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-inner">
          <Wine className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-pink-300">
            {subtitle}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
          {title}
        </h1>

        {/* Host Name */}
        <p className="text-lg sm:text-xl font-medium text-amber-300/90 mt-4 tracking-wide">
          Homenajeado: <strong className="text-white">{hosts}</strong>
        </p>

        {/* Quote */}
        {quote && (
          <div className="max-w-xl mx-auto mt-6 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <p className="italic text-xs sm:text-sm text-slate-300 leading-relaxed">
              "{quote}"
            </p>
          </div>
        )}

        {/* Countdown Timer */}
        {plan.allow_countdown && eventDate && (
          <div className="pt-8 w-full max-w-md mx-auto">
            <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-3">
              Cuenta Regresiva para la Gran Noche
            </div>
            <CountdownTimer targetDate={eventDate} />
          </div>
        )}

        {/* Direct Action Button to scroll to RSVP */}
        {plan.allow_rsvp && (
          <div className="pt-8">
            <a
              href="#rsvp-section"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-pink-600/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Confirmar Mi Asistencia</span>
            </a>
          </div>
        )}
      </header>

      {/* 5. CUERPO PRINCIPAL DEL EVENTO */}
      <main className="max-w-4xl mx-auto px-4 pb-28 space-y-16 relative z-10">
        {/* LUGAR Y RECEPCIÓN VIP */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#0F0A24]/90 border border-purple-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-pink-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block">
                  Ubicación de la Celebración
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  {reception.name}
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
              <Clock className="w-4 h-4" />
              <span>Inicio: {reception.time || '21:00'}</span>
            </div>
          </div>

          <div className="space-y-2 text-slate-300 text-sm">
            <p className="font-semibold text-white text-base">
              {reception.location_name}
            </p>
            {reception.address && (
              <p className="text-slate-400 text-xs sm:text-sm">
                {reception.address}
              </p>
            )}
          </div>

          <div className="pt-6 flex flex-wrap gap-3">
            {reception.map_url && (
              <a
                href={reception.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-200 text-xs font-bold transition-all flex items-center gap-2 hover:translate-x-0.5"
              >
                <Compass className="w-4 h-4" />
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </section>

        {/* CRONOGRAMA VIP DE LA NOCHE */}
        {itinerary && itinerary.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Momento a Momento
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Cronograma de la Noche
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-14 h-12 rounded-xl bg-gradient-to-tr from-purple-900/60 to-pink-900/60 border border-pink-500/30 flex items-center justify-center font-mono font-extrabold text-xs text-pink-300 shrink-0 group-hover:scale-105 transition-transform">
                    {item.time}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-pink-300 transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CÓDIGO DE VESTIMENTA (DRESS CODE) */}
        {dressCode && (
          <section className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-purple-950/40 border border-pink-500/30 text-center space-y-4 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                Código de Vestimenta
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {dressCode}
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Te sugerimos lucir tu mejor atuendo de noche para deslumbrar en la alfombra roja y en las fotos de recuerdo.
            </p>
          </section>
        )}

        {/* GALERÍA DE FOTOS */}
        {gallery && gallery.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                Momentos & Recuerdos
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
                <Camera className="w-6 h-6 text-pink-400" />
                <span>Galería de Momentos</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all duration-300 shadow-lg"
                >
                  <img
                    src={imgUrl}
                    alt={`Recuerdo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[11px] font-semibold text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-400" /> Momentos VIP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MESA DE REGALOS & DATOS BANCARIOS */}
        {gifts && (gifts.message || gifts.bank_details) && (
          <section className="p-8 rounded-3xl bg-[#0F0A24]/90 border border-purple-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Mesa de Regalos & Lluvia de Sobres</h3>
            </div>

            {gifts.message && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {gifts.message}
              </p>
            )}

            {gifts.bank_details && (
              <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="font-mono text-xs text-slate-300 whitespace-pre-line">
                  {gifts.bank_details}
                </div>
                <button
                  onClick={() => copyBankData(gifts.bank_details!)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedBank ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado con Éxito!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-pink-400" />
                      <span>Copiar Datos Bancarios</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {/* CONFIRMACIÓN DE ASISTENCIA FINAL (RSVP) */}
        {plan.allow_rsvp && (
          <section
            id="rsvp-section"
            className="p-10 rounded-3xl bg-gradient-to-tr from-pink-900/40 via-purple-950/60 to-indigo-950/40 border border-pink-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="max-w-lg mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-300">
                Tu Presencia es Fundamental
              </span>
              <h3 className="text-3xl font-extrabold text-white">
                ¿Nos Acompañas a Celebrar?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Por favor confírmanos antes del evento para asegurar tu recepción, mesa y credencial VIP de acceso.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <PublicRsvpModal
                eventSlug={event.slug}
                eventTitle={title}
                maxCompanions={guest?.authorizedCompanions || 2}
                askDietary={true}
                invitationToken={invitationToken}
                initialGuestName={guest?.name}
              />
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-purple-900/20 py-8 text-center text-xs text-slate-500 relative z-10">
        <p>
          Invitación de Cumpleaños Exclusiva creada con{' '}
          <strong className="text-slate-400">Nuviax</strong> · RSD Solutions
        </p>
      </footer>
    </div>
  )
}
