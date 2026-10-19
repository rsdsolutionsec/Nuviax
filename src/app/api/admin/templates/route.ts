import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CreateTemplateSchema } from '@/lib/templates/contract'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Verify admin role on server
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado. Debe iniciar sesión.' }, { status: 401 })
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Acceso denegado. Se requiere rol de administrador.' }, { status: 403 })
    }

    // 2. Validate payload
    const body = await req.json()
    const parsed = CreateTemplateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos de plantilla inválidos', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const adminSupabase = createAdminClient()

    // 3. Assemble schema_definition & default_config
    const schemaDefinition = {
      allowed_sections: data.allowed_sections,
      supports_music: data.supports_music,
      supports_gallery: data.supports_gallery,
      supports_countdown: data.supports_countdown,
      theme_options: data.theme_options,
    }

    const defaultConfig = {
      ...data.example_data,
      theme: data.theme_options,
    }

    // 4. Insert into templates table
    const { data: newTemplate, error: insertError } = await adminSupabase
      .from('templates')
      .insert({
        code: data.code.toUpperCase(),
        name: data.name,
        category_id: data.category_id,
        description: data.description,
        thumbnail_url: data.thumbnail_url,
        artistic_style: data.artistic_style,
        assigned_developer: data.assigned_developer,
        status: data.status,
        is_active: data.is_active,
        version: 1,
        schema_definition: schemaDefinition,
        default_config: defaultConfig,
        compatible_plans: ['essential', 'interactive', 'event_pro'],
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: `El código de plantilla "${data.code}" ya está en uso. Elige otro identificador.` },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // 5. Register in audit_logs
    await adminSupabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CREATE_TEMPLATE',
      resource_type: 'templates',
      resource_id: newTemplate.id,
      details: {
        code: newTemplate.code,
        name: newTemplate.name,
        assigned_developer: newTemplate.assigned_developer,
      },
    })

    return NextResponse.json({ success: true, template: newTemplate }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Se requiere el ID de la plantilla' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    const { data: updatedTemplate, error: updateError } = await adminSupabase
      .from('templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log update
    await adminSupabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_TEMPLATE',
      resource_type: 'templates',
      resource_id: id,
      details: updates,
    })

    return NextResponse.json({ success: true, template: updatedTemplate })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
  }
}
