'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Sparkles, Eye, ArrowRight, Heart, Filter, CheckCircle2 } from 'lucide-react'

interface TemplateCard {
  id: string
  code: string
  slug: string
  name: string
  category: string
  categoryName: string
  developer: string
  artisticStyle: string
  description: string
  image: string
  badge?: string
}

const TEMPLATES_DATA: TemplateCard[] = [
  // --- PROGRAMADOR A: BODAS, ANIVERSARIOS Y PAREJAS ---
  {
    id: 'BOD-001',
    code: 'BOD-001',
    slug: 'boda-imperial-gold',
    name: 'Boda Imperial Gold',
    category: 'bodas',
    categoryName: 'Bodas & Compromisos',
    developer: 'Programador A',
    artisticStyle: 'Gala & Oro Clásico',
    description: 'Acentos dorados, tipografía romana clásica, itinerario formal y confirmación de asistencia.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
  },
  {
    id: 'BOD-002',
    code: 'BOD-002',
    slug: 'boda-jardin-botanico',
    name: 'Boda Jardín Botánico',
    category: 'bodas',
    categoryName: 'Bodas & Compromisos',
    developer: 'Programador A',
    artisticStyle: 'Orgánico & Campestre Chic',
    description: 'Follaje verde eucalipto, estilo campestre chic, caligrafía orgánica y mapa satelital.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BOD-003',
    code: 'BOD-003',
    slug: 'boda-minimalista-noir',
    name: 'Boda Minimalista Noir',
    category: 'bodas',
    categoryName: 'Bodas & Compromisos',
    developer: 'Programador A',
    artisticStyle: 'Minimalista & Editorial',
    description: 'Blanco y negro editorial, líneas arquitectónicas depuradas y elegancia contemporánea.',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BOD-004',
    code: 'BOD-004',
    slug: 'boda-bohemia-terracota',
    name: 'Boda Bohemia Terracota',
    category: 'bodas',
    categoryName: 'Bodas & Compromisos',
    developer: 'Programador A',
    artisticStyle: 'Boho Sunset & Terracota',
    description: 'Tonos tierra cálidos, pampas secas y romance al atardecer para ceremonias al aire libre.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    badge: 'Tendencia',
  },
  {
    id: 'PAR-001',
    code: 'PAR-001',
    slug: 'aniversario-bodas-de-plata',
    name: 'Bodas de Plata & Oro',
    category: 'aniversarios',
    categoryName: 'Aniversarios de Pareja',
    developer: 'Programador A',
    artisticStyle: 'Plata Noble & Sobriedad',
    description: 'Homenaje a décadas de amor y lealtad con detalles metálicos plateados y galería de recuerdos.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'PAR-002',
    code: 'PAR-002',
    slug: 'compromiso-romantico',
    name: 'Compromiso & Velada Romántica',
    category: 'aniversarios',
    categoryName: 'Aniversarios de Pareja',
    developer: 'Programador A',
    artisticStyle: 'Luz de Velas & Seda',
    description: 'Celebración íntima de pedida de mano, cena a la luz de las velas y brindis con seres queridos.',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
  },

  // --- PROGRAMADOR B: CUMPLEAÑOS, QUINCEAÑERAS E INFANTILES ---
  {
    id: 'CUM-001',
    code: 'CUM-001',
    slug: 'cumpleanos-midnight-glam',
    name: 'Cumpleaños Midnight Glam',
    category: 'cumpleanos',
    categoryName: 'Cumpleaños Adultos',
    developer: 'Programador B',
    artisticStyle: 'Nocturno & Cóctel VIP',
    description: 'Luces de bengala, fondo oscuro de alta gama, open bar y lista de canciones para fiesta.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
  },
  {
    id: 'CUM-002',
    code: 'CUM-002',
    slug: 'cumpleanos-neon-wave',
    name: 'Neon Party Retro Wave',
    category: 'cumpleanos',
    categoryName: 'Cumpleaños Adultos',
    developer: 'Programador B',
    artisticStyle: 'Cyberpunk & Neón Vibrante',
    description: 'Luces cian y magenta eléctrico, vibra de festival juvenil y cuenta atrás animada.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'CUM-003',
    code: 'CUM-003',
    slug: 'cumpleanos-tropical-sunset',
    name: 'Tropical Sunset Celebration',
    category: 'cumpleanos',
    categoryName: 'Cumpleaños Adultos',
    developer: 'Programador B',
    artisticStyle: 'Cálido & Pool Party',
    description: 'Atardecer caribeño, palmeras estilizadas y vibra veraniega para cumpleaños en piscina o playa.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'QUI-001',
    code: 'QUI-001',
    slug: 'quinceanera-princesa-rose',
    name: 'Quinceañera Princesa Rosé',
    category: 'quinceaneras',
    categoryName: 'Quinceañeras',
    developer: 'Programador B',
    artisticStyle: 'Cuento de Hadas & Rosas',
    description: 'Brillos oro rosa, vals solemne, cambio de zapatillas y dedicatorias de los padres.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    badge: 'Nuevo',
  },
  {
    id: 'QUI-002',
    code: 'QUI-002',
    slug: 'quinceanera-midnight-star',
    name: 'Quinceañera Midnight Star',
    category: 'quinceaneras',
    categoryName: 'Quinceañeras',
    developer: 'Programador B',
    artisticStyle: 'Cosmos & Tiara Brillante',
    description: 'Noche estrellada en azul zafiro, constelaciones brillantes y hora loca temática.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'KIS-001',
    code: 'KIS-001',
    slug: 'cumpleanos-kids-galaxia',
    name: 'Aventura Galáctica Kids',
    category: 'cumpleanos-infantiles',
    categoryName: 'Cumpleaños Infantiles',
    developer: 'Programador B',
    artisticStyle: 'Infantil Ilustrado & Cohetes',
    description: 'Cohetes espaciales, planetas coloridos y juegos interactivos para niños de todas las edades.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
  },

  // --- PROGRAMADOR C: BABY SHOWER, BAUTIZOS Y GRADUACIONES ---
  {
    id: 'BAB-001',
    code: 'BAB-001',
    slug: 'baby-shower-dulce-nube',
    name: 'Baby Shower Dulce Nube',
    category: 'baby-shower',
    categoryName: 'Baby Showers',
    developer: 'Programador C',
    artisticStyle: 'Ternura Pastel & Acuarela',
    description: 'Nubes sonrientes, estrellas acuarela y lista de regalos para la llegada del bebé.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BAB-002',
    code: 'BAB-002',
    slug: 'baby-shower-safari-chic',
    name: 'Baby Shower Safari Acuarela',
    category: 'baby-shower',
    categoryName: 'Baby Showers',
    developer: 'Programador C',
    artisticStyle: 'Safari Baby & Palmeras',
    description: 'Pequeño león, jirafa y elefante en tonos salvia y arena para una bienvenida inolvidable.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BAU-001',
    code: 'BAU-001',
    slug: 'bautizo-angeles-olivo',
    name: 'Bautizo Ángeles & Olivo',
    category: 'bautizos',
    categoryName: 'Bautizos & Primera Comunión',
    developer: 'Programador C',
    artisticStyle: 'Espiritual & Hojas de Olivo',
    description: 'Símbolos de paz, ramas de olivo en acuarela dorada y dedicatoria especial de los padrinos.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BAU-002',
    code: 'BAU-002',
    slug: 'bautizo-celeste-luz',
    name: 'Bautizo Celeste Luz',
    category: 'bautizos',
    categoryName: 'Bautizos & Primera Comunión',
    developer: 'Programador C',
    artisticStyle: 'Puro & Blanco Marfil',
    description: 'Blanco marfil y celeste sereno, tipografía angelical y ubicación del templo parroquial.',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'GRA-001',
    code: 'GRA-001',
    slug: 'graduacion-magna-cum-laude',
    name: 'Graduación Magna Cum Laude',
    category: 'graduaciones',
    categoryName: 'Graduaciones Académicas',
    developer: 'Programador C',
    artisticStyle: 'Académico de Gala & Birrete',
    description: 'Birretes, diplomas dorados y tono azul marino solemne para celebrar el triunfo profesional.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
  },
  {
    id: 'GRA-002',
    code: 'GRA-002',
    slug: 'graduacion-vanguardia-moderna',
    name: 'Graduación Vanguardia Moderna',
    category: 'graduaciones',
    categoryName: 'Graduaciones Académicas',
    developer: 'Programador C',
    artisticStyle: 'Tecnológico & Futuro',
    description: 'Diseño audaz para graduados de ingeniería, diseño y ciencias con galería de logros.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  },
]

const CATEGORIES = [
  { id: 'all', name: 'Todas (18)' },
  { id: 'bodas', name: 'Bodas' },
  { id: 'aniversarios', name: 'Aniversarios' },
  { id: 'quinceaneras', name: 'Quinceañeras' },
  { id: 'cumpleanos', name: 'Cumpleaños Adultos' },
  { id: 'cumpleanos-infantiles', name: 'Cumpleaños Niños' },
  { id: 'baby-shower', name: 'Baby Showers' },
  { id: 'bautizos', name: 'Bautizos' },
  { id: 'graduaciones', name: 'Graduaciones' },
]

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES_DATA
      : TEMPLATES_DATA.filter((t) => t.category === selectedCategory)

  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Biblioteca Oficial de 18 Diseños
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Elige el estilo que mejor representa tu evento
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Diseñadas bajo un contrato técnico común: 100% personalizables con tus textos, fotos, mapas, RSVP interactivo y música de fondo.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl overflow-hidden bg-[#120E24] border border-purple-900/30 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-white/10">
                      {template.categoryName}
                    </div>
                    {template.badge && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-pink-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                        {template.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[11px] text-purple-400 font-bold">{template.code}</span>
                      <span className="text-[10px] text-slate-500">{template.artisticStyle}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-3">
                  <Link
                    href={`/demo/${template.slug}`}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ver Demo</span>
                  </Link>

                  <Link
                    href={`/dashboard/events/new?template=${template.code}`}
                    className="flex-1 py-2.5 rounded-xl rsd-glow-button text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Personalizar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
