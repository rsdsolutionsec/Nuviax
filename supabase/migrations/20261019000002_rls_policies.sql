-- ============================================================================
-- MIGRATION: 20261019000002_rls_policies.sql
-- NUVIAX SAAS PLATFORM - RSD SOLUTIONS
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user has an 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Profiles are viewable by owner or admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- USER ROLES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own roles, admins can view all"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Only admins can manage roles"
    ON public.user_roles FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Categories viewable by public if active, all by admin"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can insert/update/delete categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- PLANS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Plans viewable by public if active, all by admin"
    ON public.plans FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage plans"
    ON public.plans FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- TEMPLATES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Templates viewable by public if active, all by admin"
    ON public.templates FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage templates"
    ON public.templates FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- EVENTS POLICIES
-- ----------------------------------------------------------------------------
-- 1. SELECT: Owner can see own, admin can see all, public can see published & active events
CREATE POLICY "Events readable by owner, admin, or public if published"
    ON public.events FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_admin() 
        OR (status = 'published')
    );

-- 2. INSERT: Authenticated users can create events for themselves
CREATE POLICY "Users can create their own events"
    ON public.events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE: Event owner can update their own event, or admin
CREATE POLICY "Users can update their own events"
    ON public.events FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 4. DELETE: Event owner or admin can delete
CREATE POLICY "Users can delete their own events"
    ON public.events FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- ----------------------------------------------------------------------------
-- GUESTS POLICIES (Strict Isolation: Public cannot read guest lists)
-- ----------------------------------------------------------------------------
CREATE POLICY "Guests viewable only by event owner or admin"
    ON public.guests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = guests.event_id
            AND (events.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Guests insertable only by event owner or admin"
    ON public.guests FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = guests.event_id
            AND (events.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Guests updatable only by event owner or admin"
    ON public.guests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = guests.event_id
            AND (events.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Guests deletable only by event owner or admin"
    ON public.guests FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = guests.event_id
            AND (events.user_id = auth.uid() OR public.is_admin())
        )
    );

-- ----------------------------------------------------------------------------
-- ORDERS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Orders viewable by owner or admin"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create orders for their own events"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders updatable by admin only"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- PAYMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Payments viewable by order owner or admin"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
        OR public.is_admin()
    );

CREATE POLICY "Only admins or service role can manage payments"
    ON public.payments FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- SLUG REDIRECTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Slug redirects viewable by public"
    ON public.slug_redirects FOR SELECT
    USING (true);

CREATE POLICY "Slug redirects manageable by event owner or admin"
    ON public.slug_redirects FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = slug_redirects.event_id
            AND (events.user_id = auth.uid() OR public.is_admin())
        )
    );

-- ----------------------------------------------------------------------------
-- EVENT DOMAINS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Event domains viewable and manageable by owner or admin"
    ON public.event_domains FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_domains.event_id
            AND (events.user_id = auth.uid() OR public.is_admin())
        )
    );

-- ----------------------------------------------------------------------------
-- AUDIT LOGS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Audit logs viewable only by admin"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Audit logs insertable by system"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);
