import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import { PublicRsvpModal } from '@/components/invitation/PublicRsvpModal'
import {
  Calendar,
  Clock,
  MapPin,
  Gift,
  Heart,
  Navigation,
  Shirt,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react'

interface DemoProps {
  params: Promise<{ template: string }>
}

const DEFAULT_DEMO = {
  title: 'Ana & Carlos',
  subtitle: 'Nuestra Boda',
  hosts: 'Ana Lucía Silva & Carlos Mendoza',
  quote: 'Dos vidas, un solo corazón latiendo juntos.',
  date: '2026-11-28T17:00:00Z',
  ceremony: {
    name: 'Ceremonia Religiosa',
    time: '17:00',
    location_name: 'Parroquia Nuestra Señora de la Paz',
    address: 'Av. Las Palmas # 120, El Poblado',
    map_url: 'https://maps.google.com',
  },
  reception: {
    name: 'Recepción & Fiesta',
    time: '19:30',
    location_name: 'Hacienda Real Los Rosales',
    address: 'Km 14 Vía Campestre',
    map_url: 'https://maps.google.com',
  },
  itinerary: [
    { time: '17:00', title: 'Llegada de invitados & Ceremonia' },
    { time: '18:30', title: 'Sesión de Fotos & Cóctel de Bienvenida' },
    { time: '20:00', title: 'Cena de Gala & Brindis' },
    { time: '21:30', title: 'Primer Baile de Esposos & Fiesta' },
  ],
  dress_code: 'Rigurosa Etiqueta / Traje Formal Oscuro',
  gifts: {
    message: 'Su presencia es nuestro mayor regalo. Si desean tener un detalle con nosotros, dispondremos de lluvia de sobres el día del evento.',
  },
}

export default async function DemoPage({ params }: DemoProps) {
  const { template } = await params
  const supabase = await createClient()

  // 1. Query template from database by slug or uppercase code
  const { data: dbTemplate } = await supabase
    .from('templates')
    .select('*, categories(name)')
    .or(`code.eq.${template.toUpperCase()},slug.eq.${template}`)
    .maybeSingle()

  const example = dbTemplate?.example_data || {}

  const config = {
    title: example.title || dbTemplate?.name || DEFAULT_DEMO.title,
    subtitle: example.subtitle || dbTemplate?.categories?.name || DEFAULT_DEMO.subtitle,
    hosts: example.hosts || DEFAULT_DEMO.hosts,
    quote: example.quote || DEFAULT_DEMO.quote,
    date: example.date || DEFAULT_DEMO.date,
    ceremony: example.ceremony || DEFAULT_DEMO.ceremony,
    reception: example.reception || DEFAULT_DEMO.reception,
    itinerary: example.itinerary || DEFAULT_DEMO.itinerary,
    dress_code: example.dress_code || DEFAULT_DEMO.dress_code,
    gifts: example.gifts || DEFAULT_DEMO.gifts,
  }

  const templateCode = dbTemplate?.code || template

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC]">
      {/* Floating Demo Top Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-purple-500/30 shadow-2xl">
        <Link
          href="/catalog"
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo</span>
        </Link>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="text-[11px] text-pink-400 font-bold uppercase tracking-wider">
          Demo: {templateCode}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <Link
          href={`/dashboard/events/new?template=${templateCode}`}
          className="rsd-glow-button text-xs font-bold text-white px-3 py-1 rounded-full"
        >
          Usar esta plantilla
        </Link>
      </div>

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-purple-300">
            {config.subtitle}
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {config.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-medium">
            {config.hosts}
          </p>

          <blockquote className="italic text-sm sm:text-base text-slate-400 max-w-lg mx-auto border-y border-purple-900/30 py-4 my-6">
            "{config.quote}"
          </blockquote>

          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-white text-sm font-semibold shadow-lg">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span>
              {new Date(config.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="pt-8">
            <CountdownTimer targetDate={config.date} />
          </div>
        </div>
      </header>

      {/* CEREMONY & RECEPTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {config.ceremony && (
            <div className="rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{config.ceremony.name}</h3>
              <p className="text-sm text-slate-300 mt-2">Hora: {config.ceremony.time}</p>
              <p className="text-sm font-semibold text-white mt-1">{config.ceremony.location_name}</p>
              <p className="text-xs text-slate-400 mt-1">{config.ceremony.address}</p>
            </div>
          )}

          {config.reception && (
            <div className="rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{config.reception.name}</h3>
              <p className="text-sm text-slate-300 mt-2">Hora: {config.reception.time}</p>
              <p className="text-sm font-semibold text-white mt-1">{config.reception.location_name}</p>
              <p className="text-xs text-slate-400 mt-1">{config.reception.address}</p>
            </div>
          )}
        </div>
      </section>

      {/* ITINERARY */}
      {config.itinerary && (
        <section className="py-16 px-4 max-w-3xl mx-auto border-t border-purple-900/20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white">Itinerario</h3>
          </div>
          <div className="space-y-4">
            {config.itinerary.map((step: any, idx: number) => (
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
        <div>
          <h3 className="text-xl font-bold text-white">Código de Vestimenta</h3>
          <p className="text-sm text-slate-300 mt-1">{config.dress_code}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Mesa de Regalos</h3>
          <p className="text-sm text-slate-400 mt-1">{config.gifts?.message}</p>
        </div>
      </section>

      {/* RSVP DEMO */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#090714] to-[#120D29] border-t border-purple-900/30 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Confirmación de Asistencia</h2>
          <p className="text-sm text-slate-300">
            En la invitación real, tus invitados confirmarán con un solo toque desde su celular.
          </p>
          <div className="pt-4">
            <PublicRsvpModal
              eventSlug="demo"
              eventTitle={config.title}
              maxCompanions={2}
              askDietary={true}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
