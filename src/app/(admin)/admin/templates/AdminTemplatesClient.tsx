'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Palette,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Code2,
  Check,
  Heart,
  PartyPopper,
  Wine,
  Baby,
  Church,
  GraduationCap,
  Gem,
  Calendar,
} from 'lucide-react'

export interface AdminCategory {
  id: string
  name: string
  code: string
  icon_name?: string
  display_order: number
}

export interface AdminTemplate {
  id: string
  code: string
  name: string
  description?: string
  thumbnail_url?: string
  artistic_style?: string
  assigned_developer?: string
  status: string
  is_active: boolean
  version: number
  category_id?: string
  categories?: {
    id: string
    name: string
    code: string
  }
}

// Icon helper for category
function getCategoryIcon(code: string) {
  switch (code) {
    case 'bodas':
      return <Heart className="w-4 h-4 text-rose-400" />
    case 'quinceaneras':
      return <Sparkles className="w-4 h-4 text-pink-400" />
    case 'cumpleanos-infantiles':
      return <PartyPopper className="w-4 h-4 text-amber-400" />
    case 'cumpleanos-adultos':
      return <Wine className="w-4 h-4 text-purple-400" />
    case 'graduaciones':
      return <GraduationCap className="w-4 h-4 text-cyan-400" />
    case 'baby-shower':
      return <Baby className="w-4 h-4 text-emerald-400" />
    case 'bautizos':
      return <Church className="w-4 h-4 text-indigo-400" />
    case 'aniversarios':
      return <Gem className="w-4 h-4 text-amber-300" />
    case 'corporativo':
    default:
      return <Calendar className="w-4 h-4 text-purple-400" />
  }
}

// Specific coded templates list
const DEDICATED_CODE_TEMPLATES = ['boda-elegance-gold', 'cumple-midnight-glam', 'BOD-001', 'CUM-001']

