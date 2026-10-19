import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import { PublicRsvpModal } from '@/components/invitation/PublicRsvpModal'
import {
  Calendar,
  Clock,
  MapPin,
  Gift,
  Sparkles,
  Heart,
  Navigation,
  Shirt,
  Volume2,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: event } = await supabase
    .from('events')
    .select('title, content_data, event_date')
    .eq('slug', slug)
    .maybeSingle()

  if (!event) {
    return {
      title: 'Invitación no encontrada | Nuviax',
    }
  }

  const content = (event.content_data as Record<string, any>) || {}
  const hosts = content.hosts || ''
  const title = event.title
  const description =
    content.quote || `Estás cordialmente invitado a celebrar con nosotros este momento inolvidable.`
  const coverImage =
    content.gallery?.[0] ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

  return {
    title: `${title} | Invitación Digital`,
    description,
    openGraph: {
      title: `${title} — Invitación Exclusiva`,
      description,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
    },
  }
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { t: invitationToken } = await searchParams

  const supabase = createAdminClient()

  // 1. Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*, templates(*), plans(*)')
    .eq('slug', slug)
    .maybeSingle()

  // 2. Check slug redirects if not found
  if (!event) {
    const { data: redirectRecord } = await supabase
      .from('slug_redirects')
      .select('event_id, events(slug)')
      .eq('old_slug', slug)
      .maybeSingle()

    if (redirectRecord && (redirectRecord.events as any)?.slug) {
      redirect(`/${(redirectRecord.events as any).slug}`)
    }

    notFound()
  }

  // 3. Handle expired events
  const isExpired =
    event.status === 'expired' ||
    (event.expires_at && new Date(event.expires_at) < new Date())

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#090714] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Evento Concluido</h1>
          <p className="text-sm text-slate-300">
            La celebración de <span className="font-semibold text-purple-300">{event.title}</span> ya se ha llevado a cabo.
          </p>
          <p className="text-xs text-slate-500">
            Agradecemos a todos los familiares y amigos que nos acompañaron y compartieron este momento especial con nosotros.
          </p>
        </div>
      </div>
    )
  }

  const content = (event.content_data as Record<string, any>) || {}
  const theme = (event.visual_theme as Record<string, any>) || {}
  const planLimits = (event.plans?.limits as Record<string, any>) || {}

  // 4. Fetch guest details if personal token is present
  let guestName = ''
  let authorizedCompanions = planLimits.max_companions_per_guest || 2
  if (invitationToken) {
    const { data: guest } = await supabase
      .from('guests')
      .select('first_name, last_name, authorized_companions')
      .eq('invitation_token', invitationToken)
      .eq('event_id', event.id)
      .maybeSingle()

    if (guest) {
      guestName = `${guest.first_name} ${guest.last_name || ''}`.trim()
      authorizedCompanions = guest.authorized_companions
    }
  }

  const ceremony = content.ceremony
  const reception = content.reception
  const gifts = content.gifts
  const itinerary = content.itinerary as Array<{ time: string; title: string; description?: string }> | undefined
  const gallery = (content.gallery as string[]) || []

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC] selection:bg-purple-600 selection:text-white font-sans antialiased">
      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {content.subtitle && (
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-purple-300">
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

          {/* Event Date badge */}
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

          {/* Countdown Timer (if enabled in plan) */}
          {event.event_date && (
            <div className="pt-8">
              <CountdownTimer targetDate={event.event_date} />
            </div>
          )}
        </div>
      </header>

      {/* CEREMONY & RECEPTION SECTION */}
      {(ceremony || reception) && (
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Dónde & Cuándo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Ubicación y Horarios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ceremony && (
              <div className="rsd-glow-card p-8 rounded-3xl border border-purple-900/30 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{ceremony.name || 'Ceremonia'}</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    {ceremony.time && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>Hora: {ceremony.time}</span>
                      </p>
                    )}
                    {ceremony.location_name && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="font-semibold text-white">{ceremony.location_name}</span>
                      </p>
                    )}
                    {ceremony.address && (
                      <p className="text-slate-400 pl-6">{ceremony.address}</p>
                    )}
                  </div>
                </div>

                {ceremony.map_url && (
                  <div className="mt-8 pt-6 border-t border-purple-900/20">
                    <a
                      href={ceremony.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Cómo llegar en Google Maps</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {reception && (
              <div className="rsd-glow-card p-8 rounded-3xl border border-purple-900/30 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{reception.name || 'Recepción'}</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    {reception.time && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span>Hora: {reception.time}</span>
                      </p>
                    )}
                    {reception.location_name && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span className="font-semibold text-white">{reception.location_name}</span>
                      </p>
                    )}
                    {reception.address && (
                      <p className="text-slate-400 pl-6">{reception.address}</p>
                    )}
                  </div>
                </div>

                {reception.map_url && (
                  <div className="mt-8 pt-6 border-t border-purple-900/20">
                    <a
                      href={reception.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Cómo llegar en Google Maps</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ITINERARY SECTION */}
      {itinerary && itinerary.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto border-t border-purple-900/20">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Cronograma
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Itinerario del Evento
            </h2>
          </div>

          <div className="space-y-6">
            {itinerary.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#120E24] border border-purple-900/30"
              >
                <div className="w-16 text-center font-mono font-bold text-sm text-pink-400 py-1 bg-pink-500/10 rounded-lg">
                  {step.time}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{step.title}</h4>
                  {step.description && (
                    <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DRESS CODE */}
      {content.dress_code && (
        <section className="py-16 px-4 max-w-2xl mx-auto text-center border-t border-purple-900/20">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Código de Vestimenta</h3>
          <p className="mt-3 text-base text-slate-300 font-medium">
            {content.dress_code}
          </p>
        </section>
      )}

      {/* GIFTS / MESA DE REGALOS */}
      {gifts && (
        <section className="py-16 px-4 max-w-2xl mx-auto text-center border-t border-purple-900/20">
          <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Mesa de Regalos</h3>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {gifts.message || 'Tu presencia es nuestro mayor regalo.'}
          </p>
          {gifts.bank_info && (
            <div className="mt-6 p-4 rounded-xl bg-[#120E24] border border-purple-900/30 font-mono text-xs text-purple-300">
              {gifts.bank_info}
            </div>
          )}
        </section>
      )}

      {/* RSVP INTERACTIVE CALL TO ACTION */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#090714] to-[#120D29] border-t border-purple-900/30 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
            ¡Te esperamos!
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Confirma tu Asistencia
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
            Por favor confirma antes de la fecha límite para coordinar los detalles de tu recepción.
          </p>

          <div className="pt-4">
            <PublicRsvpModal
              eventSlug={event.slug}
              eventTitle={event.title}
              maxCompanions={authorizedCompanions}
              askDietary={true}
              invitationToken={invitationToken}
              initialGuestName={guestName}
            />
          </div>
        </div>
      </section>

      {/* INVITATION FOOTER */}
      <footer className="py-8 text-center text-xs text-slate-500 border-t border-purple-900/20">
        <p>
          Invitación Digital creada con{' '}
          <span className="text-purple-300 font-semibold">Nuviax</span> · RSD SOLUTIONS
        </p>
      </footer>
    </div>
  )
}
