-- ============================================================================
-- MIGRATION: 20261019000004_seed_catalog.sql
-- NUVIAX SAAS PLATFORM - RSD SOLUTIONS
-- Initial Categories, Plans and Templates
-- ============================================================================

-- 1. Insert Initial Plans
INSERT INTO public.plans (code, name, description, price_usd, duration_days, limits, display_order, is_active)
VALUES 
(
    'essential',
    'Esencial',
    'Ideal para celebraciones íntimas y anuncios directos con elegancia.',
    19.99,
    30,
    '{
        "max_gallery_photos": 0,
        "max_guests": 50,
        "allow_rsvp": false,
        "allow_countdown": false,
        "allow_custom_slug": true,
        "allow_export_csv": false,
        "allow_custom_domain": false,
        "allow_music": false,
        "remove_watermark": false
    }'::jsonb,
    1,
    true
),
(
    'interactive',
    'Interactiva',
    'La opción más popular con cuenta regresiva, música, galería y confirmación de asistencia.',
    29.99,
    90,
    '{
        "max_gallery_photos": 8,
        "max_guests": 150,
        "allow_rsvp": true,
        "allow_countdown": true,
        "allow_custom_slug": true,
        "allow_export_csv": false,
        "allow_custom_domain": false,
        "allow_music": true,
        "remove_watermark": false
    }'::jsonb,
    2,
    true
),
(
    'event_pro',
    'Evento Pro',
    'Experiencia premium con panel de invitados avanzado, control de acompañantes y sin marca de agua.',
    49.99,
    180,
    '{
        "max_gallery_photos": 24,
        "max_guests": 500,
        "allow_rsvp": true,
        "allow_countdown": true,
        "allow_custom_slug": true,
        "allow_export_csv": true,
        "allow_custom_domain": true,
        "allow_music": true,
        "remove_watermark": true
    }'::jsonb,
    3,
    true
)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    price_usd = EXCLUDED.price_usd,
    duration_days = EXCLUDED.duration_days,
    limits = EXCLUDED.limits;

-- 2. Insert Categories
INSERT INTO public.categories (code, name, description, icon_name, display_order, is_active)
VALUES
('bodas', 'Bodas & Compromisos', 'Elegancia nupcial, romance atemporal y detalles inolvidables.', 'Heart', 1, true),
('quinceaneras', 'Quinceañeras & Sweet 16', 'Celebraciones mágicas, glamurosas y llenas de brillo.', 'Sparkles', 2, true),
('cumpleanos-infantiles', 'Cumpleaños Infantiles', 'Coloridas, divertidas y temáticas para los más pequeños.', 'PartyPopper', 3, true),
('cumpleanos-adultos', 'Cumpleaños de Adultos', 'Estilo sofisticado, noches de fiesta y aniversarios de vida.', 'Wine', 4, true),
('graduaciones', 'Graduaciones & Logros', 'Conmemoración académica con clase y orgullo.', 'GraduationCap', 5, true),
('baby-shower', 'Baby Showers & Revelación', 'Ternura, calidez y bienvenida a la nueva vida.', 'Baby', 6, true),
('bautizos', 'Bautizos & Primera Comunión', 'Espiritualidad, serenidad y momentos familiares sagrados.', 'Church', 7, true),
('aniversarios', 'Aniversarios', 'Renovación de amor y celebración de metas compartidas.', 'Gem', 8, true),
('corporativo', 'Eventos Especiales', 'Lanzamientos, galas y celebraciones a medida.', 'Calendar', 9, true)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name;

