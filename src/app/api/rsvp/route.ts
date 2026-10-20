import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const rsvpSchema = z.object({
  token: z.string().optional().nullable(),
  slug: z.string().min(1),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  phone: z.string().min(6, 'Ingresa un número de teléfono válido (mínimo 6 dígitos)').optional(),
  fullName: z.string().optional(), // Fallback
  rsvpStatus: z.enum(['confirmed', 'declined']),
  companions: z.number().int().min(0).max(10).default(0),
  dietaryRestrictions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  botHoneypot: z.string().optional().nullable(), // Anti-spam bot trap
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parseResult = rsvpSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Datos de confirmación inválidos' },
        { status: 400 }
      )
    }

    const {
      token,
      slug,
      firstName: rawFirstName,
      lastName: rawLastName,
      phone: rawPhone,
      fullName: rawFullName,
      rsvpStatus,
      companions,
      dietaryRestrictions,
      notes,
      botHoneypot,
    } = parseResult.data

    // Anti-spam honeypot check: If the hidden bot field is filled, silently discard
    if (botHoneypot && botHoneypot.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Confirmación procesada exitosamente',
      })
    }

    // Resolve first name and last name
    let firstName = (rawFirstName || '').trim()
    let lastName = (rawLastName || '').trim()

    if (!firstName && rawFullName) {
      const parts = rawFullName.trim().split(' ')
      firstName = parts[0] || 'Invitado'
      lastName = parts.slice(1).join(' ') || ''
    }

    if (!firstName) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa tu nombre de pila.' },
        { status: 400 }
      )
    }

    if (!lastName) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa tu apellido.' },
        { status: 400 }
      )
    }

    // Clean phone number (strip whitespace, dashes, parentheses)
    const phone = rawPhone ? rawPhone.trim().replace(/[^0-9+]/g, '') : null

    if (!phone || phone.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un número de teléfono de contacto válido.' },
        { status: 400 }
      )
    }

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
        { success: false, error: 'Esta invitación no se encuentra publicada actualmente' },
        { status: 400 }
      )
    }

    if (event.expires_at && new Date(event.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'El plazo de confirmación de esta invitación ha concluido' },
        { status: 400 }
      )
    }

    // 2. TOKEN-BASED RSVP: Update specific invited guest
    if (token) {
      const { data: guest, error: guestError } = await supabase
        .from('guests')
        .select('id, authorized_companions, first_name, last_name, phone')
        .eq('invitation_token', token)
        .eq('event_id', event.id)
        .maybeSingle()

      if (guestError || !guest) {
        return NextResponse.json(
          { success: false, error: 'Invitación personalizada no válida o expirada' },
          { status: 404 }
        )
      }

      if (rsvpStatus === 'confirmed' && companions > (guest.authorized_companions || 0)) {
        return NextResponse.json(
          {
            success: false,
            error: `El número de acompañantes excede el límite asignado (${guest.authorized_companions})`,
          },
          { status: 400 }
        )
      }

      const { data: updatedGuest, error: updateError } = await supabase
        .from('guests')
        .update({
          first_name: firstName || guest.first_name,
          last_name: lastName || guest.last_name,
          phone: phone || guest.phone,
          rsvp_status: rsvpStatus,
          confirmed_companions: rsvpStatus === 'confirmed' ? companions : 0,
          dietary_restrictions: dietaryRestrictions || null,
          notes: notes || null,
          rsvp_responded_at: new Date().toISOString(),
        })
        .eq('id', guest.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Error al actualizar tu confirmación de asistencia' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        updated: true,
        guest: updatedGuest,
        message: '¡Tu confirmación de asistencia ha sido registrada con éxito!',
      })
    }

    // 3. OPEN RSVP (Anti-spam Deduplication by Phone & Name)
    // First, search for an existing RSVP with this exact phone number for this event
    let existingGuest = null

    if (phone) {
      const { data: byPhone } = await supabase
        .from('guests')
        .select('id, authorized_companions, first_name, last_name')
        .eq('event_id', event.id)
        .eq('phone', phone)
        .maybeSingle()

      existingGuest = byPhone
    }

    // If not found by phone, search by first and last name
    if (!existingGuest) {
      const { data: byName } = await supabase
        .from('guests')
        .select('id, authorized_companions, first_name, last_name')
        .eq('event_id', event.id)
        .ilike('first_name', firstName)
        .ilike('last_name', lastName)
        .maybeSingle()

      existingGuest = byName
    }

    // If already registered, update their record (prevent duplicate spam rows!)
    if (existingGuest) {
      const { data: updatedGuest, error: updateError } = await supabase
        .from('guests')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          rsvp_status: rsvpStatus,
          confirmed_companions: rsvpStatus === 'confirmed' ? companions : 0,
          dietary_restrictions: dietaryRestrictions || null,
          notes: notes || null,
          rsvp_responded_at: new Date().toISOString(),
        })
        .eq('id', existingGuest.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Error al actualizar tu confirmación.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        updated: true,
        guest: updatedGuest,
        message: 'Tu confirmación anterior fue actualizada correctamente.',
      })
    }

    // Insert new guest record
    const randomToken = Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
    const { data: newGuest, error: insertError } = await supabase
      .from('guests')
      .insert({
        event_id: event.id,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        invitation_token: randomToken,
        authorized_companions: companions,
        confirmed_companions: rsvpStatus === 'confirmed' ? companions : 0,
        rsvp_status: rsvpStatus,
        rsvp_responded_at: new Date().toISOString(),
        dietary_restrictions: dietaryRestrictions || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { success: false, error: 'Error al registrar la confirmación en el sistema' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updated: false,
      guest: newGuest,
      message: '¡Confirmación registrada con éxito! Los anfitriones han recibido tu respuesta.',
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al procesar la confirmación' },
      { status: 500 }
    )
  }
}
