-- ============================================================================
-- MIGRATION: 20261019000005_v2_features_and_roles.sql
-- NUVIAX SAAS PLATFORM - RSD SOLUTIONS
-- V2 Features: Advisor Role, Private Demo Tokens, Template Lifecycle & Exceptions
-- ============================================================================

-- 1. Update user_roles check constraint to include 'advisor'
ALTER TABLE public.user_roles 
    DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE public.user_roles 
    ADD CONSTRAINT user_roles_role_check 
    CHECK (role IN ('admin', 'advisor', 'support', 'customer'));

-- 2. Add Private Demo Token fields to Events
ALTER TABLE public.events
    ADD COLUMN IF NOT EXISTS demo_token TEXT UNIQUE DEFAULT md5(random()::text || clock_timestamp()::text),
    ADD COLUMN IF NOT EXISTS demo_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS demo_revoked BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS template_version INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS entitlement_overrides JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_events_demo_token ON public.events(demo_token);

-- 3. Add Template Lifecycle and Developer Tracking to Templates
ALTER TABLE public.templates
    ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
    ADD COLUMN IF NOT EXISTS assigned_developer TEXT,
    ADD COLUMN IF NOT EXISTS quality_checklist JSONB NOT NULL DEFAULT '{"mobile_verified": true, "preview_verified": true, "og_verified": true}'::jsonb,
    ADD COLUMN IF NOT EXISTS artistic_style TEXT DEFAULT 'Moderno & Sofisticado';

-- 4. Add Order Snapshot Fields to Orders
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS snapshot_features JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS duration_days INTEGER NOT NULL DEFAULT 30;

-- 5. Admin Exceptions Table (Audit log for manual plan/entitlement adjustments)
CREATE TABLE IF NOT EXISTS public.admin_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    action_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_exceptions_event ON public.admin_exceptions(event_id);
ALTER TABLE public.admin_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin exceptions viewable only by admin and advisor"
    ON public.admin_exceptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'advisor')
        )
    );

CREATE POLICY "Admin exceptions insertable only by admin"
    ON public.admin_exceptions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Helper function: Check if current user is advisor
CREATE OR REPLACE FUNCTION public.is_advisor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'advisor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. Advisor RLS Policies (Read-Only access to profiles, events and orders; NO ACCESS to guests)
-- Profiles: advisors can view customer profiles
CREATE POLICY "Advisors can view customer profiles"
    ON public.profiles FOR SELECT
    USING (public.is_advisor());

-- Events: advisors can view all events in read-only mode
CREATE POLICY "Advisors can view all events"
    ON public.events FOR SELECT
    USING (public.is_advisor());

-- Orders: advisors can view orders
CREATE POLICY "Advisors can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_advisor());

-- 8. RPC: Verify or regenerate Private Demo Token
CREATE OR REPLACE FUNCTION public.regenerate_demo_token(p_event_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_owner_id UUID;
    v_new_token TEXT;
BEGIN
    SELECT user_id INTO v_owner_id
    FROM public.events
    WHERE id = p_event_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Evento no encontrado.');
    END IF;

    IF v_owner_id != auth.uid() AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'No tienes permisos sobre este evento.');
    END IF;

    v_new_token := md5(random()::text || clock_timestamp()::text);

    UPDATE public.events
    SET demo_token = v_new_token,
        demo_revoked = false,
        demo_expires_at = now() + interval '30 days',
        updated_at = now()
    WHERE id = p_event_id;

    RETURN jsonb_build_object('success', true, 'demo_token', v_new_token);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RPC: Revoke Private Demo Token
CREATE OR REPLACE FUNCTION public.revoke_demo_token(p_event_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_owner_id UUID;
BEGIN
    SELECT user_id INTO v_owner_id
    FROM public.events
    WHERE id = p_event_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Evento no encontrado.');
    END IF;

    IF v_owner_id != auth.uid() AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'No tienes permisos sobre este evento.');
    END IF;

    UPDATE public.events
    SET demo_revoked = true,
        updated_at = now()
    WHERE id = p_event_id;

    RETURN jsonb_build_object('success', true, 'message', 'Enlace de demostración revocado con éxito.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
