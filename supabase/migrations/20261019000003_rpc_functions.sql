-- ============================================================================
-- MIGRATION: 20261019000003_rpc_functions.sql
-- NUVIAX SAAS PLATFORM - RSD SOLUTIONS
-- Stored Procedures & Atomic Business Logic (RPC)
-- ============================================================================

-- 1. Helper function to normalize strings to valid URL slugs
CREATE OR REPLACE FUNCTION public.slugify(v_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(
                    unaccent(trim(v_text)), 
                    '[^a-zA-Z0-9\s-]', '', 'g'
                ),
                '[\s-]+', '-', 'g'
            ),
            '^-+|-+$', '', 'g'
        )
    );
EXCEPTION WHEN undefined_function THEN
    -- Fallback if unaccent is not enabled
    RETURN lower(
        regexp_replace(
            regexp_replace(trim(v_text), '[^a-zA-Z0-9\s-]', '', 'g'),
            '[\s-]+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. RPC: Get Guest info by secret token (Safe for Public/Anonymous)
CREATE OR REPLACE FUNCTION public.get_guest_by_token(p_token TEXT)
RETURNS TABLE (
    id UUID,
    event_id UUID,
    first_name TEXT,
    last_name TEXT,
    group_name TEXT,
    authorized_companions INTEGER,
    confirmed_companions INTEGER,
    rsvp_status TEXT,
    dietary_restrictions TEXT,
    notes TEXT,
    event_title TEXT,
    event_slug TEXT,
    event_status TEXT,
    event_date TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.event_id,
        g.first_name,
        g.last_name,
        g.group_name,
        g.authorized_companions,
        g.confirmed_companions,
        g.rsvp_status,
        g.dietary_restrictions,
        g.notes,
        e.title AS event_title,
        e.slug AS event_slug,
        e.status AS event_status,
        e.event_date,
        e.expires_at
    FROM public.guests g
    JOIN public.events e ON e.id = g.event_id
    WHERE g.invitation_token = p_token
      AND e.status = 'published'
      AND (e.expires_at IS NULL OR e.expires_at > now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. RPC: Submit RSVP by Token (Atomic & Secure)
CREATE OR REPLACE FUNCTION public.submit_guest_rsvp(
    p_invitation_token TEXT,
    p_rsvp_status TEXT,
    p_confirmed_companions INTEGER DEFAULT 0,
    p_dietary_restrictions TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_guest RECORD;
    v_event RECORD;
BEGIN
    -- Validate rsvp_status
    IF p_rsvp_status NOT IN ('confirmed', 'declined') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Estado de RSVP inválido.');
    END IF;

    -- Fetch guest
    SELECT * INTO v_guest
    FROM public.guests
    WHERE invitation_token = p_invitation_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invitación no encontrada.');
    END IF;

    -- Fetch event
    SELECT * INTO v_event
    FROM public.events
    WHERE id = v_guest.event_id;

    IF v_event.status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Este evento no se encuentra activo.');
    END IF;

    IF v_event.expires_at IS NOT NULL AND v_event.expires_at <= now() THEN
        RETURN jsonb_build_object('success', false, 'error', 'El plazo de esta invitación ha expirado.');
    END IF;

    -- Validate companions
    IF p_rsvp_status = 'confirmed' AND p_confirmed_companions > v_guest.authorized_companions THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', format('El número de acompañantes no puede exceder el límite permitido (%s).', v_guest.authorized_companions)
        );
    END IF;

    -- Update guest record
    UPDATE public.guests
    SET 
        rsvp_status = p_rsvp_status,
        confirmed_companions = CASE WHEN p_rsvp_status = 'confirmed' THEN GREATEST(0, p_confirmed_companions) ELSE 0 END,
        dietary_restrictions = p_dietary_restrictions,
        notes = p_notes,
        rsvp_responded_at = now(),
        updated_at = now()
    WHERE id = v_guest.id;

    RETURN jsonb_build_object(
        'success', true,
        'guest_name', concat(v_guest.first_name, ' ', v_guest.last_name),
        'rsvp_status', p_rsvp_status,
        'confirmed_companions', CASE WHEN p_rsvp_status = 'confirmed' THEN GREATEST(0, p_confirmed_companions) ELSE 0 END,
        'message', 'Respuesta guardada exitosamente.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: Submit Open RSVP (Direct from invitation page without personal token)
CREATE OR REPLACE FUNCTION public.submit_open_rsvp(
    p_event_slug TEXT,
    p_first_name TEXT,
    p_last_name TEXT DEFAULT '',
    p_rsvp_status TEXT DEFAULT 'confirmed',
    p_confirmed_companions INTEGER DEFAULT 0,
    p_dietary_restrictions TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_event RECORD;
    v_token TEXT;
    v_existing_id UUID;
    v_new_id UUID;
BEGIN
    IF trim(p_first_name) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'El nombre es requerido.');
    END IF;

    IF p_rsvp_status NOT IN ('confirmed', 'declined') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Estado de confirmación inválido.');
    END IF;

    SELECT * INTO v_event
    FROM public.events
    WHERE slug = p_event_slug;

    IF NOT FOUND OR v_event.status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'El evento no existe o no está publicado.');
    END IF;

    IF v_event.expires_at IS NOT NULL AND v_event.expires_at <= now() THEN
        RETURN jsonb_build_object('success', false, 'error', 'El plazo de esta invitación ha expirado.');
    END IF;

    -- Check if guest with identical name already RSVP'd for this event
    SELECT id INTO v_existing_id
    FROM public.guests
    WHERE event_id = v_event.id
      AND lower(first_name) = lower(trim(p_first_name))
      AND lower(last_name) = lower(trim(p_last_name));

    IF v_existing_id IS NOT NULL THEN
        -- Update existing response
        UPDATE public.guests
        SET 
            rsvp_status = p_rsvp_status,
            confirmed_companions = CASE WHEN p_rsvp_status = 'confirmed' THEN GREATEST(0, p_confirmed_companions) ELSE 0 END,
            dietary_restrictions = p_dietary_restrictions,
            notes = p_notes,
            rsvp_responded_at = now(),
            updated_at = now()
        WHERE id = v_existing_id;

        RETURN jsonb_build_object('success', true, 'updated', true, 'message', 'Tu confirmación ha sido actualizada.');
    END IF;

    -- Generate random secure token for guest
    v_token := encode(gen_random_bytes(16), 'hex');

    INSERT INTO public.guests (
        event_id,
        first_name,
        last_name,
        invitation_token,
        authorized_companions,
        confirmed_companions,
        rsvp_status,
        rsvp_responded_at,
        dietary_restrictions,
        notes
    ) VALUES (
        v_event.id,
        trim(p_first_name),
        trim(p_last_name),
        v_token,
        GREATEST(p_confirmed_companions, 0),
        CASE WHEN p_rsvp_status = 'confirmed' THEN GREATEST(0, p_confirmed_companions) ELSE 0 END,
        p_rsvp_status,
        now(),
        p_dietary_restrictions,
        p_notes
    ) RETURNING id INTO v_new_id;

    RETURN jsonb_build_object('success', true, 'id', v_new_id, 'token', v_token, 'message', 'Confirmación registrada con éxito.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: Reserve / Change Slug with Automatic Redirection Tracking
CREATE OR REPLACE FUNCTION public.reserve_event_slug(
    p_event_id UUID,
    p_new_slug TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_current_slug TEXT;
    v_owner_id UUID;
    v_clean_slug TEXT;
    v_exists BOOLEAN;
BEGIN
    -- Check permissions
    SELECT user_id, slug INTO v_owner_id, v_current_slug
    FROM public.events
    WHERE id = p_event_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Evento no encontrado.');
    END IF;

    IF v_owner_id != auth.uid() AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'No tienes permisos para modificar este evento.');
    END IF;

    v_clean_slug := public.slugify(p_new_slug);

    IF length(v_clean_slug) < 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'El slug debe tener al menos 3 caracteres.');
    END IF;

    -- Check if it's the exact same slug
    IF v_clean_slug = v_current_slug THEN
        RETURN jsonb_build_object('success', true, 'slug', v_clean_slug, 'unchanged', true);
    END IF;

    -- Check collisions in events
    SELECT EXISTS (
        SELECT 1 FROM public.events
        WHERE slug = v_clean_slug AND id != p_event_id
    ) INTO v_exists;

    IF v_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Este enlace ya está en uso. Por favor elige otro.');
    END IF;

    -- Record redirect from previous slug if the event was already using one
    IF v_current_slug IS NOT NULL AND v_current_slug != '' THEN
        INSERT INTO public.slug_redirects (event_id, old_slug)
        VALUES (p_event_id, v_current_slug)
        ON CONFLICT (old_slug) DO UPDATE
        SET event_id = EXCLUDED.event_id, created_at = now();
    END IF;

    -- Update slug
    UPDATE public.events
    SET slug = v_clean_slug, updated_at = now()
    WHERE id = p_event_id;

    RETURN jsonb_build_object('success', true, 'slug', v_clean_slug);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: Increment Event Views Safely
CREATE OR REPLACE FUNCTION public.increment_event_views(p_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.events
    SET views_count = views_count + 1
    WHERE slug = p_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
