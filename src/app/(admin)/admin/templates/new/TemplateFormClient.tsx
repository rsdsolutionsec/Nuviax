'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FONT_OPTIONS,
  ARTISTIC_STYLES,
  AVAILABLE_SECTIONS,
} from '@/lib/templates/contract'
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Palette,
  Type,
  Layers,
  Image as ImageIcon,
  Check,
} from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  code: string
}

const PRESET_IMAGES = [
  { label: 'Boda Imperial', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jardín Botánico', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' },
  { label: 'Minimalista Noir', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nocturno & Cóctel', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Quinceañera Glam', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Baby Shower Nube', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' },
  { label: 'Graduación Birrete', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' },
]

export function TemplateFormClient({
  categories,
  defaultCategoryId,
}: {
  categories: CategoryItem[]
  defaultCategoryId?: string
}) {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form states
  const [code, setCode] = useState('BOD-005')
  const [name, setName] = useState('Boda Real Esmeralda')
  const [categoryId, setCategoryId] = useState(
    defaultCategoryId && categories.some((c) => c.id === defaultCategoryId)
      ? defaultCategoryId
      : categories[0]?.id || ''
  )
  const [assignedDeveloper, setAssignedDeveloper] = useState('Robin (Admin/Owner)')
  const [artisticStyle, setArtisticStyle] = useState('Gala Clásica Imperial')
  const [description, setDescription] = useState(
    'Acentos esmeralda profundos, caligrafía dorada de gala y estructura formal para ceremonias de alto nivel.'
  )
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  )

  // Typography & Theme
  const [headingFont, setHeadingFont] = useState('Cinzel')
  const [bodyFont, setBodyFont] = useState('Plus Jakarta Sans')
  const [primaryColor, setPrimaryColor] = useState('#D4AF37')
  const [secondaryColor, setSecondaryColor] = useState('#10B981')
  const [backgroundColor, setBackgroundColor] = useState('#070510')
  const [accentColor, setAccentColor] = useState('#8B5CF6')

  // Capabilities
  const [supportsMusic, setSupportsMusic] = useState(true)
  const [supportsGallery, setSupportsGallery] = useState(true)
  const [supportsCountdown, setSupportsCountdown] = useState(true)
  const [allowedSections, setAllowedSections] = useState<string[]>([
    'hero',
    'countdown',
    'quote',
    'ceremony',
    'reception',
    'itinerary',
    'gallery',
    'dress_code',
    'gifts',
    'music',
    'rsvp',
  ])

  // Example data
  const [exampleTitle, setExampleTitle] = useState('Valeria & Sebastián')
  const [exampleSubtitle, setExampleSubtitle] = useState('Nuestra Boda')
  const [exampleHosts, setExampleHosts] = useState('Valeria Morales & Sebastián Castro')
  const [exampleQuote, setExampleQuote] = useState('Dos almas que se encuentran para escribir una historia eterna.')
  const [status, setStatus] = useState<'published' | 'approved' | 'in_review' | 'draft'>('published')

  const toggleSection = (sectionId: string) => {
    if (sectionId === 'hero') return // Required
    if (allowedSections.includes(sectionId)) {
      setAllowedSections(allowedSections.filter((s) => s !== sectionId))
    } else {
      setAllowedSections([...allowedSections, sectionId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const payload = {
        code: code.trim(),
        name: name.trim(),
        category_id: categoryId,
        description: description.trim(),
        thumbnail_url: thumbnailUrl.trim(),
        artistic_style: artisticStyle,
        assigned_developer: assignedDeveloper,
        status,
        is_active: status === 'published',
        theme_options: {
          heading_font: headingFont,
          body_font: bodyFont,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          background_color: backgroundColor,
          accent_color: accentColor,
        },
        allowed_sections: allowedSections,
        supports_music: supportsMusic,
        supports_gallery: supportsGallery,
        supports_countdown: supportsCountdown,
        example_data: {
          title: exampleTitle,
          subtitle: exampleSubtitle,
          hosts: exampleHosts,
          quote: exampleQuote,
          date: '2026-12-18T18:00:00Z',
          ceremony: {
            name: 'Ceremonia Religiosa',
            time: '18:00',
            location_name: 'Catedral Primada',
            address: 'Plaza Principal # 10',
          },
          reception: {
            name: 'Recepción & Fiesta de Gala',
            time: '20:30',
            location_name: 'Club Campestre Los Rosales',
            address: 'Km 12 Vía Norte',
          },
        },
      }

      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        setErrorMessage(result.error || 'Ocurrió un error al registrar la plantilla.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/templates')
        router.refresh()
      }, 1500)
    } catch {
      setErrorMessage('Error de conexión al guardar la plantilla.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedFontClass = FONT_OPTIONS.find((f) => f.id === headingFont)?.class || 'font-cinzel'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>¡Plantilla registrada con éxito! Redirigiendo al catálogo...</span>
        </div>
      )}

      {/* SECTION 1: DATOS BÁSICOS */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-purple-900/20 pb-4">
          <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Identificación Comercial</h2>
            <p className="text-xs text-slate-400">Datos públicos y código de catálogo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Código Identificador
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: BOD-005, ROB-001"
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Nombre de la Plantilla
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Boda Real Esmeralda"
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Desarrollador / Creador
            </label>
            <input
              type="text"
              required
              value={assignedDeveloper}
              onChange={(e) => setAssignedDeveloper(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Dirección Artística
            </label>
            <select
              value={artisticStyle}
              onChange={(e) => setArtisticStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              {ARTISTIC_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Descripción Comercial
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            URL de Imagen de Portada (Catálogo)
          </label>
          <input
            type="url"
            required
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
          />

          {/* Preset image suggestions */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase mr-1">Presets:</span>
            {PRESET_IMAGES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setThumbnailUrl(preset.url)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: IDENTIDAD VISUAL, COLORES Y TIPOGRAFÍA */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-purple-900/20 pb-4">
          <div className="w-7 h-7 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Identidad Visual & Tipografía</h2>
            <p className="text-xs text-slate-400">Paleta de color y fuentes artísticas para el renderizador</p>
          </div>
        </div>

        {/* Font Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Fuente de Títulos
            </label>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Fuente de Texto y Párrafos
            </label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Moderno)</option>
              <option value="Montserrat">Montserrat (Geométrico)</option>
              <option value="Outfit">Outfit (Limpio)</option>
            </select>
          </div>
        </div>

        {/* Live Font Typography Preview */}
        <div className="p-5 rounded-xl bg-[#090714] border border-purple-900/20 text-center space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans">
            Muestra Tipográfica en Vivo
          </span>
          <p className={`text-2xl sm:text-3xl font-extrabold text-white ${selectedFontClass}`}>
            {exampleTitle}
          </p>
          <p className="text-xs text-slate-400 italic font-sans max-w-md mx-auto">
            "{exampleQuote}"
          </p>
        </div>

        {/* Color Palette Pickers */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Paleta de Colores Exclusiva
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/20 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primario</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full text-xs font-mono text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/20 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Secundario</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full text-xs font-mono text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/20 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fondo Base</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full text-xs font-mono text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090714] border border-purple-900/20 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Acento / Resplandor</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full text-xs font-mono text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SECCIONES HABILITADAS Y CAPACIDADES */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-purple-900/20 pb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Estructura & Secciones Activas</h2>
            <p className="text-xs text-slate-400">Modulares compatibles con el motor de renderizado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_SECTIONS.map((sec) => {
            const isChecked = allowedSections.includes(sec.id)
            return (
              <div
                key={sec.id}
                onClick={() => toggleSection(sec.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-purple-950/30 border-purple-500/50 text-white'
                    : 'bg-[#090714] border-purple-900/20 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-semibold">{sec.name}</span>
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                    isChecked ? 'bg-purple-600 text-white' : 'border border-slate-700'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 4: DATOS DE EJEMPLO Y ESTADO */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-purple-900/20 pb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Datos de Demostración & Estado</h2>
            <p className="text-xs text-slate-400">Contenido modelo y publicación comercial</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Título Modelo
            </label>
            <input
              type="text"
              required
              value={exampleTitle}
              onChange={(e) => setExampleTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Nombres de Anfitriones
            </label>
            <input
              type="text"
              required
              value={exampleHosts}
              onChange={(e) => setExampleHosts(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Estado Inicial de Publicación
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#090714] border-purple-900/20 text-slate-400 hover:text-white'
              }`}
            >
              Publicada (Catálogo)
            </button>
            <button
              type="button"
              onClick={() => setStatus('in_review')}
              className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                status === 'in_review'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-[#090714] border-purple-900/20 text-slate-400 hover:text-white'
              }`}
            >
              En Revisión Interna
            </button>
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                status === 'draft'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-[#090714] border-purple-900/20 text-slate-400 hover:text-white'
              }`}
            >
              Borrador (Oculta)
            </button>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/templates')}
          className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rsd-glow-button px-8 py-3.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-xl disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando Plantilla...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar y Publicar Plantilla</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
