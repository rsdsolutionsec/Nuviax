/**
 * SCRIPT DE REGISTRO AUTOMÁTICO DE PLANTILLAS — NUVIAX (RSD SOLUTIONS)
 * 
 * Uso:
 * node scripts/register-template.mjs --code BOD-002 --slug boda-romance-floral --name "Boda Romance Floral" --category boda --plan interactive --style "Romántico Floral"
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    let value = match[2] || ''
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    env[match[1]] = value.trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no encontrados en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Parse arguments
const args = process.argv.slice(2)
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const code = (getArg('code') || '').toUpperCase()
const slug = (getArg('slug') || '').toLowerCase()
const name = getArg('name')
const categorySlug = (getArg('category') || 'boda').toLowerCase()
const planCode = (getArg('plan') || 'interactive').toLowerCase()
const style = getArg('style') || 'Diseño Exclusivo RSD'
const developer = getArg('developer') || 'Robin (RSD Solutions)'
const thumbnail = getArg('thumbnail') || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'

if (!code || !slug || !name) {
  console.log(`
ℹ️ USO DEL COMANDO:
node scripts/register-template.mjs \\
  --code "XV-001" \\
  --slug "quince-neon-glow" \\
  --name "Quinceañera Neón Glow" \\
  --category "quinceanera" \\
  --plan "interactive" \\
  --style "Neón Vibrante" \\
  --developer "Robin"
  `)
  process.exit(1)
}

async function run() {
  console.log(`🚀 Registrando plantilla [${code}] en Supabase...`)

  // 1. Fetch category
  const { data: category, error: catErr } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('slug', `%${categorySlug}%`)
    .limit(1)
    .maybeSingle()

  if (catErr || !category) {
    console.error(`❌ Categoría '${categorySlug}' no encontrada en la base de datos.`)
    process.exit(1)
  }

  // 2. Fetch plan
  const { data: plan, error: planErr } = await supabase
    .from('plans')
    .select('id, name')
    .eq('code', planCode)
    .maybeSingle()

  if (planErr || !plan) {
    console.error(`❌ Plan '${planCode}' no encontrado en la base de datos.`)
    process.exit(1)
  }

  // 3. Upsert template in database
  const templatePayload = {
    code,
    slug,
    name,
    category_id: category.id,
    min_plan_id: plan.id,
    developer_track: developer,
    artistic_style: style,
    thumbnail_url: thumbnail,
    preview_url: `/demo/${slug}`,
    is_active: true,
    schema_definition: {
      supported_sections: ['ceremony', 'reception', 'itinerary', 'gallery', 'dress_code', 'gifts', 'rsvp'],
      theme_options: {
        primary_color: '#A855F7',
        accent_color: '#EC4899',
        heading_font: 'Cinzel',
      },
    },
    example_data: {
      title: name,
      subtitle: category.name,
      hosts: 'Anfitriones del Evento',
      quote: 'Una noche única llena de momentos inolvidables.',
      date: '2026-11-28T18:00:00Z',
    },
  }

  const { data: existing } = await supabase
    .from('templates')
    .select('id')
    .eq('code', code)
    .maybeSingle()

  let resultErr = null
  if (existing) {
    const { error } = await supabase
      .from('templates')
      .update(templatePayload)
      .eq('id', existing.id)
    resultErr = error
  } else {
    const { error } = await supabase
      .from('templates')
      .insert(templatePayload)
    resultErr = error
  }

  if (resultErr) {
    console.error('❌ Error guardando en Supabase:', resultErr.message)
    process.exit(1)
  }

  console.log(`✅ ¡Plantilla [${code}] registrada exitosamente en Supabase!`)
  console.log(`👉 Ahora puedes probarla en tu navegador en: http://localhost:3000/demo/${slug}`)
}

run()
