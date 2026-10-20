import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CatalogClient, CatalogTemplate, CatalogCategory } from './CatalogClient'

export const metadata = {
  title: 'Catálogo de Diseños Disponibles | Nuviax',
  description: 'Descubre nuestra colección oficial de plantillas interactivas para bodas, cumpleaños y celebraciones.',
}

// Fallback templates in case DB fetch is unavailable
const FALLBACK_TEMPLATES: CatalogTemplate[] = [
  {
    id: 'boda-elegance-gold',
    code: 'boda-elegance-gold',
    name: 'Boda Imperial Gold',
    description: 'Acentos dorados, tipografía romana clásica, itinerario formal y confirmación de asistencia RSVP.',
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    artistic_style: 'Gala & Oro Clásico',
    category_code: 'bodas',
    category_name: 'Bodas & Compromisos',
    is_active: true,
    status: 'published',
  },
  {
    id: 'cumple-midnight-glam',
    code: 'cumple-midnight-glam',
    name: 'Cumpleaños Midnight Glam',
    description: 'Celebración nocturna con terciopelo negro, orbes de neón violeta y magenta, destellos animados, timeline interactivo y RSVP.',
    thumbnail_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    artistic_style: 'Midnight Glam & Velvet Glow',
    category_code: 'cumpleanos-adultos',
    category_name: 'Cumpleaños de Adultos',
    is_active: true,
    status: 'published',
  },
]

export default async function CatalogPage() {
  const supabase = await createClient()

  // 1. Fetch only actually available and published templates
  const { data: dbTemplates } = await supabase
    .from('templates')
    .select(`
      id,
      code,
      name,
      description,
      thumbnail_url,
      artistic_style,
      is_active,
      status,
      category_id,
      categories (
        id,
        name,
        code
      )
    `)
    .eq('is_active', true)
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  // 2. Fetch categories
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('id, name, code, display_order')
    .order('display_order', { ascending: true })

  // Format templates for client
  const templates: CatalogTemplate[] =
    dbTemplates && dbTemplates.length > 0
      ? dbTemplates.map((t: any) => ({
          id: t.id,
          code: t.code,
          name: t.name,
          description: t.description,
          thumbnail_url: t.thumbnail_url,
          artistic_style: t.artistic_style,
          category_id: t.category_id,
          category_name: t.categories?.name,
          category_code: t.categories?.code,
          is_active: t.is_active,
          status: t.status,
        }))
      : FALLBACK_TEMPLATES

  const categories: CatalogCategory[] = dbCategories || [
    { id: '1', name: 'Bodas & Compromisos', code: 'bodas', display_order: 1 },
    { id: '2', name: 'Quinceañeras & Sweet 16', code: 'quinceaneras', display_order: 2 },
    { id: '3', name: 'Cumpleaños Infantiles', code: 'cumpleanos-infantiles', display_order: 3 },
    { id: '4', name: 'Cumpleaños de Adultos', code: 'cumpleanos-adultos', display_order: 4 },
    { id: '5', name: 'Graduaciones', code: 'graduaciones', display_order: 5 },
    { id: '6', name: 'Baby Showers', code: 'baby-shower', display_order: 6 },
    { id: '7', name: 'Bautizos', code: 'bautizos', display_order: 7 },
    { id: '8', name: 'Aniversarios', code: 'aniversarios', display_order: 8 },
    { id: '9', name: 'Eventos Especiales', code: 'corporativo', display_order: 9 },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1">
        <CatalogClient templates={templates} categories={categories} />
      </main>
      <Footer />
    </div>
  )
}
