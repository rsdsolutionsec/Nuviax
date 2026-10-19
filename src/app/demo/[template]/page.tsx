import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TemplateRenderer } from '@/templates/TemplateRenderer'
import { ArrowLeft } from 'lucide-react'

interface DemoProps {
  params: Promise<{ template: string }>
}

const DEFAULT_DEMO = {
  title: 'Ana & Carlos',
  subtitle: 'Nuestra Boda',
  hosts: 'Ana Lucía Silva & Carlos Mendoza',
  quote: 'Dos vidas, un solo corazón latiendo juntos hacia una misma eternidad.',
  date: '2026-11-28T17:00:00Z',
  music_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113543.mp3',
  music_title: 'Vals Nupcial de Gala',
  ceremony: {
    name: 'Ceremonia Religiosa',
    time: '17:00',
    location_name: 'Parroquia Nuestra Señora de la Paz',
    address: 'Av. Las Palmas # 120, El Poblado',
    map_url: 'https://maps.google.com',
  },
  reception: {
    name: 'Recepción & Fiesta de Gala',
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
    bank_details: 'Banco Nacional · Cta Ahorros # 4820-1928-1928\nTitular: Carlos Mendoza\nIdentificación: 109829102\nAlias: BODA.ANA.CARLOS',
  },
  gallery: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  ],
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
    music_url: example.music_url || DEFAULT_DEMO.music_url,
    music_title: example.music_title || DEFAULT_DEMO.music_title,
    ceremony: example.ceremony || DEFAULT_DEMO.ceremony,
    reception: example.reception || DEFAULT_DEMO.reception,
    itinerary: example.itinerary || DEFAULT_DEMO.itinerary,
    dress_code: example.dress_code || DEFAULT_DEMO.dress_code,
    gifts: example.gifts || DEFAULT_DEMO.gifts,
    gallery: example.gallery || DEFAULT_DEMO.gallery,
  }

  const templateCode = dbTemplate?.code || template

  const demoEvent = {
    id: dbTemplate?.id || 'demo-preview',
    title: config.title,
    slug: dbTemplate?.slug || template,
    event_date: config.date,
    content_data: config,
    visual_theme: dbTemplate?.schema_definition?.theme_options || {},
    templates: {
      code: templateCode,
      slug: dbTemplate?.slug || template,
      name: dbTemplate?.name,
    },
    plans: {
      name: 'Plan Evento Pro (Demo)',
      code: 'pro',
      limits: {
        allow_music: true,
        allow_countdown: true,
        max_gallery_photos: 10,
        max_companions_per_guest: 4,
      },
    },
  }

  return (
    <div className="relative">
      {/* Floating Demo Top Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-purple-500/30 shadow-2xl">
        <Link
          href="/catalog"
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
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
          className="rsd-glow-button text-xs font-bold text-white px-3 py-1 rounded-full shadow-lg"
        >
          Usar esta plantilla
        </Link>
      </div>

      {/* RENDER MODULAR TEMPLATE */}
      <TemplateRenderer
        event={demoEvent}
        isDemo={true}
        isReadOnly={false}
      />
    </div>
  )
}
