import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditTemplateFormClient } from './EditTemplateFormClient'

export const metadata = {
  title: 'Editar Plantilla | Consola Nuviax',
  description: 'Modificación de parámetros artísticos, tipografía y estado de plantilla.',
}

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: template } = await supabase
    .from('templates')
    .select('*, categories(id, name, code)')
    .eq('id', id)
    .maybeSingle()

  if (!template) {
    notFound()
  }

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
            <span className="text-[11px] text-pink-400 font-bold uppercase tracking-widest font-mono">
              {template.code}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Editar Plantilla: {template.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ajusta los metadatos artísticos, paleta de colores, tipografía y estado del ciclo de vida.
          </p>
        </div>
      </div>

      <EditTemplateFormClient template={template} categories={categories || []} />
    </div>
  )
}
