import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Palette, Eye, CheckCircle2, AlertCircle, Filter, ArrowUpRight, Sparkles, Plus, Edit } from 'lucide-react'

export const metadata = {
  title: 'Gestión de Plantillas (18) | Consola Nuviax',
  description: 'Inventario, ciclo de vida, trazabilidad y control de calidad de las 18 plantillas de Nuviax.',
}

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ dev?: string; cat?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const devFilter = resolvedSearchParams?.dev || 'all'
  const catFilter = resolvedSearchParams?.cat || 'all'

  const supabase = await createClient()

  // Fetch templates joined with categories
  const { data: templates = [] } = await supabase
    .from('templates')
    .select(`
      id,
      code,
      name,
      description,
      is_active,
      status,
      version,
      assigned_developer,
      artistic_style,
      quality_checklist,
      created_at,
      categories(name)
    `)
    .order('code', { ascending: true })

  const filteredTemplates = (templates || []).filter((tpl: any) => {
    if (devFilter !== 'all' && tpl.assigned_developer !== devFilter) return false
    return true
  })

  // Group counts by dev
  const devCounts = {
    A: (templates || []).filter((t: any) => t.assigned_developer === 'Programador A').length,
    B: (templates || []).filter((t: any) => t.assigned_developer === 'Programador B').length,
    C: (templates || []).filter((t: any) => t.assigned_developer === 'Programador C').length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Biblioteca & Ciclo de Vida de Plantillas</h1>
          <p className="text-xs text-slate-400 mt-1">
            Catálogo completo de plantillas organizadas por frentes técnicos, versión y estándares de calidad.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-purple-900/30 border border-purple-800/40 text-purple-300 text-xs font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>{(templates || []).length} Plantillas Activas</span>
          </div>

          <Link
            href="/admin/templates/new"
            className="rsd-glow-button px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Plantilla</span>
          </Link>
        </div>
      </div>

      {/* Developer distribution cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#110D24] border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Frente Técnico A</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-bold">
              {devCounts.A}/6 Diseños
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Programador A: Bodas, Aniversarios y Parejas</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#110D24] border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Frente Técnico B</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-600/30 text-pink-300 text-[10px] font-bold">
              {devCounts.B}/6 Diseños
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Programador B: Cumpleaños Adultos/Infantiles y XV</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#110D24] border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Frente Técnico C</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold">
              {devCounts.C}/6 Diseños
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Programador C: Baby Showers, Bautizos y Grados</p>
        </div>
      </div>

      {/* Templates Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">Listado de Plantillas del Sistema</h2>
            <p className="text-xs text-slate-400">Total filtradas: {filteredTemplates.length} de {(templates || []).length}</p>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/templates"
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                devFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </Link>
            <Link
              href="/admin/templates?dev=Programador+A"
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                devFilter === 'Programador A'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Dev A
            </Link>
            <Link
              href="/admin/templates?dev=Programador+B"
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                devFilter === 'Programador B'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Dev B
            </Link>
            <Link
              href="/admin/templates?dev=Programador+C"
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                devFilter === 'Programador C'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Dev C
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Código / Nombre</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Responsable</th>
                <th className="py-3.5 px-4">Estilo Visual</th>
                <th className="py-3.5 px-4">Versión</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {filteredTemplates.map((tpl: any) => (
                <tr key={tpl.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-purple-400 text-[11px] font-bold block">{tpl.code}</span>
                    <span className="font-bold text-white block mt-0.5">{tpl.name}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {tpl.categories?.name || 'General'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                      {tpl.assigned_developer || 'RSD Core'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {tpl.artistic_style || 'Editorial'}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-purple-300">
                    v{tpl.version || 1}.0
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tpl.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : tpl.status === 'approved'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tpl.status || 'published'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/templates/${tpl.id}/edit`}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Editar parámetros de plantilla"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href={`/demo/${tpl.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 inline-flex items-center"
                        title="Abrir demo en vivo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
