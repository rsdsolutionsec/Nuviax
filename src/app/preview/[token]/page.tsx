import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import {
  Calendar,
  Clock,
  MapPin,
  Gift,
  Heart,
  Navigation,
  Shirt,
  Sparkles,
  ShieldAlert,
  Eye,
  AlertCircle,
} from 'lucide-react'

interface PreviewProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: PreviewProps): Promise<Metadata> {
  const { token } = await params
  return {
    title: 'Demo Privada | Nuviax',
    description: 'Vista previa privada de invitación en borrador.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function PrivatePreviewPage({ params }: PreviewProps) {
  const { token } = await params
  const supabase = createAdminClient()

  // 1. Fetch event by demo_token
  const { data: event, error } = await supabase
    .from('events')
    .select('*, profiles(full_name, email)')
    .eq('demo_token', token)
    .maybeSingle()

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Enlace de Demo Inválido</h1>
          <p className="text-sm text-slate-400">
            El enlace de demostración privada que intentas abrir no existe o ha sido revocado por el anfitrión.
          </p>
        </div>
      </div>
    )
  }

  // 2. Check if revoked
  if (event.demo_revoked) {
    return (
      <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Demostración Revocada</h1>
          <p className="text-sm text-slate-400">
            El anfitrión ha revocado el acceso a este enlace privado de demostración.
          </p>
        </div>
      </div>
    )
  }

  // 3. Check expiration
  if (event.demo_expires_at && new Date(event.demo_expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Demostración Vencida</h1>
          <p className="text-sm text-slate-400">
            El período de validez de esta vista previa privada ha expirado.
          </p>
        </div>
      </div>
    )
  }

  const content = (event.content_data as Record<string, any>) || {}
  const ceremony = content.ceremony
  const reception = content.reception
  const gifts = content.gifts
  const itinerary = content.itinerary as Array<{ time: string; title: string; description?: string }> | undefined

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC] selection:bg-purple-600 selection:text-white">
      {/* PERSISTENT DEMO BANNER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/90 via-fuchsia-900/90 to-purple-900/90 backdrop-blur-md border-b border-purple-500/30 px-4 py-2.5 text-center shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <Eye className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span className="font-semibold">
              VISTA PREVIA PRIVADA (BORRADOR) — Modo Solo Lectura
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-black/40 text-[10px] text-amber-300 font-mono">
            No indexable · RSVP Desactivado
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {content.subtitle && (
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-purple-300">
              {content.subtitle}
            </p>
          )}

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          {content.hosts && (
            <p className="text-lg sm:text-xl text-slate-300 font-medium">
              {content.hosts}
            </p>
          )}

          {content.quote && (
            <blockquote className="italic text-sm sm:text-base text-slate-400 max-w-lg mx-auto border-y border-purple-900/30 py-4 my-6">
              "{content.quote}"
            </blockquote>
          )}

          {event.event_date && (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-white text-sm font-semibold shadow-lg">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span>
                {new Date(event.event_date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {event.event_date && (
            <div className="pt-8">
              <CountdownTimer targetDate={event.event_date} />
            </div>
          )}
        </div>
      </header>

      {/* CEREMONY & RECEPTION */}
      {(ceremony || reception) && (
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ceremony && (
              <div className="rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">{ceremony.name || 'Ceremonia'}</h3>
                {ceremony.time && <p className="text-sm text-slate-300 mt-2">Hora: {ceremony.time}</p>}
                {ceremony.location_name && (
                  <p className="text-sm font-semibold text-white mt-1">{ceremony.location_name}</p>
                )}
                {ceremony.address && <p className="text-xs text-slate-400 mt-1">{ceremony.address}</p>}
              </div>
            )}

            {reception && (
              <div className="rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
                <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">{reception.name || 'Recepción'}</h3>
                {reception.time && <p className="text-sm text-slate-300 mt-2">Hora: {reception.time}</p>}
                {reception.location_name && (
                  <p className="text-sm font-semibold text-white mt-1">{reception.location_name}</p>
                )}
                {reception.address && <p className="text-xs text-slate-400 mt-1">{reception.address}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ITINERARY */}
      {itinerary && itinerary.length > 0 && (
        <section className="py-16 px-4 max-w-3xl mx-auto border-t border-purple-900/20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white">Itinerario</h3>
          </div>
          <div className="space-y-4">
            {itinerary.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#120E24] border border-purple-900/30"
              >
                <span className="font-mono text-sm font-bold text-pink-400 px-3 py-1 rounded bg-pink-500/10">
                  {step.time}
                </span>
                <span className="text-sm text-white font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DRESS CODE & GIFTS */}
      <section className="py-16 px-4 max-w-2xl mx-auto text-center border-t border-purple-900/20 space-y-6">
        {content.dress_code && (
          <div>
            <h3 className="text-xl font-bold text-white">Código de Vestimenta</h3>
            <p className="text-sm text-slate-300 mt-1">{content.dress_code}</p>
          </div>
        )}
        {gifts && (
          <div>
            <h3 className="text-xl font-bold text-white">Mesa de Regalos</h3>
            <p className="text-sm text-slate-400 mt-1">{gifts.message}</p>
          </div>
        )}
      </section>

      {/* RSVP NOTICE (DISABLED IN PRIVATE DEMO) */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#090714] to-[#120D29] border-t border-purple-900/30 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Confirmación de Asistencia (RSVP)</h2>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400">
            Esta es una <strong className="text-purple-300">demostración privada</strong>. El formulario de confirmación de asistencia estará activo cuando el anfitrión publique oficialmente la invitación.
          </div>
          <button
            disabled
            className="w-full py-3 rounded-xl bg-purple-900/30 text-purple-400 border border-purple-500/20 font-bold text-sm cursor-not-allowed opacity-60"
          >
            Confirmación Inactiva en Demo
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-xs text-slate-600 border-t border-purple-900/20">
        <p>Demo Privada generada en Nuviax · RSD SOLUTIONS</p>
      </footer>
    </div>
  )
}
