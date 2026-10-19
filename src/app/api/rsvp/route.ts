import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const rsvpSchema = z.object({
  token: z.string().optional(),
  slug: z.string().min(1),
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  rsvpStatus: z.enum(['confirmed', 'declined']),
  companions: z.number().int().min(0).max(10).default(0),
  dietaryRestrictions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parseResult = rsvpSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { token, slug, fullName, rsvpStatus, companions, dietaryRestrictions, notes } =
      parseResult.data

    const supabase = createAdminClient()

    // 1. Fetch Event to check status & expiration
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, status, expires_at, plan_id, content_data')
      .eq('slug', slug)
      .maybeSingle()

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    if (event.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Esta invitación no se encuentra publicada' },
        { status: 400 }
      )
    }

    if (event.expires_at && new Date(event.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'El plazo de esta invitación ha expirado' },
        { status: 400 }
      )
    }

    // 2. If token is provided, update specific guest
    if (token) {
      const { data: guest, error: guestError } = await supabase
        .from('guests')
        .select('id, authorized_companions')
        .eq('invitation_token', token)
        .eq('event_id', event.id)
        .maybeSingle()

      if (guestError || !guest) {
        return NextResponse.json(
          { success: false, error: 'Invitación personalizada no válida' },
          { status: 404 }
        )
      }

      if (rsvpStatus === 'confirmed' && companions > guest.authorized_companions) {
        return NextResponse.json(
          {
            success: false,
            error: `El número de acompañantes excede el límite permitido (${guest.authorized_companions})`,
          },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('guests')
        .update({
          rsvp_status: rsvpStatus,
          confirmed_companions: rsvpStatus === 'confirmed' ? companions : 0,
          dietary_restrictions: dietaryRestrictions || null,
          notes: notes || null,
          rsvp_responded_at: new Date().toISOString(),
        })
        .eq('id', guest.id)

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Error al actualizar tu confirmación' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Confirmación registrada con éxito',
      })
    }

    // 3. Open RSVP: Look for existing guest by name to avoid duplicate records
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0] || fullName.trim()
    const lastName = nameParts.slice(1).join(' ')

    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('event_id', event.id)
      .ilike('first_name', firstName)
      .ilike('last_name', lastName)
      .maybeSingle()

    if (existingGuest) {
      await supabase
        .from('guests')
        .update({
          rsvp_status: rsvpStatus,
          confirmed_companions: rsvpStatus === 'confirmed' ? companions : 0,
          dietary_restrictions: dietaryRestrictions || null,
          notes: notes || null,
          rsvp_responded_at: new Date().toISOString(),
        })
        .eq('id', existingGuest.id)

      return NextResponse.json({
        success: true,
        updated: true,
        message: 'Tu confirmación ha sido actualizada con éxito',
      })
    }

    // Insert new guest response
    const randomToken = Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
    const { error: insertError } = await supabase.from('guests').insert({
      event_id: event.id,
      first_name: firstName,
      last_name: lastName,
      invitation_token: randomToken,
      authorized_companions: companions,
      confirmed_companions: rsvpStatus === 'confirmed' ? companions : 0,
      rsvp_status: rsvpStatus,
      rsvp_responded_at: new Date().toISOString(),
      dietary_restrictions: dietaryRestrictions || null,
      notes: notes || null,
    })

    if (insertError) {
      return NextResponse.json(
        { success: false, error: 'Error al registrar la confirmación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmación registrada con éxito',
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
