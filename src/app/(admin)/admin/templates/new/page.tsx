import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Palette } from 'lucide-react'
import { TemplateFormClient } from './TemplateFormClient'

export const metadata = {
  title: 'Crear Nueva Plantilla | Consola Nuviax',
  description: 'Diseño, configuración visual y registro de nuevas plantillas de invitación.',
}

export default async function NewTemplatePage() {
  const supabase = await createClient()

  // Fetch categories from DB
  const { data: categories = [] } = await supabase
    .from('categories')
    .select('id, name, code')
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/templates"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest">
              Motor de Plantillas
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[11px] text-pink-400 font-bold uppercase tracking-widest">
              Creador de Diseños
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Diseñar & Registrar Nueva Plantilla
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configura la identidad artística, paleta de colores, tipografía y esquema de secciones para el catálogo de Nuviax.
          </p>
        </div>
      </div>

      {/* Main Creation Form Component */}
      <TemplateFormClient categories={categories || []} />
    </div>
  )
}
