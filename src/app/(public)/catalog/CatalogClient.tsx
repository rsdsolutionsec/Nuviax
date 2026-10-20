'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Eye,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Heart,
  Palette,
  Search,
} from 'lucide-react'

export interface CatalogTemplate {
  id: string
  code: string
  name: string
  description: string
  thumbnail_url: string
  artistic_style?: string
  category_id?: string
  category_name?: string
  category_code?: string
  is_active: boolean
  status: string
}

export interface CatalogCategory {
  id: string
  name: string
  code: string
  display_order: number
}

export function CatalogClient({
  templates,
  categories,
}: {
  templates: CatalogTemplate[]
  categories: CatalogCategory[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter templates by category and search
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      tpl.category_code === selectedCategory ||
      tpl.category_id === selectedCategory

    const matchesSearch =
      !searchQuery ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.artistic_style && tpl.artistic_style.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  // Group active count
  const activeCount = templates.length

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Colección Oficial de Diseños Disponibles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Elige el estilo que mejor representa tu celebración
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Plantillas profesionales con animaciones dinámicas, música ambiental, itinerarios, confirmación RSVP y Google Maps. Elige una y personalízala en minutos.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, código o estilo..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#110D24] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            Todas ({activeCount})
          </button>

          {categories.map((cat) => {
            const countForCat = templates.filter(
              (t) => t.category_code === cat.code || t.category_id === cat.id
            ).length

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.code
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat.name}</span>
                {countForCat > 0 && (
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 text-[10px] flex items-center justify-center font-mono">
                    {countForCat}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl overflow-hidden bg-[#120E24] border border-purple-900/30 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-xl hover:-translate-y-1 duration-300"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        template.thumbnail_url ||
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120E24] via-transparent to-transparent opacity-60" />

                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5">
                      <Palette className="w-3 h-3 text-purple-400" />
                      <span>{template.category_name || 'Celebración'}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Disponible</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[11px] text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                        {template.code}
                      </span>
                      {template.artistic_style && (
                        <span className="text-[11px] text-pink-300/80 font-medium">
                          {template.artistic_style}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {template.description ||
                        'Diseño interactivo con animaciones, cronograma, mapas GPS y confirmación de asistencia en tiempo real.'}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-3">
                  <Link
                    href={`/demo/${template.code}`}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ver Demostración</span>
                  </Link>

                  <Link
                    href={`/dashboard/events/new?template=${template.code}`}
                    className="flex-1 py-2.5 rounded-xl rsd-glow-button text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Elegir Plantilla</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#120E24]/60 border border-purple-900/30 max-w-xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Próximamente más diseños para esta categoría
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
              Nuestro equipo de diseño está finalizando nuevas plantillas interactivas para esta celebración. Puedes explorar las plantillas disponibles o contactarnos para un diseño a medida.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-colors"
            >
              Ver todas las plantillas disponibles ({activeCount})
            </button>
          </div>
        )}

        {/* Quality guarantee footer box */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#110D24] to-pink-950/40 border border-purple-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-600/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">¿Deseas una plantilla personalizada para tu evento?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Adaptamos la paleta de colores, tipografías y secciones a la identidad exacta de tu fiesta o matrimonio.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors whitespace-nowrap border border-white/10"
          >
            Contactar Asesor
          </Link>
        </div>
      </div>
    </div>
  )
}