-- 3. Insert Base Templates
-- Template 1: Boda Real Dorada
INSERT INTO public.templates (
    category_id,
    code,
    name,
    description,
    thumbnail_url,
    schema_definition,
    default_config,
    compatible_plans,
    display_order,
    is_active
) VALUES (
    (SELECT id FROM public.categories WHERE code = 'bodas'),
    'boda-elegance-gold',
    'Elegance Gold',
    'Diseño nupcial majestuoso con acentos dorados, tipografía romana clásica y toques florales sutiles.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    '{
        "allowed_sections": ["hero", "countdown", "parents", "quote", "ceremony", "party", "itinerary", "gallery", "dress_code", "gifts", "rsvp"],
        "supports_music": true,
        "supports_gallery": true,
        "supports_countdown": true,
        "theme_options": {
            "primary_color": "#D4AF37",
            "secondary_color": "#1A162B",
            "background_style": "luxury-dark",
            "font_heading": "Cinzel",
            "font_body": "Montserrat"
        }
    }'::jsonb,
    '{
        "title": "Ana & Carlos",
        "subtitle": "Nuestra Boda",
        "hosts": "Ana Lucía Silva & Carlos Mendoza",
        "quote": "Dos vidas, un solo corazón latiendo juntos.",
        "date": "2026-11-28T17:00:00Z",
        "ceremony": {
            "name": "Ceremonia Religiosa",
            "time": "17:00",
            "location_name": "Parroquia Nuestra Señora de la Paz",
            "address": "Av. Principal 123",
            "map_url": "https://maps.google.com"
        },
        "reception": {
            "name": "Recepción & Fiesta",
            "time": "19:30",
            "location_name": "Hacienda Los Rosales",
            "address": "Km 14 Vía Campestre",
            "map_url": "https://maps.google.com"
        },
        "dress_code": "Formal / Rigurosa Etiqueta",
        "gifts": {
            "type": "envelope",
            "message": "Su presencia es nuestro mayor regalo. Si desean tener un detalle con nosotros, dispondremos de lluvia de sobres."
        }
    }'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'],
    1,
    true
)
ON CONFLICT (code) DO NOTHING;

-- Template 2: Quinceañera Glam Sparkle
INSERT INTO public.templates (
    category_id,
    code,
    name,
    description,
    thumbnail_url,
    schema_definition,
    default_config,
    compatible_plans,
    display_order,
    is_active
) VALUES (
    (SELECT id FROM public.categories WHERE code = 'quinceaneras'),
    'quince-glam-sparkle',
    'Glam Sparkle XV',
    'Estilo vibrante y glamuroso con tonalidades magenta, violeta y efecto de partículas luminosas.',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    '{
        "allowed_sections": ["hero", "countdown", "parents", "party", "itinerary", "gallery", "dress_code", "gifts", "rsvp"],
        "supports_music": true,
        "supports_gallery": true,
        "supports_countdown": true,
        "theme_options": {
            "primary_color": "#EC4899",
            "secondary_color": "#7C3AED",
            "background_style": "sparkle-neon",
            "font_heading": "Playfair Display",
            "font_body": "Inter"
        }
    }'::jsonb,
    '{
        "title": "Mis XV Años - Valentina",
        "subtitle": "Una noche mágica",
        "hosts": "Valentina Martínez",
        "quote": "Agradezco a Dios por estos quince años de vida y alegría.",
        "date": "2026-12-15T20:00:00Z",
        "reception": {
            "name": "Salón Real Crystal",
            "time": "20:00",
            "location_name": "Hotel Grand Palace",
            "address": "Calle 45 # 12-80",
            "map_url": "https://maps.google.com"
        },
        "dress_code": "Gala Elegante (Se reserva el color esmeralda para la quinceañera)"
    }'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'],
    2,
    true
)
ON CONFLICT (code) DO NOTHING;

-- Template 3: Cumpleaños Fiesta Neon Nights
INSERT INTO public.templates (
    category_id,
    code,
    name,
    description,
    thumbnail_url,
    schema_definition,
    default_config,
    compatible_plans,
    display_order,
    is_active
) VALUES (
    (SELECT id FROM public.categories WHERE code = 'cumpleanos-adultos'),
    'cumple-neon-fest',
    'Neon Fest & Cocktails',
    'Diseño moderno para celebraciones de 30, 40 o 50 años con estilo cóctel y música electrónica.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    '{
        "allowed_sections": ["hero", "countdown", "party", "itinerary", "gallery", "dress_code", "rsvp"],
        "supports_music": true,
        "supports_gallery": true,
        "supports_countdown": true,
        "theme_options": {
            "primary_color": "#8B5CF6",
            "secondary_color": "#06B6D4",
            "background_style": "cyber-party",
            "font_heading": "Outfit",
            "font_body": "Inter"
        }
    }'::jsonb,
    '{
        "title": "Sebastián - Nivel 30",
        "subtitle": "Celebración de cumpleaños",
        "hosts": "Sebastián R.",
        "quote": "La vida comienza a los 30. ¡Ven a brindar conmigo!",
        "date": "2026-11-20T21:00:00Z",
        "reception": {
            "name": "Sky Lounge Rooftop",
            "time": "21:00",
            "location_name": "Torre Central Piso 18",
            "address": "Av. Empresarial 500",
            "map_url": "https://maps.google.com"
        },
        "dress_code": "Casual Cóctel"
    }'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'],
    3,
    true
)
ON CONFLICT (code) DO NOTHING;