export function AdminTemplatesClient({
  initialTemplates,
  categories,
}: {
  initialTemplates: AdminTemplate[]
  categories: AdminCategory[]
}) {
  const [templates, setTemplates] = useState<AdminTemplate[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Toggle active/published status directly from list
  const handleToggleActive = async (template: AdminTemplate) => {
    const nextActive = !template.is_active
    const nextStatus = nextActive ? 'published' : 'draft'
    setUpdatingId(template.id)

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: template.id,
          is_active: nextActive,
          status: nextStatus,
        }),
      })

      if (res.ok) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === template.id
              ? { ...t, is_active: nextActive, status: nextStatus }
              : t
          )
        )
      } else {
        alert('No se pudo actualizar el estado de la plantilla.')
      }
    } catch {
      alert('Error de conexión al actualizar la plantilla.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      !searchQuery ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.artistic_style && tpl.artistic_style.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'all' ||
      tpl.category_id === selectedCategory ||
      tpl.categories?.code === selectedCategory

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && tpl.is_active) ||
      (statusFilter === 'draft' && !tpl.is_active)

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Global counts
  const totalCount = templates.length
  const activeCount = templates.filter((t) => t.is_active).length
  const draftCount = templates.filter((t) => !t.is_active).length
  const categoriesCount = categories.length

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
              Arquitectura de Contenido
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[11px] text-pink-400 font-bold uppercase tracking-widest">
              Tipos de Invitaciones & Diseños
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Plantillas por Tipo de Invitación
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Catálogo completo organizado por tipos de eventos. Gestiona qué plantillas están disponibles en vivo para los clientes y cuáles continúan en desarrollo o preparación.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates/new"
            className="rsd-glow-button px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nueva Plantilla</span>
          </Link>
        </div>
      </div>

      {/* Global Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#110D24] border border-purple-900/30">
          <span className="text-slate-400 text-xs font-medium">Tipos de Invitaciones</span>
          <p className="text-2xl font-extrabold text-white mt-1">{categoriesCount}</p>
          <span className="text-[10px] text-purple-400 mt-0.5 inline-block">Categorías del Sistema</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#110D24] border border-purple-900/30">
          <span className="text-slate-400 text-xs font-medium">Total Plantillas</span>
          <p className="text-2xl font-extrabold text-white mt-1">{totalCount}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 inline-block">En base de datos</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#110D24] border border-emerald-500/30 bg-emerald-950/10">
          <span className="text-emerald-300 text-xs font-medium">Disponibles Clientes</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{activeCount}</p>
          <span className="text-[10px] text-emerald-300/80 mt-0.5 inline-block">Activas en Catálogo</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#110D24] border border-amber-500/30 bg-amber-950/10">
          <span className="text-amber-300 text-xs font-medium">En Desarrollo / Borrador</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{draftCount}</p>
          <span className="text-[10px] text-amber-300/80 mt-0.5 inline-block">Listas para subir/activar</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#110D24] border border-purple-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, código o estilo..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-[#090714] p-1 border border-purple-900/30 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solo Activas ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Borradores ({draftCount})
            </button>
          </div>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#090714] border border-purple-900/30 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="all">Todos los Tipos de Invitaciones</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grouped by Categories (Tipos de Invitaciones) */}
      <div className="space-y-8">
        {categories
          .filter(
            (cat) =>
              selectedCategory === 'all' ||
              selectedCategory === cat.id ||
              selectedCategory === cat.code
          )
          .map((category) => {
            // Find templates belonging to this category
            const categoryTemplates = filteredTemplates.filter(
              (t) =>
                t.category_id === category.id ||
                t.categories?.code === category.code ||
                t.categories?.id === category.id
            )

            const totalInCat = categoryTemplates.length
            const activeInCat = categoryTemplates.filter((t) => t.is_active).length

            // If a search/status filter is active and this category has 0 matching templates, skip it
            if (categoryTemplates.length === 0 && (searchQuery || statusFilter !== 'all')) {
              return null
            }

            return (
              <div
                key={category.id}
                className="rounded-3xl bg-[#0F0B20] border border-purple-900/30 overflow-hidden shadow-xl"
              >
                {/* Category Header */}
                <div className="p-5 sm:p-6 bg-[#130E29] border-b border-purple-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      {getCategoryIcon(category.code)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold text-white">
                          {category.name}
                        </h2>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                          {category.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {totalInCat} {totalInCat === 1 ? 'plantilla registrada' : 'plantillas registradas'} ·{' '}
                        <span className={activeInCat > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                          {activeInCat} {activeInCat === 1 ? 'disponible para clientes' : 'disponibles para clientes'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/templates/new?category_id=${category.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Plantilla a este Tipo</span>
                    </Link>
                  </div>
                </div>

                {/* Templates List under Category */}
                {categoryTemplates.length > 0 ? (
                  <div className="divide-y divide-purple-900/20">
                    {categoryTemplates.map((template) => {
                      const isDedicatedCode =
                        DEDICATED_CODE_TEMPLATES.includes(template.code) ||
                        DEDICATED_CODE_TEMPLATES.includes(template.code.toLowerCase())

                      const isUpdating = updatingId === template.id

                      return (
                        <div
                          key={template.id}
                          className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Left: Thumbnail & Info */}
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 border border-purple-900/40 shrink-0">
                              <img
                                src={
                                  template.thumbnail_url ||
                                  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
                                }
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-white hover:text-purple-300 transition-colors">
                                  {template.name}
                                </h3>
                                <span className="font-mono text-[11px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/50">
                                  {template.code}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  v{template.version || 1}
                                </span>
                              </div>

                              <p className="text-xs text-slate-400 line-clamp-1">
                                {template.description || 'Sin descripción detallada.'}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {/* Status badge */}
                                {template.is_active ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>DISPONIBLE CLIENTES</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                    <span>BORRADOR / EN DESARROLLO</span>
                                  </span>
                                )}

                                {/* Engine badge */}
                                {isDedicatedCode ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    <Code2 className="w-3 h-3 text-pink-400" />
                                    <span>Código React Especializado</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                    <Layers className="w-3 h-3 text-blue-400" />
                                    <span>Motor Declarativo Universal</span>
                                  </span>
                                )}

                                {template.artistic_style && (
                                  <span className="text-[10px] text-slate-400">
                                    Estilo: {template.artistic_style}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                            {/* Toggle active button */}
                            <button
                              onClick={() => handleToggleActive(template)}
                              disabled={isUpdating}
                              title={template.is_active ? 'Desactivar plantilla para clientes' : 'Publicar y hacer disponible para clientes'}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                                template.is_active
                                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                              } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              {template.is_active ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                                  <span>Activa</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-slate-500" />
                                  <span>Inactiva</span>
                                </>
                              )}
                            </button>

                            {/* Demo preview */}
                            <Link
                              href={`/demo/${template.code}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-purple-400" />
                              <span>Ver Demo</span>
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/templates/${template.id}/edit`}
                              className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-xs text-slate-500">
                      No hay plantillas registradas para este tipo de invitación.
                    </p>
                    <Link
                      href={`/admin/templates/new?category_id=${category.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-bold mt-2"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Crear la primera plantilla para {category.name}</span>
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
