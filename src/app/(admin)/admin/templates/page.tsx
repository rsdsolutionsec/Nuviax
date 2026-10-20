import { createClient } from '@/lib/supabase/server'
import { AdminTemplatesClient, AdminTemplate, AdminCategory } from './AdminTemplatesClient'

export const metadata = {
  title: 'Tipos de Invitaciones & Plantillas | Consola Nuviax',
  description: 'Gestión completa de plantillas organizada por tipos de eventos, ciclo de vida y disponibilidad para clientes.',
}

export default async function AdminTemplatesPage() {
  const supabase = await createClient()

  // 1. Fetch all invitation types (categories)
  const { data: categories = [] } = await supabase
    .from('categories')
    .select('id, name, code, icon_name, display_order')
    .order('display_order', { ascending: true })

  // 2. Fetch all templates with category information
  const { data: templates = [] } = await supabase
    .from('templates')
    .select(`
      id,
      code,
      name,
      description,
      thumbnail_url,
      artistic_style,
      assigned_developer,
      status,
      is_active,
      version,
      category_id,
      categories (
        id,
        name,
        code
      )
    `)
    .order('code', { ascending: true })

  // Formatted templates
  const formattedTemplates: AdminTemplate[] = (templates || []).map((t: any) => ({
    id: t.id,
    code: t.code,
    name: t.name,
    description: t.description,
    thumbnail_url: t.thumbnail_url,
    artistic_style: t.artistic_style,
    assigned_developer: t.assigned_developer,
    status: t.status,
    is_active: t.is_active,
    version: t.version,
    category_id: t.category_id,
    categories: t.categories,
  }))

  const formattedCategories: AdminCategory[] = categories || []

  return (
    <AdminTemplatesClient
      initialTemplates={formattedTemplates}
      categories={formattedCategories}
    />
  )
}
