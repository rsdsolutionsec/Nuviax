'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FONT_OPTIONS,
  ARTISTIC_STYLES,
  AVAILABLE_SECTIONS,
} from '@/lib/templates/contract'
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  Eye,
  ExternalLink,
} from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  code: string
}

export function EditTemplateFormClient({
  template,
  categories,
}: {
  template: any
  categories: CategoryItem[]
}) {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initial values from template
  const schemaDef = template.schema_definition || {}
  const themeOpts = schemaDef.theme_options || {}

  const [name, setName] = useState(template.name || '')
  const [categoryId, setCategoryId] = useState(template.category_id || categories[0]?.id || '')
  const [assignedDeveloper, setAssignedDeveloper] = useState(template.assigned_developer || 'Robin (Admin)')
  const [artisticStyle, setArtisticStyle] = useState(template.artistic_style || 'Gala Clásica Imperial')
  const [description, setDescription] = useState(template.description || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(template.thumbnail_url || '')

  // Typography & Theme
  const [headingFont, setHeadingFont] = useState(themeOpts.heading_font || 'Cinzel')
  const [bodyFont, setBodyFont] = useState(themeOpts.body_font || 'Plus Jakarta Sans')
  const [primaryColor, setPrimaryColor] = useState(themeOpts.primary_color || '#D4AF37')
  const [secondaryColor, setSecondaryColor] = useState(themeOpts.secondary_color || '#EC4899')
  const [backgroundColor, setBackgroundColor] = useState(themeOpts.background_color || '#070510')
  const [accentColor, setAccentColor] = useState(themeOpts.accent_color || '#8B5CF6')

  // Capabilities
  const [allowedSections, setAllowedSections] = useState<string[]>(
    schemaDef.allowed_sections || ['hero', 'ceremony', 'reception', 'rsvp']
  )
  const [status, setStatus] = useState<string>(template.status || 'published')
  const [version, setVersion] = useState<number>(template.version || 1)

  const toggleSection = (sectionId: string) => {
    if (sectionId === 'hero') return
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
      const updatedSchemaDef = {
        ...schemaDef,
        allowed_sections: allowedSections,
        theme_options: {
          heading_font: headingFont,
          body_font: bodyFont,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          background_color: backgroundColor,
          accent_color: accentColor,
        },
      }

      const payload = {
        id: template.id,
        name: name.trim(),
        category_id: categoryId,
        description: description.trim(),
        thumbnail_url: thumbnailUrl.trim(),
        artistic_style: artisticStyle,
        assigned_developer: assignedDeveloper,
        status,
        version,
        is_active: status === 'published',
        schema_definition: updatedSchemaDef,
      }

      const res = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        setErrorMessage(result.error || 'Ocurrió un error al actualizar la plantilla.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/templates')
        router.refresh()
      }, 1500)
    } catch {
      setErrorMessage('Error de conexión al actualizar.')
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
          <span>¡Plantilla actualizada con éxito! Redirigiendo...</span>
        </div>
      )}

      {/* SECTION 1: DATOS BÁSICOS */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <div className="flex items-center justify-between border-b border-purple-900/20 pb-4">
          <div>
            <span className="font-mono text-purple-400 text-xs font-bold block">{template.code}</span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Identificación y Metadatos</h2>
          </div>
          <a
            href={`/demo/${template.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <Eye className="w-3.5 h-3.5 text-pink-400" />
            <span>Ver Demo Actual</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Nombre de la Plantilla
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Versión
            </label>
            <input
              type="number"
              min={1}
              value={version}
              onChange={(e) => setVersion(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
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
              Desarrollador Responsable
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
            Descripción
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
            URL Imagen de Portada
          </label>
          <input
            type="url"
            required
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#090714] border border-purple-900/30 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* SECTION 2: TIPOGRAFÍA & COLORES */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-purple-900/20 pb-4">
          Tipografía & Paleta de Color
        </h2>

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

        {/* Live Font Sample */}
        <div className="p-5 rounded-xl bg-[#090714] border border-purple-900/20 text-center space-y-1">
          <p className={`text-2xl sm:text-3xl font-extrabold text-white ${selectedFontClass}`}>
            {name || 'Muestra de Título'}
          </p>
          <p className="text-xs text-purple-300 font-sans">
            Tipografía activa: {headingFont}
          </p>
        </div>

        {/* Colors */}
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
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Acento</span>
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

      {/* SECTION 3: ESTADO Y SECCIONES */}
      <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-purple-900/20 pb-4">
          Estado en Plataforma & Secciones
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Estado de Publicación
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['published', 'approved', 'in_review', 'draft'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border uppercase tracking-wider text-[11px] ${
                  status === st
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                    : 'bg-[#090714] border-purple-900/20 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Secciones Habilitadas
          </label>
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
      </div>

      {/* BUTTONS */}
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
              <span>Guardando Cambios...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
