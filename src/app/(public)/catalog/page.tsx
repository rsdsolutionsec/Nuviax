'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Sparkles, Eye, ArrowRight, Heart, Filter } from 'lucide-react'

interface TemplateCard {
  id: string
  code: string
  name: string
  category: string
  categoryName: string
  description: string
  image: string
  badge?: string
}

const TEMPLATES_DATA: TemplateCard[] = [
  {
    id: '1',
    code: 'boda-elegance-gold',
    name: 'Elegance Gold',
    category: 'bodas',
    categoryName: 'Bodas & Compromisos',
    description: 'Acentos dorados, tipografía romana clásica, itinerario formal y confirmación de asistencia.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
  },
  {
    id: '2',
    code: 'quince-glam-sparkle',
    name: 'Glam Sparkle XV',
    category: 'quinceaneras',
    categoryName: 'Quinceañeras',
    description: 'Brillos neón magenta y violeta, galería de fotos, cuenta regresiva y música ambiental.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    badge: 'Nuevo',
  },
  {
    id: '3',
    code: 'cumple-neon-fest',
    name: 'Neon Fest & Cocktails',
    category: 'cumpleanos',
    categoryName: 'Cumpleaños Adultos',
    description: 'Estilo moderno para celebraciones con integración a mapas y barra de confirmaciones.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    code: 'boda-botanica-minimal',
    name: 'Botánica Minimal',
    category: 'bodas',
    categoryName: 'Bodas & Compromisos',
    description: 'Diseño fresco con follaje verde eucalipto, estilo campestre chic y tipografía limpia.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    code: 'baby-shower-pastel',
    name: 'Pastel Safari Cloud',
    category: 'baby-shower',
    categoryName: 'Baby Showers',
    description: 'Ternura y bienvenida con nubes y animalitos acuarela, mesa de regalos y lista de deseos.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    code: 'cumple-kids-aventura',
    name: 'Aventura Espacial',
    category: 'cumpleanos-infantiles',
    categoryName: 'Cumpleaños Infantiles',
    description: 'Planetas, cohetes y diversión total para niños con cuenta atrás y confirmación express.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
  },
]

const CATEGORIES = [
  { id: 'all', name: 'Todas' },
  { id: 'bodas', name: 'Bodas' },
  { id: 'quinceaneras', name: 'Quinceañeras' },
  { id: 'cumpleanos', name: 'Cumpleaños Adultos' },
  { id: 'cumpleanos-infantiles', name: 'Cumpleaños Niños' },
  { id: 'baby-shower', name: 'Baby Showers' },
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
              Galería de Diseños
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Elige el estilo que mejor representa tu evento
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Todas las plantillas son 100% personalizables con tus textos, fotos, colores, mapa y música.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
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
                className="group rounded-2xl overflow-hidden bg-[#120E24] border border-purple-900/30 hover:border-purple-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-white/10">
                      {template.categoryName}
                    </div>
                    {template.badge && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-pink-600 text-[10px] font-bold text-white uppercase tracking-wider">
                        {template.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-purple-900/20 mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/demo/${template.code}`}
                    className="flex-1 text-center py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ver Demo</span>
                  </Link>

                  <Link
                    href={`/dashboard/events/new?template=${template.code}`}
                    className="flex-1 text-center rsd-glow-button py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md"
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
